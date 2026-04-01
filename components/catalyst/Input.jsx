'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/cn'

const Input = forwardRef(function Input({ className = '', type = 'text', ...props }, ref) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        'w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none transition-colors placeholder:opacity-60',
        className,
      )}
      style={{
        borderColor: 'var(--border-subtle)',
        color: 'var(--text-primary)',
      }}
      {...props}
    />
  )
})

export default Input
