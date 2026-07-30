// ============================================================
// GPU PARTICLE ENGINE — FBO ping-pong simulation.
// One conserved population: every particle alive in second one
// is still alive at the end. Only its organization changes.
// ============================================================

const NOISE = /* glsl */ `
// Sin-free hash. The old sin() version cost ~144 transcendentals per particle
// per frame (21M+ per frame at full density) and was the single biggest
// GPU cost in the whole experience.
vec3 hash33(vec3 p){
  vec3 q = fract(p * vec3(0.1031, 0.1030, 0.0973));
  q += dot(q, q.yxz + 33.33);
  return -1.0 + 2.0 * fract((q.xxy + q.yxx) * q.zyx);
}
float snoise(vec3 p){
  vec3 i = floor(p);
  vec3 f = fract(p);
  vec3 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(dot(hash33(i+vec3(0,0,0)), f-vec3(0,0,0)), dot(hash33(i+vec3(1,0,0)), f-vec3(1,0,0)), u.x),
        mix(dot(hash33(i+vec3(0,1,0)), f-vec3(0,1,0)), dot(hash33(i+vec3(1,1,0)), f-vec3(1,1,0)), u.x), u.y),
    mix(mix(dot(hash33(i+vec3(0,0,1)), f-vec3(0,0,1)), dot(hash33(i+vec3(1,0,1)), f-vec3(1,0,1)), u.x),
        mix(dot(hash33(i+vec3(0,1,1)), f-vec3(0,1,1)), dot(hash33(i+vec3(1,1,1)), f-vec3(1,1,1)), u.x), u.y), u.z);
}
// Division-safe normalize — GPU flush-to-zero on the vortex axis must never mint NaN
vec3 safeNorm(vec3 v){
  return v * inversesqrt(max(dot(v, v), 1e-8));
}
// Curl of the noise field — divergence-free, fluid-like motion
vec3 curlNoise(vec3 p){
  const float e = 0.12;
  float n1 = snoise(vec3(p.x, p.y + e, p.z));
  float n2 = snoise(vec3(p.x, p.y - e, p.z));
  float n3 = snoise(vec3(p.x, p.y, p.z + e));
  float n4 = snoise(vec3(p.x, p.y, p.z - e));
  float n5 = snoise(vec3(p.x + e, p.y, p.z));
  float n6 = snoise(vec3(p.x - e, p.y, p.z));
  float x = (n1 - n2) - (n3 - n4);
  float y = (n3 - n4) - (n5 - n6);
  float z = (n5 - n6) - (n1 - n2);
  return safeNorm(vec3(x, y, z));
}
`;

export const simVertex = /* glsl */ `
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

export const velocityFragment = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform sampler2D uPos;
uniform sampler2D uVel;
uniform sampler2D uTargetA;
uniform sampler2D uTargetB;
uniform float uBlend;
uniform float uTime;
uniform float uDt;
// behavior mix, scheduled on CPU from scroll progress
uniform float uSeek;      // spring toward morph target
uniform float uCrit;      // critical damping paired to uSeek (fast, ring-free arrival)
uniform float uCurlAmp;   // fluid turbulence amplitude
uniform float uCurlScale; // turbulence spatial frequency
uniform float uSwirl;     // vortex strength
uniform float uSwirlSpeed;// vortex angular acceleration (instability)
uniform float uBurst;     // explosion impulse (gaussian in time)
uniform float uDamp;      // drag
uniform float uMaxSpeed;
uniform vec3  uSwirlCenter;
uniform vec3  uRayO;      // pointer ray (world space)
uniform vec3  uRayD;
uniform float uPush;      // pointer repulsion strength
uniform vec3  uSpinCenter;// slow living rotation of the formed structure
uniform float uSpin;
uniform float uAlive;     // how "formed" the structure is (breathe + tilt amount)
uniform float uTiltX;     // cursor-driven orientation
uniform float uTiltY;
${NOISE}
void main(){
  vec3 pos = texture2D(uPos, vUv).xyz;
  vec4 velw = texture2D(uVel, vUv);
  vec3 vel = velw.xyz;
  float seed = fract(sin(dot(vUv, vec2(12.9898, 78.233))) * 43758.5453);

  vec3 force = vec3(0.0);

  // --- morph target seeking (spline/shape assembly)
  vec3 tA = texture2D(uTargetA, vUv).xyz;
  vec3 tB = texture2D(uTargetB, vUv).xyz;
  vec3 target = mix(tA, tB, uBlend);

  // Nothing is ever a statue. The formed structure breathes, and turns to
  // face the cursor — so every frame of the experience is alive.
  if (uAlive > 0.001) {
    vec3 rel = target - uSpinCenter;
    float ca = cos(uTiltY), sa = sin(uTiltY);
    rel = vec3(rel.x * ca + rel.z * sa, rel.y, -rel.x * sa + rel.z * ca);
    float cb = cos(uTiltX), sb = sin(uTiltX);
    rel = vec3(rel.x, rel.y * cb - rel.z * sb, rel.y * sb + rel.z * cb);
    // a slow inhale/exhale, plus a per-particle shimmer so the surface lives
    float breathe = 1.0 + 0.022 * sin(uTime * 0.7) + 0.012 * sin(uTime * 1.9 + seed * 6.28);
    target = uSpinCenter + rel * mix(1.0, breathe, uAlive);
  }
  vec3 toT = target - pos;
  float dist = length(toT);
  // spring with soft arrival — particles decelerate into place
  force += toT * uSeek * (0.6 + 0.4 * seed);

  // CRITICAL DAMPING — the reason assembly used to feel like sludge.
  // A stiff spring on its own oscillates, and the only brake was the global
  // per-frame drag (uDamp), which slows the whole JOURNEY as much as the
  // arrival. Pairing the spring with a velocity term of 2*sqrt(k) makes the
  // approach a pure exponential: matter leaves fast, crosses fast, and stops
  // dead on the target without a single overshoot. Raising uSeek without this
  // just makes the field jitter.
  force -= vel * uCrit * (0.85 + 0.3 * seed);

  // --- curl-noise flow field (alive, fluid). Skipped outright when the act
  // barely uses it — the field is by far the most expensive term here.
  if (uCurlAmp > 0.02) {
    force += curlNoise(pos * uCurlScale + vec3(0.0, uTime * 0.05, uTime * 0.03)) * uCurlAmp * (0.7 + 0.6 * seed);
  }

  // --- living vortex (birth of intelligence)
  if (uSwirl > 0.001) {
    vec3 rel = pos - uSwirlCenter;
    float r = length(rel.xz) + 1e-3;
    vec3 tangent = vec3(-rel.z, 0.0, rel.x) / r;
    float breathe = 0.5 + 0.5 * sin(uTime * 0.55 + r * 0.35);
    // every particle owns an orbital ring — a living, breathing accretion disk
    float rTarget = (1.8 + seed * 7.8) * (0.88 + 0.24 * breathe);
    force += tangent * uSwirl * uSwirlSpeed * (1.0 + 0.4 * breathe) * (0.75 + 0.5 * seed);
    force += -safeNorm(vec3(rel.x, 0.0, rel.z)) * uSwirl * 0.9 * clamp((r - rTarget) * 0.6, -1.5, 1.5);
    force += vec3(0.0, -rel.y, 0.0) * uSwirl * 0.5;
    // inner core repulsion keeps the iris open
    force += safeNorm(vec3(rel.x, rel.y * 0.3, rel.z)) * uSwirl * 0.9 * smoothstep(1.6, 0.0, r);
  }

  // --- the detonation. Real impulse physics, no dissolve.
  if (uBurst > 0.001) {
    vec3 dir = safeNorm(pos - uSwirlCenter + hash33(pos * 0.7) * 0.6);
    force += dir * uBurst * (0.55 + 0.9 * seed);
  }

  // --- pointer physics: a hand placed into water.
  // Matter is pushed aside AND carried around the cursor, so it flows past
  // rather than exploding away — then the seek spring settles it back.
  if (uPush > 0.01) {
    vec3 wv = pos - uRayO;
    float tp = max(dot(wv, uRayD), 0.0);
    vec3 dvec = pos - (uRayO + uRayD * tp);
    float dd = length(dvec) + 1e-3;
    vec3 radial = dvec / dd;
    float falloff = exp(-dd * 0.44);
    force += radial * uPush * falloff * (0.65 + 0.5 * seed);
    // tangential swirl — the curve that makes it read as fluid, not a blast
    vec3 tangential = safeNorm(cross(uRayD, radial));
    force += tangential * uPush * falloff * 0.5 * (0.4 + seed);
  }

  // --- the structure is never a statue: it slowly turns, floating
  if (uSpin > 0.001) {
    vec3 srel = pos - uSpinCenter;
    float sr = length(srel.xz) + 1e-3;
    force += vec3(-srel.z, 0.0, srel.x) / sr * uSpin * smoothstep(0.4, 2.0, sr);
  }

  vel += force * uDt;
  vel *= uDamp;
  // far-flung particles may fly faster — arrivals stay gentle, journeys stay swift
  float cap = uMaxSpeed * (1.0 + dist * 0.55 * step(0.01, uSeek));
  float spd = length(vel);
  if (spd > cap) vel *= cap / spd;
  // NaN scrub — a poisoned particle resets instead of dying forever
  if (!(dot(vel, vel) < 1e10)) vel = vec3(0.0);
  gl_FragColor = vec4(vel, velw.w);
}
`;

export const positionFragment = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform sampler2D uPos;
uniform sampler2D uVel;
uniform sampler2D uSpawn;
uniform float uDt;
void main(){
  vec4 posw = texture2D(uPos, vUv);
  vec3 vel = texture2D(uVel, vUv).xyz;
  vec3 p = posw.xyz + vel * uDt;
  // NaN scrub — resurrect at spawn so the population is truly conserved
  if (!(dot(p, p) < 1e12)) p = texture2D(uSpawn, vUv).xyz;
  gl_FragColor = vec4(p, posw.w);
}
`;

export const renderVertex = /* glsl */ `
precision highp float;
attribute vec2 aRef;
uniform sampler2D uPos;
uniform sampler2D uVel;
uniform sampler2D uTargetA;
uniform sampler2D uTargetB;
uniform float uBlend;
uniform float uSize;
uniform float uReveal;   // fraction of population that exists yet
uniform float uPixelRatio;
varying float vW;        // shape color coordinate
varying float vSeed;
varying float vSpeed;
varying float vAlive;
varying float vDepth;
varying float vDist0;    // distance from the genesis point (awakening wave)
varying vec2  vStreak;   // screen-space velocity direction (motion blur)
varying float vStretch;  // how elongated this particle should be
varying float vPointSize;// true on-screen size, for pixel-accurate AA
varying float vTemp;     // per-particle colour temperature
varying float vBright;   // per-particle luminance
void main(){
  vec3 pos = texture2D(uPos, aRef).xyz;
  vec3 vel = texture2D(uVel, aRef).xyz;
  float wA = texture2D(uTargetA, aRef).w;
  float wB = texture2D(uTargetB, aRef).w;
  vW = mix(wA, wB, uBlend);
  vSeed = fract(sin(dot(aRef, vec2(12.9898, 78.233))) * 43758.5453);
  float s2 = fract(vSeed * 7.31);
  float s3 = fract(vSeed * 131.77);
  vSpeed = length(vel);
  // genesis: particles come into existence one by one, then in floods
  vAlive = step(vSeed, uReveal);
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  vDepth = -mv.z;
  vDist0 = length(pos);

  // Size distribution is heavily skewed toward the sub-pixel: the vast
  // majority of matter is finer than a pixel and only reads as density,
  // while a small minority is large enough to resolve as a mote.
  // Skewed harder toward the sub-pixel than before, and the ceiling lowered:
  // the old 2.5px cap meant a large share of the population sat AT the clamp,
  // so matter read as a cloud of little discs instead of dust. Now the bulk is
  // genuinely finer than a pixel and only registers as density.
  float sizeRand = pow(s2, 2.9);
  float size = uSize * (0.22 + 1.3 * sizeRand);
  float ps = size * uPixelRatio * (95.0 / max(vDepth, 0.5));
  ps = clamp(ps, 0.4, 1.85);

  vec4 clip = projectionMatrix * mv;

  // MOTION BLUR — project the velocity to the screen and hand the fragment
  // shader a direction to smear along, so fast matter draws light trails.
  vec4 clipAhead = projectionMatrix * modelViewMatrix * vec4(pos + vel * 0.05, 1.0);
  vec2 a = clip.xy / max(clip.w, 0.0001);
  vec2 b = clipAhead.xy / max(clipAhead.w, 0.0001);
  vec2 d = b - a;
  float dl = length(d);
  vStreak = dl > 1e-5 ? d / dl : vec2(1.0, 0.0);
  // Motion blur needs a DEAD ZONE. A formed structure still breathes, spins and
  // chases a moving target, so without a threshold that residual jitter smears
  // a handful of motes into bright white slashes that read as lens scratches on
  // an otherwise still frame. Only genuine travel earns a streak now.
  vStretch = clamp((dl - 0.0045) * 30.0, 0.0, 2.2);
  ps *= 1.0 + vStretch * 0.5;

  vPointSize = ps;
  gl_PointSize = ps;

  // no two particles are identical — temperature and luminance both vary,
  // luminance skewed dim so the field reads as depth rather than confetti
  vTemp = s3;
  vBright = 0.38 + 1.0 * pow(fract(s3 + s2 * 0.37), 1.6);

  gl_Position = clip;
}
`;

export const renderFragment = /* glsl */ `
precision highp float;
uniform vec3 uCol0;
uniform vec3 uCol1;
uniform vec3 uCol2;
uniform float uTime;
uniform float uPulse;     // signal traffic amount (neural / circuits / arcs)
uniform float uPulseFreq;
uniform float uFog;
uniform float uEnergy;    // global luminosity (scroll velocity etc.)
uniform float uWave;      // awakening wave amount
uniform float uWaveR;     // awakening wavefront radius
varying float vW;
varying float vSeed;
varying float vSpeed;
varying float vAlive;
varying float vDepth;
varying float vDist0;
varying vec2  vStreak;
varying float vStretch;
varying float vPointSize;
varying float vTemp;
varying float vBright;
uniform float uIntensity;  // HDR exposure of the nucleus
uniform float uHalo;       // 1 = soft atmosphere per mote, 0 = pin-sharp points
// How much of its own glow each mote carries. Normally low, because bloom
// supplies the light downstream — but when the quality governor drops the
// composer on a weak GPU there IS no bloom, and the field would otherwise
// collapse into flat grey dots.
uniform float uAtmos;
// ---- COMPOSITION MASK ----
// Every act deliberately shoves the subject into one half of the frame so the
// copy panel owns the other. Stray matter drifting through that empty half
// breaks the composition — the panel should sit on true black. This fades the
// field out by screen distance from the subject, so each act reads as ONE
// object against nothing, and the finale loses the confetti around the mark.
uniform vec2  uRes;
uniform vec2  uFocus;   // subject's screen position, 0..1
uniform float uMask;    // 0 = no mask (ACT I is a full-frame field by design)
uniform float uMaskIn;  // radius (in screen HEIGHTS) held at full brightness
uniform float uMaskOut; // radius by which matter is fully black
void main(){
  if (vAlive < 0.5) discard;
  vec2 c = gl_PointCoord - 0.5;

  // COMET GEOMETRY — squash across the direction of travel, and let the
  // sprite trail BEHIND the particle rather than around it, so movement
  // reads as a short streak of light instead of a smeared ball.
  vec2 axis = vStreak;
  vec2 perp = vec2(-axis.y, axis.x);
  float along = dot(c, axis);
  float across = dot(c, perp);
  float tail = 1.0 + vStretch;
  float d = length(vec2(along / tail, across));
  if (d > 0.5) discard;

  // one screen pixel expressed in sprite space — the edge is anti-aliased to
  // exactly one pixel no matter how small the particle gets
  float aa = clamp(1.2 / max(vPointSize, 0.5), 0.06, 0.6);

  // A MICROSCOPIC NUCLEUS plus an almost invisible atmosphere. The visible
  // glow is produced downstream by HDR bloom — never by a fat soft sprite,
  // which is what makes particles read as circles.
  float nucleus = 1.0 - smoothstep(0.0, 0.10 + aa, d);
  // The atmosphere is what makes a travelling field feel like dust. On an
  // assembled MARK it is just fog around every edge, so the finale turns it
  // down and the logo resolves into clean points.
  float atmos = exp(-d * 8.5) * uHalo;

  // the trailing half fades; the leading edge stays crisp
  float tailFade = mix(1.0, smoothstep(-0.62, 0.08, along / max(tail * 0.5, 1e-3)),
                       min(vStretch, 1.0) * 0.8);

  // ---- ONE colour family. Brightness and temperature vary, hue does not.
  vec3 col = vW < 0.5
    ? mix(uCol0, uCol1, vW * 2.0)
    : mix(uCol1, uCol2, vW * 2.0 - 1.0);
  col = mix(col, uCol2, vTemp * 0.20);          // cooler, toward brand white
  col = mix(col, uCol0, (1.0 - vTemp) * 0.14);  // deeper, toward brand navy

  // motion energy → hotter core. Threshold raised to sit above the resting
  // breathe/spin velocity of an assembled structure, so only matter actually in
  // transit blows out toward white.
  float heat = smoothstep(12.0, 30.0, vSpeed);

  // travelling signals along structures (w is the flow coordinate)
  float ph = fract(vW * uPulseFreq - uTime * 0.55 + vSeed * 0.05);
  float pulse = smoothstep(0.0, 0.06, ph) * smoothstep(0.16, 0.06, ph) * uPulse;

  // the awakening — a luminous wave propagating through sleeping matter
  float wave = 0.0;
  if (uWave > 0.001) {
    wave = exp(-pow((vDist0 - uWaveR) * 0.35, 2.0)) * uWave;
  }

  // atmospheric attenuation — distant matter dissolves into haze
  float fog = exp(-vDepth * uFog);
  float twinkle = 0.95 + 0.07 * sin(uTime * (0.5 + vSeed) + vSeed * 40.0);
  float lum = vBright * fog * twinkle * tailFade * (0.85 + 0.4 * uEnergy);
  lum *= smoothstep(0.6, 2.6, vDepth); // don't blow out when the camera passes through

  // composition mask — distance measured in screen HEIGHTS so the falloff is
  // identical on every aspect ratio (on 16:9 the far corner sits at ~0.89)
  if (uMask > 0.001) {
    vec2 dv = (gl_FragCoord.xy / uRes - uFocus) * vec2(uRes.x / uRes.y, 1.0);
    lum *= 1.0 - uMask * smoothstep(uMaskIn, uMaskOut, length(dv));
  }
  if (lum < 0.0008) discard; // fully masked matter costs no blending

  // HDR: the nucleus is allowed far past 1.0 so bloom lifts it into real light
  float corePower = uIntensity * (1.0 + heat * 2.2 + pulse * 3.4 + wave * 3.0);
  vec3 hdr = col * (atmos * uAtmos + nucleus * corePower) * lum;
  // hot cores desaturate toward white, exactly like an over-exposed highlight
  hdr = mix(hdr, vec3(dot(hdr, vec3(0.33))) + hdr * 0.35,
            clamp(nucleus * (heat + pulse) * 0.5, 0.0, 0.55));

  float alpha = (atmos * 0.32 + nucleus * 0.9) * lum;
  gl_FragColor = vec4(hdr, alpha);
}
`;
