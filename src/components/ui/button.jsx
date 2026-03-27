export default function Button({ className = '', children, ...props }) {
  return (
    <button
      type="button"
      className={`rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/20 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
