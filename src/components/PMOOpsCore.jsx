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

      <div className="pmo-top-ribbon">
        <article className="ribbon-card laminated chrome-frame">
          <p>Interviews</p>
          <h4>15x</h4>
        </article>
        <article className="ribbon-card laminated chrome-frame">
          <p>Hired</p>
          <h4>15%</h4>
        </article>
        <article className="ribbon-card laminated chrome-frame">
          <p>Project Time</p>
          <h4>60%</h4>
        </article>
        <article className="ribbon-card laminated chrome-frame">
          <p>Output</p>
          <h4>10x</h4>
        </article>
      </div>

      <article className="pmo-hero laminated chrome-frame">
        <div className="pmo-hero-art" aria-hidden="true">
          <div className="pmo-orb"></div>
          <div className="pmo-lines"></div>
          <div className="pmo-calendar-grid"></div>
        </div>
        <div className="pmo-hero-copy">
          <h3>Luxury Operations Overview</h3>
          <p>Strategic clarity with laminated premium surfaces and executive control rhythm.</p>
        </div>
      </article>

      <div className="pmo-kpi-grid">
        <SaaSMetricCard title="Portfolio Health" value="92%" statusText="stable" isActive />
        <SaaSMetricCard title="On-Time Milestones" value="46/51" statusText="tracking" />
        <SaaSMetricCard title="Active Programs" value="18" statusText="live" />
      </div>

      <div className="pmo-reference-strip">
        <article className="mini-surface">
          <p>Hiring Throughput</p>
          <h4>+15%</h4>
        </article>
        <article className="mini-surface">
          <p>Time Tracker</p>
          <h4>02:35</h4>
        </article>
        <article className="mini-surface">
          <p>Onboarding</p>
          <h4>18%</h4>
        </article>
        <article className="mini-surface">
          <p>Employees</p>
          <h4>78</h4>
        </article>
      </div>

      <article className="timeline-card">
        <h3>Program Timeline View</h3>
        <ul className="highlight-list">
          {pluginContent.dashboard.highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </article>
    </section>
  )
}

export default PMOOpsCore
