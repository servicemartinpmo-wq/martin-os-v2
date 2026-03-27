function SectionHeader({ title, subtitle }) {
  return (
    <header className="section-header">
      <h2>{title}</h2>
      <p className="subtle">{subtitle}</p>
    </header>
  )
}

export default SectionHeader
