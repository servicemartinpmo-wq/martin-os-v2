'use client'

import { Droplets, Thermometer, Wind } from 'lucide-react'
import GradientMetricCard from '@/components/dashboard/GradientMetricCard'

/**
 * Environmental / facility-style metrics row — light slate dashboard pattern.
 */
export default function EnvironmentalSection() {
  const updated = new Date().toLocaleString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'short',
  })

  return (
    <section className="mt-6">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xs font-bold tracking-widest text-slate-800 uppercase">Environmental</h2>
          <Wind size={14} className="text-blue-500" aria-hidden />
        </div>
        <span className="text-[10px] font-medium text-slate-400">Last updated {updated}</span>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <GradientMetricCard
          title="Temperature"
          value="74°F"
          label="Sensor A1"
          gradient="bg-gradient-to-br from-orange-300 to-orange-500"
          icon={Thermometer}
        />
        <GradientMetricCard
          title="Relative humidity"
          value="50%"
          label="Sensor A1"
          gradient="bg-gradient-to-br from-cyan-400 to-teal-500"
          icon={Droplets}
        />
        <GradientMetricCard
          title="Dew point"
          value="49°F"
          label="Sensor A1"
          gradient="bg-gradient-to-br from-blue-400 to-blue-600"
          icon={Droplets}
        />
      </div>
    </section>
  )
}
