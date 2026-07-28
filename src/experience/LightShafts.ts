import { Effect } from 'postprocessing';
import { Uniform, Vector2 } from 'three';

/**
 * Volumetric light shafts — a radial blur that streams the scene's own
 * brightness outward from the heart of whatever structure is on stage.
 * Merged into the composer's main shader, so it costs taps rather than
 * an extra full-screen pass.
 */
const fragment = /* glsl */ `
uniform vec2 uLight;
uniform float uStrength;
uniform float uDecay;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  if (uStrength < 0.001) {
    outputColor = inputColor;
    return;
  }
  vec2 delta = (uv - uLight) * 0.14;
  vec2 pos = uv;
  vec3 acc = vec3(0.0);
  float illum = 1.0;
  float total = 0.0;
  // march back toward the light, accumulating whatever is already glowing
  for (int i = 0; i < 6; i++) {
    pos -= delta;
    illum *= uDecay;
    acc += texture2D(inputBuffer, pos).rgb * illum;
    total += illum;
  }
  acc /= max(total, 0.0001);
  // shafts only ADD light, never darken the frame
  outputColor = vec4(inputColor.rgb + acc * uStrength, inputColor.a);
}
`;

export class LightShaftsEffect extends Effect {
  constructor() {
    super('LightShaftsEffect', fragment, {
      uniforms: new Map<string, Uniform>([
        ['uLight', new Uniform(new Vector2(0.5, 0.5))],
        ['uStrength', new Uniform(0)],
        ['uDecay', new Uniform(0.92)],
      ]),
    });
  }

  set light(v: Vector2) {
    (this.uniforms.get('uLight') as Uniform).value.copy(v);
  }
  set strength(v: number) {
    (this.uniforms.get('uStrength') as Uniform).value = v;
  }
}
