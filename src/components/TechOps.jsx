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

      <div className="tech-top-ribbon">
        <article className="ribbon-card laminated chrome-frame">
          <p>Population Entity</p>
          <h4>10028</h4>
        </article>
        <article className="ribbon-card laminated chrome-frame">
          <p>Pulse Sync</p>
          <h4>13:58:17</h4>
        </article>
        <article className="ribbon-card laminated chrome-frame">
          <p>Reputation Index</p>
          <h4>329</h4>
        </article>
      </div>

      <div className="tech-command-grid">
        <article className="tech-side-panel laminated chrome-frame">
          <h3>Population</h3>
          <div className="hud-bars">
            <span style={{ height: '74%' }}></span>
            <span style={{ height: '38%' }}></span>
            <span style={{ height: '60%' }}></span>
            <span style={{ height: '89%' }}></span>
          </div>
          <h3>Educational</h3>
          <div className="hud-donut"></div>
        </article>

        <article className="tech-hero laminated chrome-frame">
          <div className="tech-hero-art" aria-hidden="true">
            <div className="tech-radar"></div>
            <div className="tech-map"></div>
            <div className="tech-grid"></div>
            <div className="tech-ping tech-ping-a"></div>
            <div className="tech-ping tech-ping-b"></div>
            <div className="tech-ping tech-ping-c"></div>
            <div className="tech-ring tech-ring-a"></div>
            <div className="tech-ring tech-ring-b"></div>
            <div className="tech-trace"></div>
          </div>
          <div className="tech-hero-copy">
            <h3>System Core State</h3>
            <p>Cyan telemetry, chrome framing, and immersive diagnostics-first visibility.</p>
          </div>
        </article>

        <article className="tech-side-panel laminated chrome-frame">
          <h3>Age Distribution</h3>
          <div className="hud-line"></div>
          <h3>Occupation</h3>
          <div className="hud-donut alt"></div>
        </article>
      </div>

      <div className="tech-gauge-grid">
        <SaaSMetricCard title="Runtime Stability" value="99.96%" statusText="healthy" isActive />
        <SaaSMetricCard title="Latency Pulse" value="37ms" statusText="nominal" />
        <SaaSMetricCard title="Incident Queue" value="2 Open" statusText="watching" />
      </div>

      <div className="tech-chart-strip">
        <article className="chart-panel laminated chrome-frame">
          <h4>Capacity</h4>
          <div className="chart-wave wave-a"></div>
        </article>
        <article className="chart-panel laminated chrome-frame">
          <h4>Load Distribution</h4>
          <div className="chart-wave wave-b"></div>
        </article>
        <article className="chart-panel laminated chrome-frame">
          <h4>Signal Integrity</h4>
          <div className="chart-wave wave-c"></div>
        </article>
      </div>

      <div className="tech-reference-grid">
        <article className="mini-surface">
          <p>Packet Integrity</p>
          <h4>98.7%</h4>
        </article>
        <article className="mini-surface">
          <p>Sync Drift</p>
          <h4>0.03s</h4>
        </article>
        <article className="mini-surface">
          <p>Air Temp</p>
          <h4>23C</h4>
        </article>
        <article className="mini-surface">
          <p>Fuel Level</p>
          <h4>71%</h4>
        </article>
      </div>

      <article className="tech-log-card">
        <h3>Diagnostics Feed</h3>
        <ul className="highlight-list">
          {pluginContent['tech-ops'].highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </article>
    </section>
  )
}

export default TechOps
