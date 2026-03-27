import { pluginContent } from '../data/contentRegistry'
import SaaSMetricCard from './SaaSMetricCard'
import SectionHeader from './shell/SectionHeader'

function TechOps({ pagePreset }) {
  const containerClass = pagePreset === 'ops-hud' ? 'tech-layout ops-hud' : 'tech-layout'

  return (
    <section className={containerClass}>
      <SectionHeader
        title="Operations HUD"
        subtitle="Tech-Ops prioritizes diagnostics, telemetry, and autonomous health signals."
      />

      <article className="tech-log-card">
        <h3>Diagnostics Feed</h3>
        <ul className="highlight-list">
          {pluginContent['tech-ops'].highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </article>

      <div className="tech-gauge-grid">
        <SaaSMetricCard title="Runtime Stability" value="99.96%" statusText="healthy" isActive />
        <SaaSMetricCard title="Latency Pulse" value="37ms" statusText="nominal" />
        <SaaSMetricCard title="Incident Queue" value="2 Open" statusText="watching" />
      </div>
    </section>
  )
}

export default TechOps
