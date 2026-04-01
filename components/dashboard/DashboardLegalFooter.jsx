'use client'

import Link from 'next/link'

/**
 * Slim legal / social strip for the main dashboard (light border, uppercase micro type).
 */
export default function DashboardLegalFooter() {
  return (
    <footer className="mt-8 flex flex-col gap-3 border-t border-slate-200 bg-white py-4 text-[10px] font-bold tracking-wider text-slate-400 uppercase sm:flex-row sm:items-center sm:justify-between md:px-2">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <Link href="/settings" className="normal-case hover:text-blue-600">
          View terms of use and privacy policy
        </Link>
        <div className="flex flex-wrap gap-3 border-slate-200 sm:border-l sm:pl-4">
          <a
            href="https://martinpmo.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600"
          >
            Blog
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
            Twitter
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
            LinkedIn
          </a>
        </div>
      </div>
      <p className="text-[10px] tracking-widest">
        Powered by <span className="text-slate-800">BD</span> Bussolini / Design
      </p>
    </footer>
  )
}
