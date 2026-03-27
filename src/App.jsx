import Navbar from './components/Navbar'
import Hero from './components/Hero'
import FeatureCard from './components/FeatureCard'
import CallToAction from './components/CallToAction'
import './App.css'

const features = [
  {
    title: 'Reusable Components',
    description:
      'Build once and reuse across pages to keep your UI consistent and maintainable.',
  },
  {
    title: 'Scalable Structure',
    description:
      'Organized folders and clear naming make it easy to add routes, state, and APIs.',
  },
  {
    title: 'Fast Iteration',
    description:
      'Vite + React gives instant feedback so you can focus on shipping frontend features.',
  },
]

function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Hero />
        <section className="features">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </section>
        <CallToAction />
      </main>
    </div>
  )
}

export default App
