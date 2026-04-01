function ExplanationPanel({ copy }) {
  return (
    <section className="explanation-panel laminated chrome-frame">
      <div className="label">System Explanation</div>
      <p>{copy}</p>
    </section>
  )
}

export default ExplanationPanel
