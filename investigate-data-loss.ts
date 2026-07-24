import { db } from './src/lib/db'

async function investigateDataLoss() {
  try {
    console.log('🔍 Investigating data loss...\n')
    console.log('=' .repeat(60))

    // Check all tables
    const tables = [
      'user',
      'course',
      'module',
      'lesson',
      'enrollment',
      'quiz',
      'question',
      'quizAttempt',
      'attemptAnswer',
      'training',
      'trainingRegistration',
      'learningPath',
      'pathEnrollment',
      'certificate',
      'order',
      'assignment',
      'assignmentTarget',
      'notification',
      'pointHistory',
    ]

    for (const table of tables) {
      try {
        const count = await (db as any)[table].count()
        console.log(`✅ ${table.padEnd(25)} : ${count} records`)
      } catch (error: any) {
        console.log(`❌ ${table.padEnd(25)} : ERROR - ${error.message}`)
      }
    }

    console.log('=' .repeat(60))
    console.log('\n📊 Detailed Analysis:\n')

    // Check for duplicate violations that might have caused data loss
    console.log('🔍 Checking for potential duplicate issues...\n')

    // Check users with duplicate NIK
    const usersWithNik = await db.user.findMany({
      where: { nik: { not: null } },
      select: { id: true, name: true, email: true, nik: true }
    })
    console.log(`Users with NIK: ${usersWithNik.length}`)
    
    // Check for duplicate attempt answers
    const attemptAnswers = await db.attemptAnswer.findMany({
      select: { id: true, attemptId: true, questionId: true }
    })
    console.log(`Attempt Answers: ${attemptAnswers.length}`)

    // Group by attemptId + questionId to find duplicates
    const answerGroups = new Map<string, number>()
    attemptAnswers.forEach(answer => {
      const key = `${answer.attemptId}-${answer.questionId}`
      answerGroups.set(key, (answerGroups.get(key) || 0) + 1)
    })

    const duplicates = Array.from(answerGroups.entries()).filter(([_, count]) => count > 1)
    if (duplicates.length > 0) {
      console.log(`\n⚠️  Found ${duplicates.length} duplicate answer combinations (these might have been deleted)`)
      duplicates.forEach(([key, count]) => {
        console.log(`   - ${key}: ${count} duplicates`)
      })
    } else {
      console.log('\n✅ No duplicate answers found')
    }

    console.log('\n' + '='.repeat(60))

  } catch (error) {
    console.error('❌ Error investigating data:', error)
  } finally {
    await db.$disconnect()
  }
}

investigateDataLoss()
