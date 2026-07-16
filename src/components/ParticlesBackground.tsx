"use client";

import Script from "next/script";

declare global {
  interface Window {
    particlesJS: (id: string, config: Record<string, unknown>) => void;
  }
}

export default function ParticlesBackground() {
  return (
    <>
      <div id="particles-js" className="absolute inset-0 -z-20 w-full h-full" />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/particles.js/2.0.0/particles.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (typeof window !== "undefined" && window.particlesJS) {
            window.particlesJS("particles-js", {
              particles: {
                number: { value: 30 },
                shape: { type: "circle" },
                size: { value: 2 },
                color: { value: "#14A800" },
                opacity: {
                  value: 0.9,
                  random: true,
                  anim: {
                    enable: true,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false,
                  },
                },
                line_linked: {
                  enable: true,
                  distance: 150,
                  color: "#151c17",
                  opacity: 1,
                },
                move: { speed: 2 },
              },
            });
          }
        }}
      />
    </>
  );
}
