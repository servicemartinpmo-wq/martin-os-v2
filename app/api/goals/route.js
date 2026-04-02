import { NextResponse } from 'next/server'
import { goalsResponseSchema } from '@/lib/contracts/dashboardContracts'
import { getGoalsDashboardData } from '@/lib/services/dashboardService'

export const runtime = 'nodejs'

export async function GET() {
  const payload = await getGoalsDashboardData()
  const parsed = goalsResponseSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Invalid goals payload',
        issues: parsed.error.flatten(),
      },
      { status: 500 },
    )
  }
  return NextResponse.json(parsed.data, {
    status: 200,
    headers: { 'Cache-Control': 'no-store' },
  })
}
