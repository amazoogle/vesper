// ============================================================================
// VESPER: THE GILDED ECLIPSE
// Custom GLSL Shaders: Corona Plasma Sun, Reactive Alchemical Surface,
// Axiom Runic Monolith Glow, and Temporal Rewind Chromatic Vignette
// ============================================================================

import * as THREE from 'three';

export const SHADERS = {
  // 1. ECLIPSE CORONA PLASMA SHADER (Volumetric Boiling Star)
  sunVertex: /* glsl */`
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;
    uniform float uTime;
    uniform float uHeat;

    // Simplex-style 3D hash noise
    float hash(vec3 p) {
      p = fract(p * 0.3183099 + 0.1);
      p *= 17.0;
      return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
    }

    float noise(vec3 x) {
      vec3 i = floor(x);
      vec3 f = fract(x);
      f = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
            mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
        mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
            mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z
      );
    }

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      float n = noise(position * 1.6 + vec3(uTime * 1.4));
      float displacement = n * (0.25 + uHeat * 0.65);
      vec3 newPos = position + normal * displacement;
      vPosition = newPos;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
    }
  `,

  sunFragment: /* glsl */`
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;
    uniform float uTime;
    uniform float uHeat;

    float hash(vec3 p) {
      p = fract(p * 0.3183099 + 0.1);
      p *= 17.0;
      return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
    }

    float noise(vec3 x) {
      vec3 i = floor(x);
      vec3 f = fract(x);
      f = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
            mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
        mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
            mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z
      );
    }

    void main() {
      float n1 = noise(vPosition * 1.8 + vec3(uTime * 0.9));
      float n2 = noise(vPosition * 3.6 - vec3(uTime * 1.5));
      float plasma = n1 * 0.65 + n2 * 0.35;

      vec3 coldGold = vec3(1.0, 0.65, 0.15);
      vec3 hotCrimson = vec3(1.0, 0.12, 0.05);
      vec3 coreWhite = vec3(1.0, 0.97, 0.88);

      vec3 baseCol = mix(coldGold, hotCrimson, clamp(uHeat, 0.0, 1.0));
      vec3 col = mix(baseCol * 0.6, coreWhite, smoothstep(0.35, 0.85, plasma));

      // Fresnel rim corona
      float rim = 1.0 - max(0.0, dot(vNormal, vec3(0.0, 0.0, 1.0)));
      col += vec3(1.0, 0.4, 0.1) * pow(rim, 2.2) * 1.4;

      gl_FragColor = vec4(col, 1.0);
    }
  `,

  // 2. REACTIVE ALCHEMICAL COURTYARD FLOOR SHADER
  // Blends carved obsidian cathedral stone with live 3D Alchemical DataTexture
  floorVertex: /* glsl */`
    varying vec2 vUv;
    varying vec3 vWorldPos;
    uniform sampler2D uChemTex;
    uniform float uTime;

    void main() {
      vUv = uv;
      vec4 chem = texture2D(uChemTex, uv);
      // Slight surface ripple for liquids & gilded veins
      float heightOffset = 0.0;
      if (chem.r > 0.1) {
        heightOffset = sin(uv.x * 40.0 + uTime * 4.0) * 0.04 * chem.g;
      }
      vec3 displaced = position + vec3(0.0, heightOffset, 0.0);
      vec4 worldPosition = modelMatrix * vec4(displaced, 1.0);
      vWorldPos = worldPosition.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
  `,

  floorFragment: /* glsl */`
    varying vec2 vUv;
    varying vec3 vWorldPos;
    uniform sampler2D uChemTex;
    uniform float uTime;
    uniform float uPulsePhase;

    // Procedural stone tile pattern
    float tilePattern(vec2 p) {
      vec2 grid = abs(fract(p * 18.0 - 0.5) - 0.5) / fwidth(p * 18.0);
      float line = min(grid.x, grid.y);
      return 1.0 - min(line, 1.0);
    }

    void main() {
      vec4 chem = texture2D(uChemTex, vUv);
      float matId = floor(chem.r * 10.0 + 0.5);
      float intensity = chem.g;

      // Base obsidian-basalt cathedral courtyard stone
      float distFromCenter = length(vWorldPos.xz);
      float ring = abs(sin(distFromCenter * 0.45));
      vec3 stone = vec3(0.07, 0.08, 0.12) + vec3(0.02, 0.025, 0.035) * smoothstep(0.85, 1.0, ring);

      // Subtle golden astrolabe inlays on the floor
      float inlay = smoothstep(0.97, 0.995, abs(sin(distFromCenter * 0.25 - uPulsePhase * 0.2)));
      stone = mix(stone, vec3(0.55, 0.42, 0.18), inlay * 0.35);

      // Grid mortar lines
      vec2 tileUv = fract(vWorldPos.xz * 0.5);
      float border = step(0.94, max(tileUv.x, tileUv.y));
      stone = mix(stone, vec3(0.03, 0.04, 0.06), border * 0.65);

      vec3 finalCol = stone;

      // Alchemical Element Overlays:
      // 1 = Wildfire (Emissive Orange-Gold)
      // 2 = Vitriol Acid (Luminous Emerald-Chartreuse)
      // 3 = Aether Water (Reflective Cerulean)
      // 4 = Mycelium Spore (Bioluminescent Violet)
      // 5 = Gilded Ichor / Gold (Metallic Solar Gold)
      // 6 = Crimson Blood (Dark Ruby)
      if (matId == 1.0) {
        float flicker = 0.75 + 0.25 * sin(uTime * 16.0 + vWorldPos.x * 4.0);
        finalCol = mix(stone, vec3(1.0, 0.38, 0.05) * flicker * 1.6, clamp(intensity, 0.4, 1.0));
      } else if (matId == 2.0) {
        float bubble = 0.8 + 0.2 * sin(uTime * 9.0 + vWorldPos.z * 6.0);
        finalCol = mix(stone, vec3(0.1, 0.95, 0.42) * bubble * 1.3, clamp(intensity, 0.4, 1.0));
      } else if (matId == 3.0) {
        finalCol = mix(stone, vec3(0.12, 0.58, 0.95), 0.75);
      } else if (matId == 4.0) {
        float sporeGlow = 0.8 + 0.2 * sin(uTime * 4.0 + vWorldPos.x * 2.0);
        finalCol = mix(stone, vec3(0.68, 0.25, 0.92) * sporeGlow, 0.85);
      } else if (matId == 5.0) {
        float shimmer = 0.85 + 0.15 * sin(uTime * 6.0 + (vWorldPos.x + vWorldPos.z) * 3.0);
        finalCol = mix(stone, vec3(1.0, 0.82, 0.22) * shimmer * 1.4, 0.9);
      } else if (matId == 6.0) {
        finalCol = mix(stone, vec3(0.65, 0.04, 0.12), 0.85);
      }

      // Distance fog blend
      float fogFactor = smoothstep(28.0, 58.0, distFromCenter);
      finalCol = mix(finalCol, vec3(0.03, 0.04, 0.07), fogFactor);

      gl_FragColor = vec4(finalCol, 1.0);
    }
  `
};
