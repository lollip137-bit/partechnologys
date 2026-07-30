import * as THREE from "three";
import { PALETTE } from "./design";

/**
 * The eyes are drawn by a single SDF fragment shader onto one plane placed just
 * in front of the dark visor. Two rounded-box eyes whose shape morphs from a set
 * of 0..1 expression uniforms, all GSAP-tweenable via the drive object:
 *
 *   uOpen   eyelid        (blink + sleepy/asleep)
 *   uHappy  upward arc     (happy / excited)
 *   uWide   bigger rounder (curious)
 *   uNarrow vertical squint(focused / thinking)
 *   uSad    downward flat  (disappointed)
 *
 * Additive blending over the dark visor gives the emissive "glow" look for free.
 */
export function createEyeMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uOpen: { value: 1 },
      uHappy: { value: 0 },
      uWide: { value: 0 },
      uNarrow: { value: 0 },
      uSad: { value: 0 },
      uAngry: { value: 0 },
      /** 0 = accent cyan, 1 = hot amber. Anger reads far better with a shift. */
      uHeat: { value: 0 },
      uHot: { value: new THREE.Color("#FF7A3C") },
      uLook: { value: new THREE.Vector2(0, 0) },
      uLookInfluence: { value: 1 },
      uFlicker: { value: 0 },
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(PALETTE.accent) },
      uIntensity: { value: 1 },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      precision highp float;
      varying vec2 vUv;
      uniform float uOpen, uHappy, uWide, uNarrow, uSad, uAngry, uHeat, uLookInfluence, uFlicker, uTime, uIntensity;
      uniform vec2 uLook;
      uniform vec3 uColor, uHot;

      mat2 rot(float a){ float c=cos(a), s=sin(a); return mat2(c,-s,s,c); }

      float sdRoundBox(vec2 p, vec2 b, float r){
        vec2 q = abs(p) - b + r;
        return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
      }

      // One eye. mirror = -1 (left) / +1 (right) so inner corners can tilt.
      float eye(vec2 uv, vec2 center, float mirror){
        vec2 p = uv - center;
        p -= uLook * 0.018 * uLookInfluence;      // subtle look offset

        float hx = mix(0.052, 0.072, uWide);
        float hy = mix(0.090, 0.098, uWide);
        hy *= mix(1.0, 0.42, uNarrow);            // focused squint
        hy *= clamp(uOpen, 0.02, 1.0);            // eyelid / blink
        float r = min(hx, hy) * 0.95;

        float bow = uHappy - uSad;                // + up (happy), - down (sad)
        float ang = mirror * bow * 0.45;          // inner-corner tilt
        p = rot(ang) * p;
        p.y -= bow * (p.x * p.x) * 9.0;           // arc the eye up/down

        float d = sdRoundBox(p, vec2(hx, hy), r);
        float m = smoothstep(0.006, -0.005, d);

        // ANGRY: slice a slanted brow off the top-inner corner. Cutting the
        // shape (rather than tilting the whole eye) is what reads as a scowl.
        if (uAngry > 0.001) {
          vec2 bp = rot(mirror * 0.62) * (p - vec2(mirror * 0.028, hy * 0.72));
          float brow = sdRoundBox(bp, vec2(hx * 1.7, hy * 0.78), 0.012);
          m -= uAngry * smoothstep(0.008, -0.004, brow);
        }
        return clamp(m, 0.0, 1.0);
      }

      void main(){
        float m = eye(vUv, vec2(0.345, 0.52), -1.0) + eye(vUv, vec2(0.655, 0.52), 1.0);
        m = clamp(m, 0.0, 1.0);
        // speaking flicker
        float flick = 1.0 - uFlicker * 0.45 * (0.5 + 0.5 * sin(uTime * 42.0));
        vec3 tint = mix(uColor, uHot, clamp(uHeat, 0.0, 1.0));
        vec3 col = tint * uIntensity * flick;
        gl_FragColor = vec4(col, m);
        #include <colorspace_fragment>
      }
    `,
  });
}
