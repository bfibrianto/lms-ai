import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { uploadQuizFile, deleteQuizFile } from '@/lib/s3';
import { v4 as uuidv4 } from 'uuid';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB default max

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const attemptId = formData.get('attemptId') as string;
    const questionId = formData.get('questionId') as string;
    const file = formData.get('file') as File;

    if (!attemptId || !questionId || !file) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify that the attempt belongs to the current user
    const attempt = await db.quizAttempt.findUnique({
      where: { id: attemptId },
      include: {
        enrollment: true,
        quiz: true,
      },
    });

    if (!attempt) {
      return NextResponse.json({ success: false, error: 'Quiz attempt not found' }, { status: 404 });
    }

    if (attempt.enrollment.userId !== session.user.id) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    // Check if quiz is already submitted
    if (attempt.submittedAt) {
      return NextResponse.json(
        { success: false, error: 'Quiz already submitted. Cannot upload files.' },
        { status: 400 }
      );
    }

    // Get question details to validate file
    const question = await db.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      return NextResponse.json({ success: false, error: 'Question not found' }, { status: 404 });
    }

    if (question.type !== 'FILE_UPLOAD') {
      return NextResponse.json(
        { success: false, error: 'Question type is not FILE_UPLOAD' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedFileTypes = question.allowedFileTypes
      ? JSON.parse(question.allowedFileTypes as string)
      : [];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (allowedFileTypes.length > 0 && !allowedFileTypes.includes(fileExtension)) {
      return NextResponse.json(
        {
          success: false,
          error: `File type not allowed. Allowed types: ${allowedFileTypes.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Validate file size
    const maxFileSizeMB = question.maxFileSizeMB || 10;
    const maxFileSizeBytes = maxFileSizeMB * 1024 * 1024;

    if (file.size > maxFileSizeBytes) {
      return NextResponse.json(
        {
          success: false,
          error: `File size exceeds maximum allowed size of ${maxFileSizeMB}MB`,
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: `File size exceeds system maximum of 50MB` },
        { status: 400 }
      );
    }

    // Check existing files count
    const existingAnswer = await db.attemptAnswer.findUnique({
      where: {
        attemptId_questionId: {
          attemptId,
          questionId,
        },
      },
    });

    const existingFiles = existingAnswer?.uploadedFiles
      ? (existingAnswer.uploadedFiles as any[])
      : [];
    const maxFileCount = question.maxFileCount || 1;

    if (existingFiles.length >= maxFileCount) {
      return NextResponse.json(
        {
          success: false,
          error: `Maximum number of files (${maxFileCount}) already uploaded`,
        },
        { status: 400 }
      );
    }

    // Upload file to MinIO
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const uniqueFileName = `${uuidv4()}.${fileExtension}`;
    const { key, url } = await uploadQuizFile(
      attemptId,
      questionId,
      uniqueFileName,
      fileBuffer,
      file.type
    );

    // Save file metadata to database
    const fileMetadata = {
      fileName: file.name,
      fileKey: key,
      fileUrl: url,
      fileSize: file.size,
      uploadedAt: new Date().toISOString(),
    };

    const updatedFiles = [...existingFiles, fileMetadata];

    await db.attemptAnswer.upsert({
      where: {
        attemptId_questionId: {
          attemptId,
          questionId,
        },
      },
      create: {
        attemptId,
        questionId,
        uploadedFiles: updatedFiles,
      },
      update: {
        uploadedFiles: updatedFiles,
      },
    });

    return NextResponse.json({
      success: true,
      data: fileMetadata,
    });
  } catch (error) {
    console.error('Error uploading quiz file:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { attemptId, questionId, fileKey } = body;

    if (!attemptId || !questionId || !fileKey) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify that the attempt belongs to the current user
    const attempt = await db.quizAttempt.findUnique({
      where: { id: attemptId },
      include: {
        enrollment: true,
      },
    });

    if (!attempt) {
      return NextResponse.json({ success: false, error: 'Quiz attempt not found' }, { status: 404 });
    }

    if (attempt.enrollment.userId !== session.user.id) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    // Check if quiz is already submitted
    if (attempt.submittedAt) {
      return NextResponse.json(
        { success: false, error: 'Quiz already submitted. Cannot delete files.' },
        { status: 400 }
      );
    }

    // Get existing answer
    const existingAnswer = await db.attemptAnswer.findUnique({
      where: {
        attemptId_questionId: {
          attemptId,
          questionId,
        },
      },
    });

    if (!existingAnswer || !existingAnswer.uploadedFiles) {
      return NextResponse.json({ success: false, error: 'No files found' }, { status: 404 });
    }

    const existingFiles = existingAnswer.uploadedFiles as any[];
    const updatedFiles = existingFiles.filter((f: any) => f.fileKey !== fileKey);

    // Delete file from MinIO
    await deleteQuizFile(fileKey);

    // Update database
    await db.attemptAnswer.update({
      where: {
        attemptId_questionId: {
          attemptId,
          questionId,
        },
      },
      data: {
        uploadedFiles: updatedFiles,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting quiz file:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
