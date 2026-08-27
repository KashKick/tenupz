import express from 'express'

const app = express()
const PORT = 3001

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

app.get('/api/games', async(req, res) => {
    try {
        const partnerId = process.env.BESITOS_PARTNER_ID
        const token = process.env.BESITOS_API_TOKEN

        if (!partnerId || !token) {
            return res.status(500).json({
                error: 'Missing Besitos credentials'
            })
        }

        const response = await fetch(
            `https://wall.besitos.ai/data/partner/offers/${partnerId}?device_platform=all`,
            {
                headers: {
                    accept: 'application/json',
                    authorization: `Bearer ${token}`
                }
            }
        )

        if (!response.ok) {
            return res.status(response.status).json({
                error: `Besitos API return ${response.status}`
            })
        }

        const data = await response.json()

        res.json(data)
    } catch (error) {
        res.status(500).json({
            error: 'Failed to reach Besitos API',
            details: error.message
        })
    }
})

app.listen(PORT, () => {
    console.log(`TenUpz local API running at http://localhost:${PORT}`)
})