import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import ilocateRouter from './routes/ilocate.js'

dotenv.config()

const app = express()

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  methods: ['GET'],
}))
app.use(express.json())

app.use('/api/ilocate', ilocateRouter)
app.get('/health', (_, res) => res.json({ ok: true, service: 'ilocate-backend' }))

const PORT = process.env.PORT || 4100
app.listen(PORT, () => {
  console.log(`iLocate API running on http://localhost:${PORT}`)
})
