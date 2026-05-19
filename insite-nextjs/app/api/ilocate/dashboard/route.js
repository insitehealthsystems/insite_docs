import { NextResponse } from 'next/server'
import { getDashboardData } from '@/lib/services/ilocateService'

const VALID_RANGES = new Set(['daily', 'weekly', 'monthly', 'quarterly'])

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const range = VALID_RANGES.has(searchParams.get('range'))
      ? searchParams.get('range')
      : 'monthly'

    const data = await getDashboardData(range)
    return NextResponse.json(data)
  } catch (err) {
    console.error('Dashboard API error:', err.message)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
