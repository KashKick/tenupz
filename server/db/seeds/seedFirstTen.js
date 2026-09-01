import { db } from "../pool.js"
import { FIRST_TEN_QUESTIONS } from "../../../mocks/questions.js"

const ANSWER_TO_NUMBER = {
    a: 1,
    b: 2,
    c: 3,
    d: 4
}

async function seedFirstTen() {
    const client = await db.connect()

    try {
        await client.query("BEGIN")

        const quizResult = await client.query(
            `
            INSERT INTO quizzes (
                id,
                type,
                date
            )
            VALUES (
                gen_random_uuid(),
                'daily',
                CURRENT_DATE
            )
            RETURNING id
            `
        )

        const quizId = quizResult.rows[0].id

        for (let index = 0; index < FIRST_TEN_QUESTIONS.length; index++) {
            const question = FIRST_TEN_QUESTIONS[index]

            const existingQuestionResult = await client.query(
                `
                SELECT id
                FROM questions
                WHERE question = $1
                LIMIT 1
                `,
                [question.question]
            )

            let questionId = existingQuestionResult.rows[0]?.id

            if (!questionId) {
                const categoryResult = await client.query(
                    `
                    SELECT id
                    FROM categories
                    WHERE LOWER(name) = LOWER($1)
                    LIMIT 1
                    `,
                    [question.category]
                )

                const category = categoryResult.rows[0]

                if (!category) {
                    throw new Error(`Category not found: ${question.category}`)
                }

                const correctAnswer =
                    ANSWER_TO_NUMBER[question.correctAnswer]

                if (!correctAnswer) {
                    throw new Error(`Invalid correctAnswer on ${question.id}`)
                }

                const insertedQuestionResult = await client.query(
                    `
                    INSERT INTO questions (
                        id,
                        source_id,
                        category_id,
                        difficulty,
                        question,
                        answer_1,
                        answer_2,
                        answer_3,
                        answer_4,
                        correct_answer,
                        explanation
                    )
                    VALUES (
                        gen_random_uuid(),
                        $1,
                        $2,
                        $3,
                        $4,
                        $5,
                        $6,
                        $7,
                        $8,
                        $9,
                        $10
                    )
                    RETURNING id
                    `,
                    [
                        `first-ten-${question.id}`,
                        category.id,
                        question.difficulty,
                        question.question,
                        question.answers[0].text,
                        question.answers[1].text,
                        question.answers[2].text,
                        question.answers[3].text,
                        correctAnswer,
                        question.explanation
                    ]
                )

                questionId = insertedQuestionResult.rows[0].id
            }

            await client.query(
                `
                INSERT INTO quiz_questions (
                    quiz_id,
                    question_id,
                    position
                )
                VALUES (
                    $1,
                    $2,
                    $3
                )
                `,
                [
                    quizId,
                    questionId,
                    index + 1
                ]
            )
        }

        await client.query("COMMIT")

        console.log(`Seeded first Daily Ten: ${quizId}`)
    } catch (error) {
        await client.query("ROLLBACK")

        console.error("First Ten seed failed:", error)

        process.exitCode = 1
    } finally {
        client.release()
        await db.end()
    }
}

seedFirstTen()