import express from 'express'
import { db } from './db/pool.js'

const app = express()
const PORT = process.env.PORT || 3001
const UPSTREAM_TIMEOUT_MS = 10000

app.use((req, res, next) => {
    const origin = req.headers.origin

    const allowedOrigins = ['http://localhost:8081', 'http://127.0.0.1:8081']

    if (allowedOrigins.includes(origin)) {
        res.setHeader(
            'Access-Control-Allow-Origin',
            origin
        )
    }

    next()
})

app.get('/api/user-games/:userId', async (req, res) => {
    try {
        const partnerId = process.env.BESITOS_PARTNER_ID
        const token = process.env.BESITOS_API_TOKEN
        const { userId } = req.params

        const platform = req.query.platform === 'ios' || req.query.platform === 'android'
            ? req.query.platform
            : 'android'

        const country = typeof req.query.country === 'string'
            ? req.query.country.toUpperCase()
            : 'US'

        if (!partnerId || !token) {
            return res.status(500).json({
                error: 'Missing Besitos credentials'
            })
        }

        if (!userId) {
            return res.status(400).json({
                error: 'Missing userId'
            })
        }

        if (userId.length > 50) {
            return res.status(400).json({
                error: 'Invalid userId'
            })
        }

        const params = new URLSearchParams({
            device_platform: platform,
            country
        })

        const response = await fetch(
            `https://wall.besitos.ai/data/${partnerId}/${encodeURIComponent(userId)}?${params.toString()}`,
            {
                headers: {
                    accept: 'application/json',
                    authorization: `Bearer ${token}`
                },
                signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS)
            }
        )

        if (!response.ok) {
            return res.status(502).json({
                error: 'Unable to load rewards right now'
            })
        }

        const data = await response.json()
        const currency = data.currency || '$'

        const normalizeUserOffer = (offer) => ({
            id: offer.id,
            bundleId: offer.bundle_id || null,
            title: offer.title,
            tagline: offer.card_text || '',
            imageText: offer.image_text || '',
            image: offer.image || offer.square_image || offer.large_image || '',
            squareImage: offer.square_image || offer.image || offer.large_image || '',
            largeImage: offer.large_image || offer.image || offer.square_image || '',
            description: offer.description || '',
            details: offer.details || '',
            currency,
            amount: offer.amount != null ? Number(offer.amount) : 0,
            device: offer.device || null,
            url: offer.url || '',
            categories: (offer.categories || []).map((category) => 
                typeof category === 'string' ? category : category?.name).filter(Boolean),
            isNew: Boolean(offer.is_new),
            goals: (offer.goals || []).map((goal) => ({
                id: goal.goal_id,
                text: goal.text || '',
                amount: goal.amount != null ? Number(goal.amount) : 0,
                currency,
                daysLeft: goal.days_left ?? null,
                section: goal.section ?? null,
                position: goal.position ?? null,
                type: goal.goal_type ?? null,
                completed: Boolean(goal.completed),
                failed: Boolean(goal.failed),
                completedDatetime: goal.completed_datetime || null,
                expiresAt: goal.expires_at || null,
                expireDatetime: goal.expire_datetime || null
            }))
        })

        res.json({
            available: Array.isArray(data.available) ? data.available.map(normalizeUserOffer) : [],
            inProgress: Array.isArray(data.in_progress) ? data.in_progress.map(normalizeUserOffer) : [],
            completed: Array.isArray(data.completed) ? data.completed.map(normalizeUserOffer) : [],
            balance: Number(data.balance || 0),
            currency,
            country: data.country || null
        })
    } catch (error) {
        console.error(error)

        const timedOut = error.name === 'TimeoutError' || error.name === 'AbortError'

        res.status(timedOut ? 504 : 500).json({
            error: 'Unable to load rewards right now',
        })
    }
})

app.get('/api/quizzes/daily', async (req, res) => {
    try {
        const quizResult = await db.query(
            `
            SELECT
                q.id AS quiz_id,
                q.type,
                q.date,
                qq.position,
                qu.id AS question_id,
                qu.category_id,
                qu.difficulty,
                qu.question,
                qu.answer_1,
                qu.answer_2,
                qu.answer_3,
                qu.answer_4
            FROM quizzes q
            JOIN quiz_questions qq
                ON qq.quiz_id = q.id
            JOIN questions qu
                ON qu.id = qq.question_id
            WHERE q.id = (
                SELECT id
                FROM quizzes
                WHERE type = 'daily'
                ORDER BY date DESC NULLS LAST, created_at DESC
                LIMIT 1
            )
            ORDER BY qq.position ASC
            `
        )

        if (quizResult.rows.length === 0) {
            return res.status(404).json({
                error: 'No Daily Ten available'
            })
        }

        const firstRow = quizResult.rows[0]

        res.json({
            id: firstRow.quiz_id,
            type: firstRow.type,
            date: firstRow.date ? firstRow.date.toISOString().slice(0, 10) : null,
            questions: quizResult.rows.map((row) => ({
                id: row.question_id,
                categoryId: row.category_id,
                difficulty: row.difficulty,
                question: row.question,
                answers: [
                    { id: 1, text: row.answer_1 },
                    { id: 2, text: row.answer_2 },
                    { id: 3, text: row.answer_3 },
                    { id: 4, text: row.answer_4 },
                ]
            }))
        })
    } catch (error) {
        console.error('Daily quiz error:', error)

        res.status(500).json({
            error: 'Unable to load Daily Ten'
        })
    }
})

async function testDatabaseConnection() {
    try {
        const result = await db.query('SELECT NOW()')

        console.log('Postgres connected', result.rows[0].now)
    } catch (error) {
        console.error('Postgres connection failed', error)
    }
}

testDatabaseConnection()

app.listen(PORT, () => {
    console.log(`TenUpz local API running at http://localhost:${PORT}`)
})