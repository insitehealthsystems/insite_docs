import { Router } from 'express'
import { getDashboardData } from '../services/ilocateService.js'

const router = Router()

const VALID_RANGES = new Set(['daily', 'weekly', 'monthly', 'quarterly'])

router.get('/dashboard', async (req, res) => {
  try {
    const range = VALID_RANGES.has(req.query.range) ? req.query.range : 'monthly'
    const data  = await getDashboardData(range)
    res.json(data)
  } catch (err) {
    console.error('Dashboard error:', err.message)
    res.status(500).json({ error: 'Database error' })
  }
})

export default router
