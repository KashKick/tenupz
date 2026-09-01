import { db } from "../pool.js"
import { CATEGORY_QUESTIONS } from "../../../mocks/categoryQuestions.js"

async function seedCategories() {
    try {
        const entries = Object.entries(CATEGORY_QUESTIONS)

        for (const [slug, questions] of entries) {
            const firstQuestion = questions[0]
            
            if (!firstQuestion) continue

            const name = firstQuestion.category

            await db.query(
                `
                INSERT INTO categories (
                    id,
                    name,
                    slug
                )
                VALUES (
                    gen_random_uuid(),
                    $1,
                    $2
                )
                ON CONFLICT (slug)
                DO UPDATE SET
                    name = EXCLUDED.name,
                    updated_at = NOW()
                `,
                [name, slug]
            )
            console.log(`Seeded category: ${name}`)
        }

        console.log('Category seed completed')
    } catch (error) {
        console.error('Category seed failed:', error)
        process.exitCode = 1
    } finally {
        await db.end()
    }
}

seedCategories()