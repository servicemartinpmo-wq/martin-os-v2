import { NextResponse } from 'next/server'
import { techOpsResponseSchema } from '@/lib/contracts/dashboardContracts'
import { getTechOpsDashboardData } from '@/lib/services/dashboardService'

export const runtime = 'nodejs'

export async function GET() {
  const payload = await getTechOpsDashboardData()
  const parsed = techOpsResponseSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Contract validation failed', issues: parsed.error.issues },
      { status: 500 },
    )
  }
  return NextResponse.json(parsed.data, {
    status: 200,
    headers: { 'Cache-Control': 'no-store' },
  })
}
