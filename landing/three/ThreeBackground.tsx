import React from 'react';
import { Canvas } from '@react-three/fiber';
import { MotionValue } from 'motion/react';
import SkyscraperStars from './SkyscraperStars';

export default function ThreeBackground({ progress }: { progress: MotionValue<number> }) {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 45] }}>
        <SkyscraperStars progress={progress} />
      </Canvas>
    </div>
  );
}
