import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import ilocateRouter from './routes/ilocate.js'

dotenv.config()

const app = express()

const PROD_ORIGINS = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
  : []

app.use(cors({
  origin: (origin, cb) => {
    // No origin = curl / Postman / server-to-server — always allow
    if (!origin) return cb(null, true)
    // In development allow any localhost regardless of port
    if (process.env.NODE_ENV !== 'production' && /^https?:\/\/localhost(:\d+)?$/.test(origin)) {
      return cb(null, true)
    }
    // In production check the explicit allowlist
    if (PROD_ORIGINS.includes(origin)) return cb(null, true)
    cb(new Error(`CORS: origin ${origin} not allowed`))
  },
  methods: ['GET'],
}))
app.use(express.json())

app.use('/api/ilocate', ilocateRouter)
app.get('/health', (_, res) => res.json({ ok: true, service: 'ilocate-backend' }))

const PORT = process.env.PORT || 4100
app.listen(PORT, () => {
  console.log(`iLocate API running on http://localhost:${PORT}`)
})
