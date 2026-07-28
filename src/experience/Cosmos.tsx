'use client';

import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { timeline, smoothstep } from '@/state/timeline';

// The universe is never black and never still: distant stars, drifting dust,
// nebula veils — a second, featherweight particle layer along the flight line.
// Budgets scale with the device. The old 300px nebula quads were pure
// fillrate cost under additive blending — they are gone; depth fog and
// bloom already carry the atmosphere.
const MOBILE = typeof window !== 'undefined' && window.matchMedia('(max-width: 900px)').matches;
const STARS = MOBILE ? 1600 : 3600;
const DUST = MOBILE ? 700 : 1600;
const COUNT = STARS + DUST;

const vertex = /* glsl */ `
attribute float aSize;
attribute float aKind; // 0 star, 1 dust, 2 nebula
attribute float aSeed;
uniform float uTime;
uniform float uPixelRatio;
varying float vKind;
varying float vSeed;
varying float vFade;
void main(){
  vKind = aKind;
  vSeed = aSeed;
  vec3 p = position;
  // dust drifts forever; nebula breathes slowly
  if (aKind > 0.5 && aKind < 1.5) {
    p.x += sin(uTime * 0.11 + aSeed * 40.0) * 1.6;
    p.y += sin(uTime * 0.09 + aSeed * 73.0) * 1.2;
    p.z += sin(uTime * 0.07 + aSeed * 21.0) * 1.6;
  }
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  float depth = -mv.z;
  float size = aSize;
  gl_PointSize = clamp(size * uPixelRatio * (110.0 / max(depth, 1.0)), 0.5, 4.0);
  vFade = smoothstep(1.5, 8.0, depth) * exp(-depth * 0.006);
  gl_Position = projectionMatrix * mv;
}
`;

const fragment = /* glsl */ `
precision highp float;
uniform float uTime;
uniform float uReveal;
varying float vKind;
varying float vSeed;
varying float vFade;
void main(){
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  if (d > 0.5) discard;
  vec3 col;
  float alpha;
  if (vKind < 0.5) {
    // pin-sharp distant star — same brand family, HDR core so bloom lifts it
    float core = 1.0 - smoothstep(0.0, 0.26, d);
    float tw = 0.8 + 0.2 * sin(uTime * (0.4 + vSeed * 1.2) + vSeed * 90.0);
    col = mix(vec3(0.18, 0.44, 0.98), vec3(0.867, 0.953, 1.0), vSeed) * (1.4 + vSeed * 1.6);
    alpha = core * tw * 0.42;
  } else {
    // soft dust mote, deep brand blue
    float core = exp(-d * 8.0);
    col = vec3(0.135, 0.42, 0.95);
    alpha = core * 0.15;
  }
  gl_FragColor = vec4(col * alpha * vFade * uReveal, alpha * vFade * uReveal);
}
`;

export default function Cosmos() {
  const { geo, mat } = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const size = new Float32Array(COUNT);
    const kind = new Float32Array(COUNT);
    const seed = new Float32Array(COUNT);
    let i = 0;
    const put = (x: number, y: number, z: number, s: number, k: number) => {
      pos[i * 3] = x; pos[i * 3 + 1] = y; pos[i * 3 + 2] = z;
      size[i] = s; kind[i] = k; seed[i] = Math.random(); i++;
    };
    // stars: a long corridor around the whole flight route
    for (let n = 0; n < STARS; n++) {
      put(
        (Math.random() * 2 - 1) * 150,
        (Math.random() * 2 - 1) * 90,
        60 - Math.random() * 500,
        0.5 + Math.random() * 1.1,
        0,
      );
    }
    // dust: closer to the path, always adrift
    for (let n = 0; n < DUST; n++) {
      put(
        (Math.random() * 2 - 1) * 46,
        (Math.random() * 2 - 1) * 30,
        45 - Math.random() * 440,
        1.2 + Math.random() * 2.2,
        1,
      );
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
    geo.setAttribute('aKind', new THREE.BufferAttribute(kind, 1));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, -190), 600);
    const mat = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: 1 },
        uReveal: { value: 0 },
      },
    });
    return { geo, mat };
  }, []);

  useFrame((state) => {
    mat.uniforms.uTime.value = state.clock.elapsedTime;
    mat.uniforms.uPixelRatio.value = Math.min(state.viewport.dpr, 2);
    // The universe ignites once matter awakens (ACT 1 stays void) — and it
    // withdraws again for the finale. Drifting dust behind the brand mark
    // reads as dirt on the lens, so the frame returns to true black and the
    // logo is the only thing left alive in it.
    const p = timeline.progress;
    mat.uniforms.uReveal.value =
      smoothstep(0.03, 0.12, p) * (1 - smoothstep(0.885, 0.95, p) * 0.88);
  });

  return <points geometry={geo} material={mat} frustumCulled={false} renderOrder={-1} />;
}
