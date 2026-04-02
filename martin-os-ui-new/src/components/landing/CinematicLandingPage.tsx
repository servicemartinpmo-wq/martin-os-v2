import React from 'react';
import HeroSection from './HeroSection';
import GlassSection from './GlassSection';

export default function CinematicLandingPage() {
  return (
    <main className="w-full overflow-x-hidden">
      <HeroSection />

      {/* Scrollable Sections */}
      <GlassSection
        background="https://picsum.photos/seed/cinematic-1/1920/1080"
        title="Our Solutions"
        content="We provide intelligent operations with cinematic precision."
      />

      <GlassSection
        background="https://picsum.photos/seed/cinematic-2/1920/1080"
        title="Seamless Integration"
        content="Every workflow auto-configures and adapts to your needs."
      />

      <GlassSection
        background="https://picsum.photos/seed/cinematic-3/1920/1080"
        title="Analytics & Insights"
        content="Real-time decision intelligence for your business."
      />
    </main>
  );
}
