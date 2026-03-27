function SectionHeader({ title, subtitle }) {
  return (
    <div className="section-header">
      <h2>{title}</h2>
      {subtitle ? <p className="subtle">{subtitle}</p> : null}
    </div>
  )
}

export default SectionHeader
