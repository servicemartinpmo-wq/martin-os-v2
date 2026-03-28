import { getPlatformCoverageSummary } from '@/lib/platformCoverage'

export const runtime = 'nodejs'

export async function GET() {
  const payload = getPlatformCoverageSummary()
  return Response.json({ ok: true, ...payload })
}
