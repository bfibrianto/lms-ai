import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { getQuizFileDownloadUrl } from '@/lib/s3';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin/mentor
    const allowedRoles = ['SUPER_ADMIN', 'HR_ADMIN', 'MENTOR'];
    if (!allowedRoles.includes(session.user.role)) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const { quizId } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const studentId = searchParams.get('studentId');

    // Get quiz to verify it exists
    const quiz = await db.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json({ success: false, error: 'Quiz not found' }, { status: 404 });
    }

    // Build where clause
    const where: any = {
      quizId,
      submittedAt: { not: null }, // Only submitted attempts
    };

    if (studentId) {
      where.enrollment = {
        userId: studentId,
      };
    }

    // Get total count
    const total = await db.quizAttempt.count({ where });

    // Get attempts with answers
    const attempts = await db.quizAttempt.findMany({
      where,
      include: {
        enrollment: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        answers: {
          include: {
            question: true,
          },
        },
      },
      orderBy: { submittedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Process submissions and generate signed URLs for file uploads
    const submissions = await Promise.all(
      attempts.map(async (attempt) => {
        const answers = await Promise.all(
          attempt.answers.map(async (answer) => {
            let uploadedFiles = null;

            if (answer.question.type === 'FILE_UPLOAD' && answer.uploadedFiles) {
              const files = answer.uploadedFiles as any[];
              uploadedFiles = await Promise.all(
                files.map(async (file: any) => {
                  const signedUrl = await getQuizFileDownloadUrl(file.fileKey, 3600);
                  return {
                    ...file,
                    downloadUrl: signedUrl,
                  };
                })
              );
            }

            return {
              questionId: answer.questionId,
              questionText: answer.question.text,
              questionType: answer.question.type,
              optionId: answer.optionId,
              essayText: answer.essayText,
              uploadedFiles,
              score: answer.score,
              feedback: answer.feedback,
            };
          })
        );

        return {
          attemptId: attempt.id,
          student: {
            id: attempt.enrollment.user.id,
            name: attempt.enrollment.user.name,
            email: attempt.enrollment.user.email,
          },
          score: attempt.score,
          passed: attempt.passed,
          submittedAt: attempt.submittedAt,
          answers,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        submissions,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching quiz submissions:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
