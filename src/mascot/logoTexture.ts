import * as THREE from "three";
import { PALETTE } from "./design";

/**
 * Chest logo as an emissive canvas texture (brief §2: applied as a material
 * decal on the torso, NOT floating geometry). We render an original "PAR"
 * wordmark — a simplified, heavy geometric mark chosen to stay legible at
 * 320px viewport width while the model rotates (brief §6 legibility test).
 *
 * The white texel value IS the emissive mask; intensity is driven at runtime by
 * the material's emissiveIntensity (idle 1.0 / thinking 2.2 / celebrate 3.0).
 */
export function createLogoTexture(): THREE.CanvasTexture {
  const S = 512;
  const canvas = document.createElement("canvas");
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext("2d")!;

  // transparent background so only the mark glows
  ctx.clearRect(0, 0, S, S);

  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Heavy geometric wordmark. Kept short + bold so it survives downscaling.
  ctx.font = "900 200px ui-sans-serif, system-ui, 'Segoe UI', Arial, sans-serif";
  ctx.fillText("PAR", S / 2, S / 2 - 10);

  // A thin underline + accent dot — the one small brand flourish.
  ctx.fillRect(S / 2 - 150, S / 2 + 120, 300, 16);
  ctx.beginPath();
  ctx.arc(S / 2 + 168, S / 2 + 128, 18, 0, Math.PI * 2);
  ctx.fill();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}

/** The accent color as a THREE.Color, for the logo's emissive tint. */
export const LOGO_EMISSIVE = new THREE.Color(PALETTE.accent);
