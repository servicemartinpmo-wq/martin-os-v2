import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MotionValue, useMotionValueEvent, useMotionValue, useSpring } from 'motion/react';

interface SkyscraperStarsProps {
  progress: MotionValue<number>;
}

const vertexShader = `
  attribute float size;
  attribute float offset;
  attribute vec3 targetPosition;
  attribute vec3 color;
  varying float vOffset;
  varying float vFormation;
  varying vec3 vColor;
  uniform float time;
  uniform float formation;

  void main() {
    vOffset = offset;
    vColor = color;
    
    // Staggered formation based on offset
    float stagger = offset * 0.3;
    float f = clamp((formation - stagger) / (1.0 - stagger), 0.0, 1.0);
    vFormation = f;

    // Smooth interpolation (easeInOutCubic)
    float easeF = f < 0.5 ? 4.0 * f * f * f : 1.0 - pow(-2.0 * f + 2.0, 3.0) / 2.0;

    // Interpolate between initial position (scattered) and target position
    vec3 pos = mix(position, targetPosition, easeF);
    
    // Add floating motion that decreases as it forms
    float floatAmt = (1.0 - easeF) * 0.5;
    pos.x += sin(time * 0.5 + offset * 10.0) * floatAmt;
    pos.y += cos(time * 0.4 + offset * 12.0) * floatAmt;
    pos.z += sin(time * 0.6 + offset * 8.0) * floatAmt;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    
    // Twinkle effect
    float twinkle = sin(time * 3.0 + offset * 50.0) * 0.5 + 0.5;
    gl_PointSize = size * (300.0 / -mvPosition.z) * (0.7 + twinkle * 0.3);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  varying float vOffset;
  varying float vFormation;
  varying vec3 vColor;
  uniform float time;

  void main() {
    float dist = distance(gl_PointCoord, vec2(0.5));
    if (dist > 0.5) discard;
    
    // Soft radial glow
    float glow = 1.0 - smoothstep(0.0, 0.5, dist);
    
    // Twinkle effect
    float twinkle = sin(time * 3.0 + vOffset * 50.0) * 0.5 + 0.5;
    
    // Use the passed color and fade in
    vec3 finalColor = mix(vColor * 0.8, vColor, twinkle);
    float alpha = glow * vFormation;
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

// Simple 5x7 pixel font for "WE BUILD SYSTEMS"
const FONT: Record<string, number[][]> = {
  'W': [[0,0],[0,1],[0,2],[0,3],[0,4],[1,0],[2,1],[3,0],[4,0],[4,1],[4,2],[4,3],[4,4]],
  'E': [[0,0],[0,1],[0,2],[0,3],[0,4],[1,0],[1,2],[1,4],[2,0],[2,2],[2,4]],
  'B': [[0,0],[0,1],[0,2],[0,3],[0,4],[1,0],[1,2],[1,4],[2,1],[2,3]],
  'U': [[0,0],[0,1],[0,2],[0,3],[0,4],[1,0],[2,0],[3,0],[4,0],[4,1],[4,2],[4,3],[4,4]],
  'I': [[0,0],[1,0],[2,0],[1,1],[1,2],[1,3],[1,4],[0,4],[1,4],[2,4]],
  'L': [[0,0],[0,1],[0,2],[0,3],[0,4],[1,0],[2,0]],
  'D': [[0,0],[0,1],[0,2],[0,3],[0,4],[1,0],[1,4],[2,1],[2,2],[2,3]],
  'S': [[0,0],[1,0],[2,0],[2,1],[2,2],[1,2],[0,2],[0,3],[0,4],[1,4],[2,4]],
  'Y': [[0,4],[1,3],[2,2],[3,3],[4,4],[2,1],[2,0]],
  'T': [[0,4],[1,4],[2,4],[3,4],[4,4],[2,3],[2,2],[2,1],[2,0]],
  'M': [[0,0],[0,1],[0,2],[0,3],[0,4],[1,3],[2,2],[3,3],[4,0],[4,1],[4,2],[4,3],[4,4]],
};

function getTaglinePoints(text: string, count: number) {
  const points: [number, number][] = [];
  const spacing = 8;
  let offsetX = 0;
  
  const words = text.split(' ');
  let currentY = 6; // Start higher to center the block
  
  words.forEach((word, wordIdx) => {
    offsetX = -(word.length * spacing) / 2;
    for (const char of word) {
      const charPoints = FONT[char] || [];
      charPoints.forEach(([px, py]) => {
        points.push([px + offsetX, py + currentY]);
      });
      offsetX += spacing;
    }
    currentY -= 12; // More vertical spacing between words
  });

  const result = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const p = points[i % points.length];
    result[i * 3] = p[0] * 0.3 + (Math.random() - 0.5) * 0.1;
    result[i * 3 + 1] = p[1] * 0.3 + (Math.random() - 0.5) * 0.1;
    result[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
  }
  return result;
}

export default function SkyscraperStars({ progress }: SkyscraperStarsProps) {
  const pointsRef = useRef<THREE.Points>(null!);
  const count = 30000;
  
  const formationValue = useMotionValue(0);
  const formationSpring = useSpring(formationValue, { stiffness: 12, damping: 18 });
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  const [initialPositions, randomOffsets, sizes] = useMemo(() => {
    const initialPos = new Float32Array(count * 3);
    const offsets = new Float32Array(count);
    const s = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const radius = 15 + Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      initialPos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      initialPos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      initialPos[i * 3 + 2] = radius * Math.cos(phi);
      offsets[i] = Math.random();
      s[i] = Math.random() * 0.15 + 0.05;
    }
    return [initialPos, offsets, s];
  }, [count]);

  const allTargets = useMemo(() => {
    const targets = [];
    const colors = [];

    // Shape 1: Empire State (Tapered)
    const t1 = new Float32Array(count * 3);
    const c1 = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const h = 16; const y = Math.random() * h - h/2; const nY = (y + h/2)/h;
      let w = nY < 0.3 ? 3.5*(1-nY*0.5) : nY < 0.6 ? 2.5*(1-(nY-0.3)*0.8) : nY < 0.85 ? 1.2*(1-(nY-0.6)*1.5) : 0.1;
      const side = Math.floor(Math.random() * 4);
      let x=0, z=0;
      if (side === 0) { x = (Math.random()-0.5)*w; z = w/2; }
      else if (side === 1) { x = (Math.random()-0.5)*w; z = -w/2; }
      else if (side === 2) { x = -w/2; z = (Math.random()-0.5)*w; }
      else { x = w/2; z = (Math.random()-0.5)*w; }
      t1[i*3]=x; t1[i*3+1]=y; t1[i*3+2]=z;
      c1[i*3]=0.9; c1[i*3+1]=0.95; c1[i*3+2]=1.0;
    }
    targets.push(t1); colors.push(c1);

    // Shape 2: Burj Style (Stepped)
    const t2 = new Float32Array(count * 3);
    const c2 = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const h = 18; const y = Math.random() * h - h/2; const nY = (y + h/2)/h;
      let w = nY < 0.2 ? 3 : nY < 0.4 ? 2.2 : nY < 0.6 ? 1.5 : nY < 0.8 ? 0.8 : 0.1;
      const side = Math.floor(Math.random() * 4);
      let x=0, z=0;
      if (side === 0) { x = (Math.random()-0.5)*w; z = w/2; }
      else if (side === 1) { x = (Math.random()-0.5)*w; z = -w/2; }
      else if (side === 2) { x = -w/2; z = (Math.random()-0.5)*w; }
      else { x = w/2; z = (Math.random()-0.5)*w; }
      t2[i*3]=x; t2[i*3+1]=y; t2[i*3+2]=z;
      c2[i*3]=0.85; c2[i*3+1]=0.9; c2[i*3+2]=1.0;
    }
    targets.push(t2); colors.push(c2);

    // Shape 3: Pyramid / Transamerica
    const t3 = new Float32Array(count * 3);
    const c3 = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const h = 15; const y = Math.random() * h - h/2; const nY = (y + h/2)/h;
      let w = 4 * (1 - nY);
      const side = Math.floor(Math.random() * 4);
      let x=0, z=0;
      if (side === 0) { x = (Math.random()-0.5)*w; z = w/2; }
      else if (side === 1) { x = (Math.random()-0.5)*w; z = -w/2; }
      else if (side === 2) { x = -w/2; z = (Math.random()-0.5)*w; }
      else { x = w/2; z = (Math.random()-0.5)*w; }
      t3[i*3]=x; t3[i*3+1]=y; t3[i*3+2]=z;
      c3[i*3]=0.95; c3[i*3+1]=0.95; c3[i*3+2]=1.0;
    }
    targets.push(t3); colors.push(c3);

    // Shape 4: Twin Towers
    const t4 = new Float32Array(count * 3);
    const c4 = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const h = 14; const y = Math.random() * h - h/2;
      const tower = Math.random() > 0.5 ? -2 : 2;
      const w = 1.5;
      const side = Math.floor(Math.random() * 4);
      let x=0, z=0;
      if (side === 0) { x = (Math.random()-0.5)*w; z = w/2; }
      else if (side === 1) { x = (Math.random()-0.5)*w; z = -w/2; }
      else if (side === 2) { x = -w/2; z = (Math.random()-0.5)*w; }
      else { x = w/2; z = (Math.random()-0.5)*w; }
      t4[i*3]=x + tower; t4[i*3+1]=y; t4[i*3+2]=z;
      c4[i*3]=0.9; c4[i*3+1]=0.9; c4[i*3+2]=1.0;
    }
    targets.push(t4); colors.push(c4);

    // Shape 5: Tagline "WE BUILD SYSTEMS"
    const t5 = getTaglinePoints("WE BUILD SYSTEMS", count);
    const c5 = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      c5[i*3]=0.4; c5[i*3+1]=0.8; c5[i*3+2]=1.0; // Light Cyan/Blue
    }
    targets.push(t5); colors.push(c5);

    return { targets, colors };
  }, [count]);

  const activeIndex = useRef(0);

  useMotionValueEvent(progress, "change", (latest) => {
    formationValue.set(0);
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    
    // Determine which shape to show based on scroll progress
    const idx = Math.min(4, Math.floor(latest * 5));
    if (idx !== activeIndex.current) {
      activeIndex.current = idx;
      // Update attributes
      const geo = pointsRef.current.geometry;
      geo.attributes.targetPosition.array.set(allTargets.targets[idx]);
      geo.attributes.targetPosition.needsUpdate = true;
      geo.attributes.color.array.set(allTargets.colors[idx]);
      geo.attributes.color.needsUpdate = true;
    }

    scrollTimeout.current = setTimeout(() => {
      formationValue.set(1);
    }, 150);
  });

  const uniforms = useMemo(() => ({
    time: { value: 0 },
    formation: { value: 0 }
  }), []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    uniforms.time.value = t;
    uniforms.formation.value = formationSpring.get();
    pointsRef.current.rotation.y = t * 0.05 + formationSpring.get() * 0.1;
  });

  useEffect(() => {
    // Initial target
    const geo = pointsRef.current.geometry;
    geo.attributes.targetPosition.array.set(allTargets.targets[0]);
    geo.attributes.targetPosition.needsUpdate = true;
    geo.attributes.color.array.set(allTargets.colors[0]);
    geo.attributes.color.needsUpdate = true;

    return () => {
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, [allTargets]);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={initialPositions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-targetPosition"
          count={count}
          array={new Float32Array(count * 3)}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={new Float32Array(count * 3)}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-offset"
          count={count}
          array={randomOffsets}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </points>
  );
}
