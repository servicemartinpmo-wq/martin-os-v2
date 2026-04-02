import { NextResponse } from 'next/server'
import { miiddleResponseSchema } from '@/lib/contracts/dashboardContracts'
import { getMiiddleDashboardData } from '@/lib/services/dashboardService'

export const runtime = 'nodejs'

export async function GET() {
  const payload = await getMiiddleDashboardData()
  const parsed = miiddleResponseSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid miiddle response contract', issues: parsed.error.issues },
      { status: 500 },
    )
  }
  return NextResponse.json(parsed.data, { status: 200, headers: { 'Cache-Control': 'no-store' } })
}
