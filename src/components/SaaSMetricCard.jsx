function SaaSMetricCard({ title, value, statusText, isActive = false }) {
  return (
    <article className={`metric-card laminated ${isActive ? 'active' : ''}`}>
      <p>{title}</p>
      <h3>{value}</h3>
      <small>{statusText}</small>
    </article>
  )
}

export default SaaSMetricCard
