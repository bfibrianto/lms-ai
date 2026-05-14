import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { answerId, score, feedback } = body;

    if (!answerId || score === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate score
    if (typeof score !== 'number' || score < 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid score value' },
        { status: 400 }
      );
    }

    // Get the answer to verify it exists and get question points
    const answer = await db.attemptAnswer.findUnique({
      where: { id: answerId },
      include: {
        question: true,
        attempt: {
          include: {
            quiz: true,
          },
        },
      },
    });

    if (!answer) {
      return NextResponse.json({ success: false, error: 'Answer not found' }, { status: 404 });
    }

    // Validate score doesn't exceed question points
    if (score > answer.question.points) {
      return NextResponse.json(
        { success: false, error: `Score cannot exceed ${answer.question.points} points` },
        { status: 400 }
      );
    }

    // Update the answer with score and feedback
    await db.attemptAnswer.update({
      where: { id: answerId },
      data: {
        score,
        feedback: feedback || null,
      },
    });

    // Recalculate quiz attempt total score
    const allAnswers = await db.attemptAnswer.findMany({
      where: { attemptId: answer.attemptId },
      include: { question: true },
    });

    let totalScore = 0;
    let totalPoints = 0;
    let allGraded = true;

    for (const ans of allAnswers) {
      totalPoints += ans.question.points;
      if (ans.score !== null && ans.score !== undefined) {
        totalScore += ans.score;
      } else {
        allGraded = false;
      }
    }

    // Only update attempt score if all questions are graded
    if (allGraded && totalPoints > 0) {
      const percentageScore = Math.round((totalScore / totalPoints) * 100);
      const passed = percentageScore >= answer.attempt.quiz.passingScore;

      await db.quizAttempt.update({
        where: { id: answer.attemptId },
        data: {
          score: percentageScore,
          passed,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Answer graded successfully',
    });
  } catch (error) {
    console.error('Error grading answer:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
