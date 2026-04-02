import { readFile } from 'node:fs/promises'
import path from 'node:path'

/**
 * UI source of truth: martin-os-ui-new/dist/index.html
 * This route serves the uploaded UI bundle shell only.
 */
export default async function HomePage() {
  const htmlPath = path.join(process.cwd(), 'martin-os-ui-new', 'dist', 'index.html')
  let html = '<main style="padding:24px;font-family:system-ui">UI bundle missing. Build martin-os-ui-new first.</main>'
  try {
    html = await readFile(htmlPath, 'utf8')
  } catch {
    // Keep fallback message when dist is not built yet.
  }
  return <div dangerouslySetInnerHTML={{ __html: html }} />
}
