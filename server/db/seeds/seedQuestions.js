import { db } from "../pool.js"
import { CATEGORY_QUESTIONS } from "../../../mocks/categoryQuestions.js"

const ANSWER_TO_NUMBER = { a: 1, b: 2, c: 3, d: 4}

async function seedQuestions() {
    try {
        for (const [slug, questions] of Object.entries(CATEGORY_QUESTIONS)) {
            const categoryResult = await db.query(
                `
                SELECT id
                FROM categories
                WHERE slug = $1
                `,
                [slug]
            )

            const category = categoryResult.rows[0]

            if (!category) {
                throw new Error(`Category not found for slug: ${slug}`)
            }

            for (const question of questions) {
                if (question.answers.length !== 4) {
                    throw new Error(`${question.id} does not have exactly 4 answers`)
                }
                
                const correctAnswer = ANSWER_TO_NUMBER[question.correctAnswer]

                if (!correctAnswer) {
                    throw new Error(`${question.id} has an invalid correctAnswer`)
                }

                await db.query(
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
                    ON CONFLICT (source_id)
                    DO UPDATE SET
                        category_id = EXCLUDED.category_id,
                        difficulty = EXCLUDED.difficulty,
                        question = EXCLUDED.question,
                        answer_1 = EXCLUDED.answer_1,
                        answer_2 = EXCLUDED.answer_2,
                        answer_3 = EXCLUDED.answer_3,
                        answer_4 = EXCLUDED.answer_4,
                        correct_answer = EXCLUDED.correct_answer,
                        explanation = EXCLUDED.explanation,
                        updated_at = NOW()
                    `,
                    [
                        question.id,
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
            }
            console.log(`Seeded ${questions.length} questions for ${slug}`)
        }
        console.log('Question seed completed')
    } catch (error) {
        console.error('Question seed failed', error)
        process.exitCode = 1
    } finally {
        await db.end()
    }
}

seedQuestions()