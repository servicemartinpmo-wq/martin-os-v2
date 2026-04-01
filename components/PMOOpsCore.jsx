import { pluginContent } from '../data/contentRegistry'
import SaaSMetricCard from './SaaSMetricCard'
import SectionHeader from './shell/SectionHeader'

function PMOOpsCore({ pagePreset }) {
  const containerClass = pagePreset === 'cinematic-cards' ? 'pmo-layout cinematic' : 'pmo-layout'

  return (
    <section className={containerClass}>
      <SectionHeader
        title="Executive Command Deck"
        subtitle="PMO-Ops anchors strategic alignment, portfolio rhythm, and cross-program visibility."
      />

      <article className="timeline-card">
        <h3>Program Timeline View</h3>
        <ul className="highlight-list">
          {pluginContent.dashboard.highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </article>

      <div className="pmo-kpi-grid">
        <SaaSMetricCard title="Portfolio Health" value="92%" statusText="stable" isActive />
        <SaaSMetricCard title="On-Time Milestones" value="46/51" statusText="tracking" />
        <SaaSMetricCard title="Active Programs" value="18" statusText="live" />
      </div>
    </section>
  )
}

export default PMOOpsCore
