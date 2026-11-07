// ============================================================================
// VESPER: THE GILDED ECLIPSE — HADES-STYLE 3D ACTION ROGUELIKE ENGINE
// ============================================================================
// - Opens with a sweeping 3D Cinematic Title Screen (low-angle orbit camera
//   framing Vesper, the House of Ash, rising 3D golden embers, and the boiling
//   GLSL Eclipse Star behind a rotating Celestial Astrolabe).
// - Starts in Chamber 0 (The House of Ash) where you can walk up to Soren,
//   Lady Nyxara, and Magistrate Vane to talk ([E] non-blocking voice banner)
//   and step through the glowing North Archway to begin your escape run.
// - ZERO POPUP MODALS. Gameplay never pauses or interrupts with menus.
// - Progressive Chamber-by-Chamber Mechanic Awakening (Chambers I – XV):
//   * Chamber I:    Chrono-Stillness & Deterministic Sightlines
//   * Chamber II:   The Memory Sledgehammer [F]
//   * Chamber III:  Reactive 3D Surface Alchemy
//   * Chamber IV:   3D Runic Monoliths of Creation
//   * Chamber V:    3D Astral Lasso [Right-Drag] & Tarot Arcana [Q]
//   * Chamber VI:   Ley-Line Pylons [B], Astral Rewind [R] & 14-Segment Leviathan
//   * Chamber VII:  3D Aether Grapple-Hook [G]
//   * Chamber VIII: Solar Aegis Parry & Posture Deathblow [C]
//   * Chamber IX:   3D Phantom Time-Echo Twin [T]
//   * Chamber X:    Subterranean Abyssal Burrowing & Geode Eruption [X]
//   * Chamber XI:   3D Astral Polyomino Sigil-Tectonics [Z]
//   * Chamber XII:  Ethereal Crown-Projection & Thrall Possession [V]
//   * Chamber XIII: Linked 3D Rift-Portal Gateways & Prismatic Split [P]
//   * Chamber XIV:  3D Black-Sun Gravity Singularity Well [N]
//   * Chamber XV:   120 BPM Harmonic Eclipse Cadence & Omniversal Resonance [M]
// ============================================================================

import * as THREE from 'three';
import { SHADERS } from './shaders.js';
import { ModelFactory } from './models.js';
import { SoundEngine } from './audio.js';
import { LORE } from './lore.js';
import { HOUSE_NPCS, CHAMBERS, BOON_CHOICES } from './chambers.js';
import { PsycheAndTunerSystem } from './systems/psyche.js';
import { AnatomyAndReliquarySystem } from './systems/anatomy_reliquary.js';
import { CosmosAndEcologySystem } from './systems/cosmos_ecology.js';

const CHEM_SIZE = 64;
const WORLD_SPAN = 46;

const POLYOMINO_SHAPES = [
  [[0, 0], [1, 0], [0, 1], [0, 2]],          // L-Tetromino
  [[-1, 0], [0, 0], [1, 0], [0, 1]],         // T-Tetromino
  [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]] // Astral Cross-Pentomino
];

class VesperGame {
  constructor() {
    this.sfx = new SoundEngine();
    this.clock = new THREE.Clock();

    // Persistent Progression across Escape Attempts
    this.meta = {
      runCount: 1,
      highestChamber: 0,
      unlockedAbilities: new Set(['CORE_COMBAT']),
      boonsCollected: []
    };

    // Deep Subsystems (unlock progressively as chambers are cleared)
    this.psyche = new PsycheAndTunerSystem(this);
    this.anatomy = new AnatomyAndReliquarySystem(this);
    this.cosmos = new CosmosAndEcologySystem(this);

    this.currentChamberIdx = 0;
    this.codexOpen = false;
    this.activeTab = 'COURT';

    this.initRendererAndScene();
    this.initPersistentRunState();
    this.loadChamber(0);
    this.bindInputs();
    this.updateHUD();

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initRendererAndScene() {
    this.container = document.getElementById('viewport-container');
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.22;
    this.container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x050811);
    this.scene.fog = new THREE.FogExp2(0x050811, 0.018);

    // Hades-style Crisp Isometric 3D Camera
    this.camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.5, 220);
    this.cameraOffset = new THREE.Vector3(0, 20, 21);
    this.cameraLookTarget = new THREE.Vector3(0, 1, 0);

    this.raycaster = new THREE.Raycaster();
    this.mouseNDC = new THREE.Vector2();
    this.groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    this.aimWorldPoint = new THREE.Vector3(0, 0, 0);

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  initPersistentRunState() {
    this.state = {
      onTitleScreen: true,
      time: 0,
      simTime: 0,
      timeScale: 1.0,
      targetTimeScale: 1.0,
      dilationHold: 0,
      rewinding: false,
      chamberCleared: false,

      hp: 100,
      maxHp: 100,
      mana: 100,
      maxMana: 100,

      starTimer: 120.0,
      starKelvin: 3200,

      essence: 0,
      resonance: 1,
      totalScore: 0,
      sealThreshold: 1500,
      eclipseTier: 1,
      architectSteps: 18,
      lastDieRoll: 6,

      // Boon Upgrades
      bonusSplitCount: 0,
      sledgeSpawnsOrbs: false,
      vitriolDash: false,
      geodeBurrowBonus: false,
      polyominoBonus: false,
      prismaticPortalsBonus: false,
      singularityCollapseBonus: false,

      // Biome II, III & IV Combat States
      parryTimer: 0,
      grappleAnchors: [],
      phantomTwins: [],
      burrowTimer: 0,
      polyominoSigils: [],
      polyominoShapeIdx: 0,
      riftPortals: [],
      portalCooldown: 0,
      singularities: [],

      activeAxioms: [],
      axiomMap: {},

      npcs: [],
      exitGates: [],
      monoliths: [],
      triadSocketMesh: null,
      pillars: [],
      wardens: [],
      projectiles: [],
      astralSpheres: [],
      leyConveyors: [],
      soulEchoes: [],
      floatingLabels: [],
      capturedReality: null,

      lassoActive: false,
      lassoPoints: [],

      deck: [],
      hand: [],
      selectedCardIds: new Set(),
      relics: [...LORE.STARTER_RELICS],

      history: [],
      chronicles: []
    };

    this.keys = { w: false, a: false, s: false, d: false };
    this.initTarotDeck();
  }

  // ==========================================================================
  // CINEMATIC TITLE SCREEN TRANSITIONS
  // ==========================================================================
  dismissTitleScreen(targetChamberIdx = 0) {
    if (!this.state.onTitleScreen && targetChamberIdx === this.currentChamberIdx) return;

    this.state.onTitleScreen = false;
    this.sfx.playEclipseOverture();

    // Unlock all mechanics up to the selected chamber if jumping ahead from Title Screen
    for (let i = 1; i <= targetChamberIdx; i++) {
      if (CHAMBERS[i] && CHAMBERS[i].unlocksMechanic) {
        this.meta.unlockedAbilities.add(CHAMBERS[i].unlocksMechanic);
      }
    }

    if (targetChamberIdx !== this.currentChamberIdx) {
      this.loadChamber(targetChamberIdx);
    } else if (this.currentChamberIdx === 0) {
      this.showNPCDialogue(
        HOUSE_NPCS[0].name,
        HOUSE_NPCS[0].title,
        HOUSE_NPCS[0].greetings[0],
        HOUSE_NPCS[0].color
      );
    }

    const titleEl = document.getElementById('cinematic-title-screen');
    const hudEl = document.getElementById('hud-overlay');
    const labelsEl = document.getElementById('floating-labels-layer');

    if (titleEl) {
      titleEl.classList.add('dissolving');
      setTimeout(() => {
        if (!this.state.onTitleScreen) {
          titleEl.classList.add('hidden');
        }
      }, 920);
    }
    if (hudEl) hudEl.classList.remove('title-hidden');
    if (labelsEl) labelsEl.classList.remove('title-hidden');

    this.updateHUD();
  }

  openTitleScreen() {
    this.state.onTitleScreen = true;
    this.sfx.playArcanaChord();

    const titleEl = document.getElementById('cinematic-title-screen');
    const hudEl = document.getElementById('hud-overlay');
    const labelsEl = document.getElementById('floating-labels-layer');

    if (titleEl) {
      titleEl.classList.remove('hidden');
      requestAnimationFrame(() => {
        titleEl.classList.remove('dissolving');
      });
    }
    if (hudEl) hudEl.classList.add('title-hidden');
    if (labelsEl) labelsEl.classList.add('title-hidden');
  }

  hasAbility(abilityKey) {
    return this.meta.unlockedAbilities.has(abilityKey);
  }

  // ==========================================================================
  // LOAD A SPECIFIC 3D CHAMBER (Seamless Room Transition)
  // ==========================================================================
  loadChamber(chamberIndex, chosenBoon = null) {
    this.currentChamberIdx = chamberIndex % CHAMBERS.length;
    const ch = CHAMBERS[this.currentChamberIdx];
    const s = this.state;

    // Apply chosen Boon from the Exit Gate just walked through!
    if (chosenBoon) {
      this.applyBoonUpgrade(chosenBoon);
    }

    // Unlock this chamber's signature mechanic!
    if (ch.unlocksMechanic) {
      const wasNew = !this.meta.unlockedAbilities.has(ch.unlocksMechanic);
      this.meta.unlockedAbilities.add(ch.unlocksMechanic);
      if (wasNew && ch.boonTitle && !s.onTitleScreen) {
        this.showBannerNotification(ch.boonTitle, ch.boonDesc, '#fbbf24');
      }
    }

    // Clear 3D scene
    while (this.scene.children.length > 0) {
      this.scene.remove(this.scene.children[0]);
    }

    s.npcs = [];
    s.exitGates = [];
    s.monoliths = [];
    s.pillars = [];
    s.wardens = [];
    s.projectiles = [];
    s.astralSpheres = [];
    s.leyConveyors = [];
    s.grappleAnchors = [];
    s.phantomTwins = [];
    s.polyominoSigils = [];
    s.riftPortals = [];
    s.portalCooldown = 0;
    s.singularities = [];
    s.history = [];
    s.activeAxioms = [];
    s.axiomMap = {};
    s.chamberCleared = false;
    s.triadSocketMesh = null;
    s.parryTimer = 0;
    s.burrowTimer = 0;

    this.scene.background = new THREE.Color(ch.fogColor);
    this.scene.fog = new THREE.FogExp2(ch.fogColor, 0.017);

    this.setupLightingAndSky();
    this.setupAtmosphericEmbers();
    this.setupAlchemicalFloor(ch);
    this.setupChamberPerimeter(ch);
    this.setupHeroAndOrbitalBlades();
    this.setupLassoMesh();

    // Place Vesper near the southern entrance of the chamber
    this.hero.pos.set(0, 0, ch.arenaRadius - 4.5);
    if (!s.onTitleScreen) {
      this.camera.position.copy(this.hero.pos).add(this.cameraOffset);
    }

    // Populate Chamber Pillars & Braziers
    for (const [px, pz] of ch.pillars) {
      this.spawnPillar(px, pz);
    }
    for (const [bx, bz] of ch.braziers) {
      const brazier = ModelFactory.createBrazier();
      brazier.position.set(bx, 0, bz);
      this.scene.add(brazier);
    }

    // Populate 3D Aether Grapple Anchors (supports both [gx, gz] and {x, z})
    if (ch.grappleAnchors) {
      for (const item of ch.grappleAnchors) {
        const gx = Array.isArray(item) ? item[0] : item.x;
        const gz = Array.isArray(item) ? item[1] : item.z;
        const anchorMesh = ModelFactory.createGrappleAnchor();
        anchorMesh.position.set(gx, 0, gz);
        this.scene.add(anchorMesh);
        s.grappleAnchors.push({ mesh: anchorMesh, pos: anchorMesh.position });
      }
    }

    // Populate Chamber Runic Monoliths
    for (const m of ch.monoliths) {
      this.spawnMonolith(m.word, m.category, m.x, m.z);
    }

    // In Chamber 4 (Hall of Living Axioms), place a glowing golden Triad Socket ring at (2.2, 0)
    if (ch.id === 'CHAMBER_4_MONOLITHS') {
      const socketRing = new THREE.Mesh(
        new THREE.RingGeometry(0.85, 1.15, 32),
        new THREE.MeshBasicMaterial({ color: 0xfbbf24, side: THREE.DoubleSide, transparent: true, opacity: 0.85 })
      );
      socketRing.rotation.x = -Math.PI / 2;
      socketRing.position.set(2.2, 0.06, 0);
      this.scene.add(socketRing);
      s.triadSocketMesh = socketRing;
    }

    this.evaluateAxiomMonoliths();

    // If Chamber 0 (House of Ash Hub): Spawn NPCs & open North Escape Gate immediately
    if (this.currentChamberIdx === 0) {
      for (const npcData of HOUSE_NPCS) {
        const mesh = ModelFactory.createNPCModel(npcData.color);
        mesh.position.set(npcData.pos.x, 0, npcData.pos.z);
        this.scene.add(mesh);
        s.npcs.push({
          ...npcData,
          mesh,
          pos: mesh.position,
          quoteIdx: 0
        });
      }
      this.spawnChamberExitGates(ch);
      if (!s.onTitleScreen) {
        this.showNPCDialogue(
          HOUSE_NPCS[0].name,
          HOUSE_NPCS[0].title,
          HOUSE_NPCS[0].greetings[0],
          HOUSE_NPCS[0].color
        );
      }
    } else {
      // Combat Chamber: Spawn Seraph Wardens
      ch.wardens.forEach((wData, i) => {
        this.spawnWarden(wData.x, wData.z, wData.name, i % 2, wData.hp);
      });

      // If Chamber 6+ (Apex Sanctum, Upper Spire, Abyssal Clockwork & Celestial Observatory), awaken the 14-Segment Abyssal Leviathan!
      if (this.hasAbility('FULL_CONVERGENCE')) {
        this.cosmos.init3DEntities(this.scene);
      }
    }

    this.updateHUD();
  }

  // 3D Floating Gilded Embers & Ash Particle Field
  setupAtmosphericEmbers() {
    const count = 340;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 44;
      positions[i * 3 + 1] = Math.random() * 22;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 44;

      const isGold = Math.random() > 0.28;
      colors[i * 3] = isGold ? 0.98 : 0.22;
      colors[i * 3 + 1] = isGold ? 0.72 : 0.74;
      colors[i * 3 + 2] = isGold ? 0.18 : 0.98;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.22,
      vertexColors: true,
      transparent: true,
      opacity: 0.82,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.emberPoints = new THREE.Points(geo, mat);
    this.scene.add(this.emberPoints);
  }

  updateAtmosphericEmbers(realDt) {
    if (!this.emberPoints) return;
    const posAttr = this.emberPoints.geometry.attributes.position;
    const arr = posAttr.array;
    for (let i = 0; i < arr.length; i += 3) {
      arr[i] += Math.sin(this.state.time * 0.8 + i) * realDt * 0.35;
      arr[i + 1] += realDt * (1.1 + (i % 5) * 0.22);
      if (arr[i + 1] > 22) {
        arr[i + 1] = 0.2;
      }
    }
    posAttr.needsUpdate = true;
  }

  applyBoonUpgrade(boon) {
    this.meta.boonsCollected.push(boon);
    this.sfx.playArcanaChord();
    this.state.hp = Math.min(this.state.maxHp, this.state.hp + 25);

    if (boon.id === 'BOON_SOLAR_FLARE') {
      this.state.bonusSplitCount += 1;
      this.state.resonance += 2;
    } else if (boon.id === 'BOON_SEISMIC_SLEDGE') {
      this.state.sledgeSpawnsOrbs = true;
      this.state.resonance += 2;
    } else if (boon.id === 'BOON_AETHER_ORBITALS') {
      this.hero.orbitalCount += 2;
      this.state.resonance += 2;
    } else if (boon.id === 'BOON_VITRIOL_WAKE') {
      this.state.vitriolDash = true;
      this.state.resonance += 2;
    } else if (boon.id === 'BOON_GEODE_BURROW') {
      this.state.geodeBurrowBonus = true;
      this.state.resonance += 2;
    } else if (boon.id === 'BOON_POLYOMINO_RESONANCE') {
      this.state.polyominoBonus = true;
      this.state.resonance += 3;
    } else if (boon.id === 'BOON_PRISMATIC_PORTALS') {
      this.state.prismaticPortalsBonus = true;
      this.state.resonance += 3;
    } else if (boon.id === 'BOON_SINGULARITY_COLLAPSE') {
      this.state.singularityCollapseBonus = true;
      this.state.resonance += 3;
    }
  }

  setupChamberPerimeter(ch) {
    const R = ch.arenaRadius;
    const count = 16;
    for (let i = 0; i < count; i++) {
      const ang = (i / count) * Math.PI * 2;
      if (Math.sin(ang) < -0.75) continue;
      const px = Math.cos(ang) * R;
      const pz = Math.sin(ang) * R;
      const col = ModelFactory.createCathedralPillar();
      col.position.set(px, 0, pz);
      this.scene.add(col);
    }
  }

  spawnChamberExitGates(ch) {
    const s = this.state;
    if (s.exitGates.length > 0) return;
    s.chamberCleared = true;
    if (!s.onTitleScreen && this.currentChamberIdx > 0) {
      this.sfx.playArcanaChord();
    }

    const nextIdx = (this.currentChamberIdx + 1) % CHAMBERS.length;

    if (this.currentChamberIdx === 0) {
      const gateMesh = ModelFactory.createExitGate(0xf59e0b);
      gateMesh.position.set(0, 0, -ch.arenaRadius + 2.0);
      this.scene.add(gateMesh);
      s.exitGates.push({
        mesh: gateMesh,
        pos: gateMesh.position,
        nextChamberIdx: 1,
        boon: null,
        label: '⚔️ ENTER CHAMBER I: COURTYARD OF FIRST BLOOD'
      });
      return;
    }

    const b1 = BOON_CHOICES[(this.currentChamberIdx * 2) % BOON_CHOICES.length];
    const b2 = BOON_CHOICES[(this.currentChamberIdx * 2 + 1) % BOON_CHOICES.length];

    const leftGate = ModelFactory.createExitGate(b1.color);
    leftGate.position.set(-4.2, 0, -ch.arenaRadius + 2.5);
    this.scene.add(leftGate);

    const rightGate = ModelFactory.createExitGate(b2.color);
    rightGate.position.set(4.2, 0, -ch.arenaRadius + 2.5);
    this.scene.add(rightGate);

    s.exitGates.push(
      {
        mesh: leftGate,
        pos: leftGate.position,
        nextChamberIdx: nextIdx === 0 ? 1 : nextIdx,
        boon: b1,
        label: `${b1.icon} ${b1.name}`
      },
      {
        mesh: rightGate,
        pos: rightGate.position,
        nextChamberIdx: nextIdx === 0 ? 1 : nextIdx,
        boon: b2,
        label: `${b2.icon} ${b2.name}`
      }
    );

    this.spawnFloatingText(new THREE.Vector3(0, 1, -ch.arenaRadius + 3), '✨ CHAMBER CLEARED! WALK THROUGH A BOON GATE', '#fbbf24');
    this.updateHUD();
  }

  setupLightingAndSky() {
    const ambient = new THREE.AmbientLight(0x263248, 1.55);
    this.scene.add(ambient);

    this.sunLight = new THREE.DirectionalLight(0xffb74d, 3.2);
    this.sunLight.position.set(18, 34, -22);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    const d = 26;
    this.sunLight.shadow.camera.left = -d;
    this.sunLight.shadow.camera.right = d;
    this.sunLight.shadow.camera.top = d;
    this.sunLight.shadow.camera.bottom = -d;
    this.scene.add(this.sunLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    rimLight.position.set(-20, 16, 18);
    this.scene.add(rimLight);

    this.sunUniforms = {
      uTime: { value: 0 },
      uHeat: { value: 0.15 }
    };
    const sunMat = new THREE.ShaderMaterial({
      vertexShader: SHADERS.sunVertex,
      fragmentShader: SHADERS.sunFragment,
      uniforms: this.sunUniforms
    });
    this.sunMesh = new THREE.Mesh(new THREE.SphereGeometry(4.8, 40, 40), sunMat);
    this.sunMesh.position.set(14, 24, -30);
    this.scene.add(this.sunMesh);

    const ringMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, wireframe: true, transparent: true, opacity: 0.32 });
    this.sunRing1 = new THREE.Mesh(new THREE.TorusGeometry(7.2, 0.07, 8, 56), ringMat);
    this.sunRing2 = new THREE.Mesh(new THREE.TorusGeometry(9.2, 0.05, 8, 56), ringMat);
    this.sunMesh.add(this.sunRing1, this.sunRing2);
  }

  setupAlchemicalFloor(ch) {
    this.chemData = new Uint8Array(CHEM_SIZE * CHEM_SIZE * 4);
    this.chemTexture = new THREE.DataTexture(this.chemData, CHEM_SIZE, CHEM_SIZE, THREE.RGBAFormat);
    this.chemTexture.wrapS = THREE.ClampToEdgeWrapping;
    this.chemTexture.wrapT = THREE.ClampToEdgeWrapping;
    this.chemTexture.magFilter = THREE.LinearFilter;
    this.chemTexture.minFilter = THREE.LinearFilter;

    if (ch.alchemyPools) {
      for (const pool of ch.alchemyPools) {
        this.paintAlchemyDisc(pool.x, pool.z, pool.radius, pool.matId);
      }
    }

    this.floorUniforms = {
      uChemTex: { value: this.chemTexture },
      uTime: { value: 0 },
      uPulsePhase: { value: 0 }
    };

    const floorGeo = new THREE.PlaneGeometry(WORLD_SPAN, WORLD_SPAN, 80, 80);
    floorGeo.rotateX(-Math.PI / 2);
    const floorMat = new THREE.ShaderMaterial({
      vertexShader: SHADERS.floorVertex,
      fragmentShader: SHADERS.floorFragment,
      uniforms: this.floorUniforms
    });

    this.floorMesh = new THREE.Mesh(floorGeo, floorMat);
    this.floorMesh.receiveShadow = true;
    this.scene.add(this.floorMesh);
  }

  worldToChemCoord(wx, wz) {
    const u = (wx + WORLD_SPAN / 2) / WORLD_SPAN;
    const v = 1.0 - (wz + WORLD_SPAN / 2) / WORLD_SPAN;
    const cx = Math.floor(Math.max(0, Math.min(CHEM_SIZE - 1, u * CHEM_SIZE)));
    const cy = Math.floor(Math.max(0, Math.min(CHEM_SIZE - 1, v * CHEM_SIZE)));
    return { cx, cy };
  }

  paintAlchemyDisc(wx, wz, radius, matId) {
    const { cx, cy } = this.worldToChemCoord(wx, wz);
    const rCells = Math.ceil((radius / WORLD_SPAN) * CHEM_SIZE);
    for (let dy = -rCells; dy <= rCells; dy++) {
      for (let dx = -rCells; dx <= rCells; dx++) {
        if (dx * dx + dy * dy > rCells * rCells) continue;
        const x = cx + dx;
        const y = cy + dy;
        if (x < 0 || x >= CHEM_SIZE || y < 0 || y >= CHEM_SIZE) continue;
        const idx = (y * CHEM_SIZE + x) * 4;
        this.chemData[idx] = Math.round((matId / 10) * 255);
        this.chemData[idx + 1] = 235;
        this.chemData[idx + 2] = 0;
        this.chemData[idx + 3] = 255;
      }
    }
    this.chemTexture.needsUpdate = true;
  }

  getAlchemyAtWorld(wx, wz) {
    const { cx, cy } = this.worldToChemCoord(wx, wz);
    const idx = (cy * CHEM_SIZE + cx) * 4;
    return Math.round((this.chemData[idx] / 255) * 10);
  }

  stepAlchemicalSimulation() {
    for (let y = 1; y < CHEM_SIZE - 1; y++) {
      for (let x = 1; x < CHEM_SIZE - 1; x++) {
        const idx = (y * CHEM_SIZE + x) * 4;
        const mat = Math.round((this.chemData[idx] / 255) * 10);
        if (mat === 0) continue;

        if (mat === 1) {
          if (this.chemData[idx + 1] > 6) {
            this.chemData[idx + 1] -= 3;
          } else {
            this.chemData[idx] = 0;
            continue;
          }
          const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
          const [dx, dy] = dirs[Math.floor(Math.random() * 4)];
          const nIdx = ((y + dy) * CHEM_SIZE + (x + dx)) * 4;
          const nMat = Math.round((this.chemData[nIdx] / 255) * 10);
          if (nMat === 3) {
            this.chemData[idx] = 0;
          } else if (nMat === 4) {
            this.chemData[nIdx] = Math.round((1 / 10) * 255);
            this.chemData[nIdx + 1] = 245;
          }
        }
      }
    }
    this.chemTexture.needsUpdate = true;
  }

  setupHeroAndOrbitalBlades() {
    const prevOrbitals = this.hero ? this.hero.orbitalCount : 2;
    this.heroMesh = ModelFactory.createVesperHero();
    this.scene.add(this.heroMesh);

    this.hero = {
      pos: this.heroMesh.position,
      vel: new THREE.Vector3(),
      facingAngle: Math.PI,
      orbitalCount: prevOrbitals,
      orbitalMeshes: []
    };

    this.rebuildOrbitalBlades();
  }

  rebuildOrbitalBlades() {
    const orbGroup = this.heroMesh.userData.orbitalGroup;
    while (orbGroup.children.length > 0) orbGroup.remove(orbGroup.children[0]);
    this.hero.orbitalMeshes = [];

    const bladeGeo = new THREE.OctahedronGeometry(0.26, 0);
    bladeGeo.scale(0.5, 2.2, 0.25);
    const bladeMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 1.8,
      metalness: 0.9,
      roughness: 0.1
    });

    for (let i = 0; i < this.hero.orbitalCount; i++) {
      const m = new THREE.Mesh(bladeGeo, bladeMat);
      orbGroup.add(m);
      this.hero.orbitalMeshes.push(m);
    }
  }

  spawnPillar(x, z) {
    const mesh = ModelFactory.createCathedralPillar();
    mesh.position.set(x, 0, z);
    this.scene.add(mesh);
    const pillar = { id: Math.random(), mesh, x, z, radius: 1.05 };
    this.state.pillars.push(pillar);
    return pillar;
  }

  spawnMonolith(word, category, x, z) {
    const mesh = ModelFactory.createAxiomMonolith(word, category);
    mesh.position.set(x, 0, z);
    this.scene.add(mesh);
    const mono = {
      id: Math.random(),
      word,
      category,
      mesh,
      pos: mesh.position,
      radius: 0.95
    };
    this.state.monoliths.push(mono);
    return mono;
  }

  spawnWarden(x, z, name, variant = 0, hp = 85) {
    const mesh = ModelFactory.createWardenEnemy(variant);
    mesh.position.set(x, 0, z);
    this.scene.add(mesh);

    const lineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(x, 1.4, z),
      new THREE.Vector3(x, 0.2, z + 5)
    ]);
    const lineMat = new THREE.LineDashedMaterial({ color: 0xf43f5e, dashSize: 0.5, gapSize: 0.3 });
    const telegraphLine = new THREE.Line(lineGeo, lineMat);
    telegraphLine.computeLineDistances();
    this.scene.add(telegraphLine);

    const targetRing = new THREE.Mesh(
      new THREE.RingGeometry(0.65, 0.9, 24),
      new THREE.MeshBasicMaterial({ color: 0xf43f5e, side: THREE.DoubleSide, transparent: true, opacity: 0.75 })
    );
    targetRing.rotation.x = -Math.PI / 2;
    targetRing.position.set(x, 0.06, z + 5);
    this.scene.add(targetRing);

    const warden = {
      id: Math.random(),
      name,
      mesh,
      pos: mesh.position,
      hp,
      maxHp: hp,
      isThrall: false,
      radius: 0.9,
      telegraphOrigin: new THREE.Vector3(x, 0, z),
      telegraphTarget: new THREE.Vector3(x, 0, z + 4),
      telegraphTimer: 4.0 + Math.random() * 1.5,
      telegraphLine,
      targetRing
    };
    this.state.wardens.push(warden);
    return warden;
  }

  spawnAstralSphere(x, z, vx, vz) {
    const geo = new THREE.SphereGeometry(0.45, 18, 18);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 2.0,
      metalness: 0.9,
      roughness: 0.1
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, 0.55, z);
    this.scene.add(mesh);

    this.state.astralSpheres.push({
      mesh,
      pos: mesh.position,
      vx,
      vz,
      bouncesLeft: 14,
      bounceCount: 0
    });
  }

  setupLassoMesh() {
    const geo = new THREE.BufferGeometry();
    const mat = new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 3 });
    this.lassoLine = new THREE.Line(geo, mat);
    this.lassoLine.position.y = 0.15;
    this.scene.add(this.lassoLine);
  }

  // ==========================================================================
  // 3D RUNIC MONOLITH ALIGNMENT (No popups—immediate physical transformation!)
  // ==========================================================================
  evaluateAxiomMonoliths() {
    const subjects = this.state.monoliths.filter(m => m.category === 'SUBJECT');
    const verbs = this.state.monoliths.filter(m => m.category === 'VERB');
    const effects = this.state.monoliths.filter(m => m.category === 'EFFECT');

    const newAxioms = [];
    const axiomMap = {};

    for (const sub of subjects) {
      for (const verb of verbs) {
        if (sub.pos.distanceTo(verb.pos) > 3.6) continue;
        const dir1 = new THREE.Vector3().subVectors(verb.pos, sub.pos).normalize();

        for (const eff of effects) {
          if (verb.pos.distanceTo(eff.pos) > 3.6) continue;
          const dir2 = new THREE.Vector3().subVectors(eff.pos, verb.pos).normalize();
          if (dir1.dot(dir2) > 0.7) {
            const phrase = `${sub.word} ${verb.word} ${eff.word}`;
            newAxioms.push({ subject: sub.word, verb: verb.word, effect: eff.word, phrase });
            if (!axiomMap[sub.word]) axiomMap[sub.word] = new Set();
            axiomMap[sub.word].add(eff.word);
          }
        }
      }
    }

    const prevCount = this.state.activeAxioms.length;
    this.state.activeAxioms = newAxioms;
    this.state.axiomMap = axiomMap;

    if (newAxioms.length > prevCount) {
      this.sfx.playAxiomShift();
    }

    if (axiomMap['WARDEN']?.has('GOLD') && this.state.wardens.length > 0) {
      for (let i = this.state.wardens.length - 1; i >= 0; i--) {
        const w = this.state.wardens[i];
        this.paintAlchemyDisc(w.pos.x, w.pos.z, 2.5, 5);
        this.state.essence += 150;
        this.spawnFloatingText(w.pos, '☉ AXIOM FULFILLED: [WARDEN IS GOLD]!', '#fbbf24');
        this.removeWarden(i);
      }
      this.showBannerNotification('Axiom Law Enacted: [WARDEN IS GOLD]', 'All Seraph Wardens in the chamber were transmuted into solid gold!', '#fbbf24');
    }
  }

  // ==========================================================================
  // INTERACT WITH HOUSE OF ASH NPCS ([E])
  // ==========================================================================
  interactNearestNPC() {
    let closest = null;
    let minDist = 4.2;
    for (const npc of this.state.npcs) {
      const d = npc.pos.distanceTo(this.hero.pos);
      if (d < minDist) {
        minDist = d;
        closest = npc;
      }
    }
    if (!closest) return;

    this.sfx.playArcanaChord();
    const quote = closest.greetings[closest.quoteIdx % closest.greetings.length];
    closest.quoteIdx++;
    this.showNPCDialogue(closest.name, closest.title, quote, closest.color);
  }

  showNPCDialogue(name, title, quote, colorHex = '#fbbf24') {
    const banner = document.getElementById('npc-voice-banner');
    if (!banner) return;
    banner.style.borderColor = colorHex;
    banner.innerHTML = `
      <div class="npc-banner-header">
        <span class="npc-banner-name" style="color:${colorHex}">${name}</span>
        <span class="npc-banner-title">· ${title}</span>
      </div>
      <div class="npc-banner-quote">${quote}</div>
    `;
    banner.classList.remove('hidden');
    clearTimeout(this.npcBannerTimeout);
    this.npcBannerTimeout = setTimeout(() => {
      banner.classList.add('hidden');
    }, 8500);
  }

  showBannerNotification(title, subtitle, colorHex = '#fbbf24') {
    const banner = document.getElementById('boon-toast-banner');
    if (!banner) return;
    banner.style.borderColor = colorHex;
    banner.innerHTML = `
      <div class="boon-toast-title" style="color:${colorHex}">✨ ${title}</div>
      <div class="boon-toast-desc">${subtitle}</div>
    `;
    banner.classList.remove('hidden');
    clearTimeout(this.boonBannerTimeout);
    this.boonBannerTimeout = setTimeout(() => {
      banner.classList.add('hidden');
    }, 6500);
  }

  // ==========================================================================
  // PLAYER COMBAT, BIOME II, BIOME III & BIOME IV MECHANICS
  // ==========================================================================
  castConduitSpell(targetPoint) {
    this.sfx.playCastBolt(540);

    const dx = targetPoint.x - this.hero.pos.x;
    const dz = targetPoint.z - this.hero.pos.z;
    this.hero.facingAngle = Math.atan2(dx, dz);
    this.heroMesh.rotation.y = this.hero.facingAngle;

    const splitCount = 1 + this.state.bonusSplitCount + (this.anatomy.hasGraft('Bifurcated') ? 1 : 0);
    const speed = 22;

    for (let i = 0; i < splitCount; i++) {
      const spread = splitCount > 1 ? (i - (splitCount - 1) / 2) * 0.2 : 0;
      const ang = this.hero.facingAngle + spread;

      const geo = new THREE.SphereGeometry(0.26, 12, 12);
      const mat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(this.hero.pos.x, 1.3, this.hero.pos.z);
      this.scene.add(mesh);

      this.state.projectiles.push({
        mesh,
        pos: mesh.position,
        vx: Math.sin(ang) * speed,
        vz: Math.cos(ang) * speed,
        dmg: 28 + this.state.bonusSplitCount * 8,
        boostedBySigil: false,
        teleportedByPortal: false,
        life: 1.8
      });
    }

    for (const twin of this.state.phantomTwins) {
      const tAng = Math.atan2(targetPoint.x - twin.pos.x, targetPoint.z - twin.pos.z);
      twin.mesh.rotation.y = tAng;
      const geo = new THREE.SphereGeometry(0.24, 10, 10);
      const mat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(twin.pos.x, 1.3, twin.pos.z);
      this.scene.add(mesh);
      this.state.projectiles.push({
        mesh,
        pos: mesh.position,
        vx: Math.sin(tAng) * speed,
        vz: Math.cos(tAng) * speed,
        dmg: 24,
        boostedBySigil: false,
        teleportedByPortal: false,
        life: 1.8
      });
    }

    this.spikeTimeDilation(1.0, 0.28);
  }

  // BIOME II MECHANIC 1: 3D AETHER GRAPPLE-HOOK ([G])
  fireAetherGrapple() {
    this.meta.unlockedAbilities.add('AETHER_GRAPPLE');
    this.sfx.playCastBolt(860);
    this.spikeTimeDilation(1.0, 0.35);

    const target = this.aimWorldPoint.clone();
    const s = this.state;

    for (const m of s.monoliths) {
      if (m.pos.distanceTo(target) < 3.6) {
        this.drawGrappleChainEffect(this.hero.pos, m.pos, 0xfbbf24);
        const pullDir = new THREE.Vector3().subVectors(this.hero.pos, m.pos).normalize();
        m.pos.addScaledVector(pullDir, Math.min(5.5, m.pos.distanceTo(this.hero.pos) - 2.0));
        this.spawnFloatingText(m.pos, `⛓️ GRAPPLE YANK [${m.word}]!`, '#fbbf24');
        this.evaluateAxiomMonoliths();
        this.updateHUD();
        return;
      }
    }

    let zipDest = target.clone();
    for (const anchor of s.grappleAnchors) {
      if (anchor.pos.distanceTo(target) < 4.5) {
        zipDest.copy(anchor.pos);
        break;
      }
    }
    for (const w of s.wardens) {
      if (w.pos.distanceTo(target) < 3.8) {
        zipDest.copy(w.pos);
        break;
      }
    }

    const limit = CHAMBERS[this.currentChamberIdx].arenaRadius - 1.5;
    zipDest.x = Math.max(-limit, Math.min(limit, zipDest.x));
    zipDest.z = Math.max(-limit, Math.min(limit, zipDest.z));

    this.drawGrappleChainEffect(this.hero.pos.clone(), zipDest, 0x38bdf8);
    this.hero.pos.set(zipDest.x, 0, zipDest.z);
    this.paintAlchemyDisc(zipDest.x, zipDest.z, 2.2, 3);

    for (let i = s.wardens.length - 1; i >= 0; i--) {
      const w = s.wardens[i];
      if (!w.isThrall && w.pos.distanceTo(this.hero.pos) < 3.8) {
        w.hp -= 42;
        this.spawnFloatingText(w.pos, '⛓️ GRAPPLE SLAM! -42', '#38bdf8');
        if (w.hp <= 0) this.removeWarden(i);
      }
    }
    this.updateHUD();
  }

  drawGrappleChainEffect(fromPos, toPos, colorHex = 0x38bdf8) {
    const pts = [
      new THREE.Vector3(fromPos.x, 1.25, fromPos.z),
      new THREE.Vector3(toPos.x, 1.25, toPos.z)
    ];
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.LineBasicMaterial({ color: colorHex, linewidth: 3 });
    const line = new THREE.Line(geo, mat);
    this.scene.add(line);
    setTimeout(() => this.scene.remove(line), 240);
  }

  // BIOME II MECHANIC 2: 3D SOLAR AEGIS PARRY & POSTURE DEATHBLOW ([C])
  triggerSolarAegisParry() {
    this.meta.unlockedAbilities.add('SOLAR_PARRY');
    this.sfx.playArcanaChord();
    this.state.parryTimer = 0.65;
    this.heroMesh.userData.aegisMat.opacity = 0.85;
    this.spikeTimeDilation(1.0, 0.35);

    let parriedCount = 0;
    for (let i = this.state.wardens.length - 1; i >= 0; i--) {
      const w = this.state.wardens[i];
      if (!w.isThrall && (w.telegraphTimer < 2.2 || w.pos.distanceTo(this.hero.pos) < 6.0)) {
        parriedCount++;
        this.drawGrappleChainEffect(this.hero.pos, w.pos, 0xfbbf24);
        w.hp -= 90;
        w.telegraphTimer = 4.5;
        this.paintAlchemyDisc(w.pos.x, w.pos.z, 2.4, 5);
        this.spawnFloatingText(w.pos, '🛡️ SOLAR DEATHBLOW! -90', '#fbbf24');
        if (w.hp <= 0) {
          this.removeWarden(i);
        }
      }
    }

    if (parriedCount > 0) {
      this.state.essence += parriedCount * 60;
    } else {
      this.spawnFloatingText(this.hero.pos, '🛡️ SOLAR AEGIS RAISED!', '#fbbf24');
    }
    this.updateHUD();
  }

  // BIOME II MECHANIC 3: 3D PHANTOM TIME-ECHO TWIN ([T])
  summonPhantomEchoTwin() {
    this.meta.unlockedAbilities.add('PHANTOM_ECHO');
    this.sfx.playAxiomShift();

    if (this.state.phantomTwins.length >= 2) {
      const oldest = this.state.phantomTwins.shift();
      this.scene.remove(oldest.mesh);
    }

    const twinMesh = ModelFactory.createPhantomTwin();
    twinMesh.position.set(this.hero.pos.x + 2.2, 0, this.hero.pos.z);
    this.scene.add(twinMesh);

    this.state.phantomTwins.push({
      mesh: twinMesh,
      pos: twinMesh.position,
      orbitAngle: Math.random() * Math.PI * 2,
      fireCooldown: 0.9,
      life: 18.0
    });

    this.spawnFloatingText(twinMesh.position, '👥 PHANTOM TIME-ECHO SUMMONED!', '#38bdf8');
    this.updateHUD();
  }

  // BIOME III MECHANIC 1: SUBTERRANEAN ABYSSAL BURROW & GEODE ERUPTION ([X])
  toggleAbyssalBurrow() {
    this.meta.unlockedAbilities.add('ABYSSAL_BURROW');
    const s = this.state;

    if (s.burrowTimer > 0) {
      this.eruptFromAbyssalBurrow();
      return;
    }

    this.sfx.playHammerSmash();
    s.burrowTimer = 1.65;
    this.heroMesh.position.y = -1.55;
    this.paintAlchemyDisc(this.hero.pos.x, this.hero.pos.z, 2.0, 4); // Mycelium entry rift
    this.spawnFloatingText(this.hero.pos, '💎 SUBTERRANEAN BURROW!', '#c084fc');
    this.spikeTimeDilation(1.0, 0.35);
    this.updateHUD();
  }

  eruptFromAbyssalBurrow() {
    const s = this.state;
    s.burrowTimer = 0;
    this.heroMesh.position.y = 0;
    this.sfx.playHammerSmash();
    this.spikeTimeDilation(1.0, 0.38);

    const geode = ModelFactory.createGeodeEruption();
    geode.position.set(this.hero.pos.x, 0, this.hero.pos.z);
    if (s.geodeBurrowBonus) {
      geode.scale.set(1.5, 1.5, 1.5);
      s.hp = Math.min(s.maxHp, s.hp + 15);
    }
    this.scene.add(geode);
    setTimeout(() => this.scene.remove(geode), 950);

    const radius = s.geodeBurrowBonus ? 5.8 : 4.4;
    this.paintAlchemyDisc(this.hero.pos.x, this.hero.pos.z, 2.8, 4);

    // Shatter stone pillars from below!
    for (let i = s.pillars.length - 1; i >= 0; i--) {
      const p = s.pillars[i];
      if (Math.hypot(p.x - this.hero.pos.x, p.z - this.hero.pos.z) < radius) {
        this.scene.remove(p.mesh);
        s.pillars.splice(i, 1);
        this.paintAlchemyDisc(p.x, p.z, 2.0, 5);
      }
    }

    // Launch & damage nearby Wardens!
    for (let i = s.wardens.length - 1; i >= 0; i--) {
      const w = s.wardens[i];
      if (!w.isThrall && w.pos.distanceTo(this.hero.pos) < radius) {
        w.hp -= 68;
        this.spawnFloatingText(w.pos, '💎 GEODE ERUPTION! -68', '#c084fc');
        if (w.hp <= 0) this.removeWarden(i);
      }
    }
    this.updateHUD();
  }

  // BIOME III MECHANIC 2: 3D ASTRAL POLYOMINO SIGIL-TECTONICS ([Z])
  stampPolyominoSigil() {
    this.meta.unlockedAbilities.add('POLYOMINO_SIGILS');
    this.sfx.playArcanaChord();
    this.spikeTimeDilation(1.0, 0.32);

    const s = this.state;
    if (s.polyominoSigils.length >= 4) {
      const oldest = s.polyominoSigils.shift();
      this.scene.remove(oldest.mesh);
    }

    const baseCells = POLYOMINO_SHAPES[s.polyominoShapeIdx % POLYOMINO_SHAPES.length];
    s.polyominoShapeIdx++;
    const cells = s.polyominoBonus ? [...baseCells, [1, 1]] : baseCells;

    const sigilGroup = ModelFactory.createPolyominoSigilGroup(cells);
    const center = this.aimWorldPoint.clone();
    sigilGroup.position.set(center.x, 0, center.z);
    this.scene.add(sigilGroup);

    const worldCells = cells.map(([cx, cz]) => new THREE.Vector3(center.x + cx * 2.1, 0, center.z + cz * 2.1));
    s.polyominoSigils.push({
      mesh: sigilGroup,
      center,
      worldCells,
      life: 16.0
    });

    // Magnetically slide any Runic Monolith resting on or near the Polyomino Sigil toward the [IS] Verb Monolith!
    const verbMono = s.monoliths.find(m => m.category === 'VERB');
    if (verbMono) {
      for (const m of s.monoliths) {
        if (m.category === 'EFFECT' && m.pos.distanceTo(center) < 4.5) {
          const targetSlot = new THREE.Vector3(verbMono.pos.x + 2.2, 0, verbMono.pos.z);
          m.pos.lerp(targetSlot, 0.65);
          this.spawnFloatingText(m.pos, `❖ SIGIL TECTONIC SLIDE [${m.word}]!`, '#38bdf8');
          this.evaluateAxiomMonoliths();
        }
      }
    }

    this.spawnFloatingText(center, '❖ ASTRAL POLYOMINO STAMPED!', '#38bdf8');
    this.updateHUD();
  }

  // BIOME III MECHANIC 3: ETHEREAL CROWN-PROJECTION & THRALL POSSESSION ([V])
  projectAstralCrown() {
    this.meta.unlockedAbilities.add('CROWN_POSSESSION');
    this.sfx.playAxiomShift();
    this.spikeTimeDilation(1.0, 0.35);

    const s = this.state;
    const target = this.aimWorldPoint.clone();

    const crownOrb = ModelFactory.createAstralCrownOrb();
    crownOrb.position.set(target.x, 2.2, target.z);
    this.scene.add(crownOrb);
    setTimeout(() => this.scene.remove(crownOrb), 900);

    // 1. Check if aimed near an enemy Warden -> Possess as an allied Astral Thrall!
    for (let i = 0; i < s.wardens.length; i++) {
      const w = s.wardens[i];
      if (!w.isThrall && w.pos.distanceTo(target) < 4.2) {
        w.isThrall = true;
        if (w.mesh.userData.coreMat) {
          w.mesh.userData.coreMat.color.setHex(0x38bdf8);
          w.mesh.userData.coreMat.emissive.setHex(0x0284c7);
        }
        this.scene.remove(w.telegraphLine);
        this.scene.remove(w.targetRing);
        this.spawnFloatingText(w.pos, '👑 CROWN POSSESSED: ASTRAL THRALL!', '#38bdf8');
        s.essence += 75;
        this.checkAllHostileWardensCleared();
        this.updateHUD();
        return;
      }
    }

    // 2. Otherwise check if aimed near a Cathedral Pillar -> Uproot and hurl it into the nearest hostile Warden!
    for (let i = s.pillars.length - 1; i >= 0; i--) {
      const p = s.pillars[i];
      if (Math.hypot(p.x - target.x, p.z - target.z) < 4.2) {
        const hostileIdx = s.wardens.findIndex(w => !w.isThrall);
        this.scene.remove(p.mesh);
        s.pillars.splice(i, 1);

        if (hostileIdx !== -1) {
          const w = s.wardens[hostileIdx];
          this.drawGrappleChainEffect(new THREE.Vector3(p.x, 1.5, p.z), w.pos, 0xfbbf24);
          w.hp -= 85;
          this.paintAlchemyDisc(w.pos.x, w.pos.z, 2.4, 5);
          this.spawnFloatingText(w.pos, '🏛️ POSSESSED PILLAR SLAM! -85', '#fbbf24');
          if (w.hp <= 0) this.removeWarden(hostileIdx);
        } else {
          this.paintAlchemyDisc(p.x, p.z, 2.2, 5);
          this.spawnFloatingText(target, '🏛️ PILLAR UPROOTED!', '#fbbf24');
        }
        this.updateHUD();
        return;
      }
    }

    this.spawnFloatingText(target, '👑 ASTRAL CROWN PROJECTED!', '#fde68a');
    this.updateHUD();
  }

  // NEW BIOME IV MECHANIC 1: LINKED 3D RIFT-PORTAL GATEWAYS & PRISMATIC REFRACTION ([P])
  deployRiftPortals() {
    this.meta.unlockedAbilities.add('RIFT_PORTALS');
    this.sfx.playAxiomShift();
    this.spikeTimeDilation(1.0, 0.35);

    const s = this.state;
    for (const p of s.riftPortals) {
      this.scene.remove(p.mesh);
    }
    s.riftPortals = [];

    const limit = CHAMBERS[this.currentChamberIdx].arenaRadius - 2.0;
    const entryPos = new THREE.Vector3(
      Math.max(-limit, Math.min(limit, this.hero.pos.x + Math.sin(this.hero.facingAngle) * 2.4)),
      0,
      Math.max(-limit, Math.min(limit, this.hero.pos.z + Math.cos(this.hero.facingAngle) * 2.4))
    );
    const exitPos = new THREE.Vector3(
      Math.max(-limit, Math.min(limit, this.aimWorldPoint.x)),
      0,
      Math.max(-limit, Math.min(limit, this.aimWorldPoint.z))
    );

    const solarPortalMesh = ModelFactory.createRiftPortalArch(0xf59e0b);
    solarPortalMesh.position.copy(entryPos);
    this.scene.add(solarPortalMesh);

    const aetherPortalMesh = ModelFactory.createRiftPortalArch(0x38bdf8);
    aetherPortalMesh.position.copy(exitPos);
    this.scene.add(aetherPortalMesh);

    s.riftPortals.push(
      { mesh: solarPortalMesh, pos: solarPortalMesh.position, color: 0xf59e0b, pairIdx: 1 },
      { mesh: aetherPortalMesh, pos: aetherPortalMesh.position, color: 0x38bdf8, pairIdx: 0 }
    );
    s.portalCooldown = 0.45;

    // Immediately teleport any EFFECT Runic Monolith near the Exit or Entry portal to its twin!
    for (const m of s.monoliths) {
      if (m.category === 'EFFECT' && m.pos.distanceTo(exitPos) < 2.8) {
        m.pos.set(entryPos.x + 1.4, 0, entryPos.z);
        this.spawnFloatingText(m.pos, `🌀 PORTAL WARPED [${m.word}]!`, '#38bdf8');
        this.evaluateAxiomMonoliths();
      }
    }

    this.drawGrappleChainEffect(entryPos, exitPos, 0x38bdf8);
    this.spawnFloatingText(exitPos, '🌀 LINKED RIFT-PORTALS OPENED!', '#38bdf8');
    this.updateHUD();
  }

  // NEW BIOME IV MECHANIC 2: 3D BLACK-SUN GRAVITY SINGULARITY WELL ([N])
  spawnGravitySingularity() {
    this.meta.unlockedAbilities.add('GRAVITY_SINGULARITY');
    this.sfx.playHammerSmash();
    this.spikeTimeDilation(1.0, 0.36);

    const s = this.state;
    if (s.singularities.length >= 2) {
      const oldest = s.singularities.shift();
      this.scene.remove(oldest.mesh);
    }

    const limit = CHAMBERS[this.currentChamberIdx].arenaRadius - 2.0;
    const pos = new THREE.Vector3(
      Math.max(-limit, Math.min(limit, this.aimWorldPoint.x)),
      0,
      Math.max(-limit, Math.min(limit, this.aimWorldPoint.z))
    );

    const wellMesh = ModelFactory.createGravitySingularity();
    wellMesh.position.copy(pos);
    this.scene.add(wellMesh);

    s.singularities.push({
      mesh: wellMesh,
      pos: wellMesh.position,
      life: 6.5
    });

    this.spawnFloatingText(pos, '🕳️ BLACK-SUN SINGULARITY WELL!', '#c084fc');
    this.updateHUD();
  }

  // NEW BIOME IV MECHANIC 3: 120 BPM HARMONIC ECLIPSE CADENCE & OMNIVERSAL RESONANCE ([M])
  triggerHarmonicCadence() {
    this.meta.unlockedAbilities.add('HARMONIC_CADENCE');
    this.sfx.playArcanaChord();
    this.spikeTimeDilation(1.0, 0.42);

    const s = this.state;
    const beatPhase = (s.time * 2.0) % 1.0; // 120 BPM = 2 beats per second
    const isOnBeat = beatPhase < 0.28 || beatPhase > 0.72;
    const dmg = isOnBeat ? 82 : 52;

    // Gather allOmniversal Resonance Epicenters: Vesper + Phantom Twins + Possessed Thralls + Rift Portals + Singularities + Polyomino Sigils!
    const epicenters = [
      { pos: this.hero.pos.clone(), color: 0xfde68a, label: isOnBeat ? '🎵 PERFECT 120 BPM CADENCE!' : '🎵 HARMONIC PULSE!' }
    ];
    for (const twin of s.phantomTwins) {
      epicenters.push({ pos: twin.pos.clone(), color: 0x38bdf8, label: '🎵 TWIN RESONANCE!' });
    }
    for (const w of s.wardens) {
      if (w.isThrall) epicenters.push({ pos: w.pos.clone(), color: 0x38bdf8, label: '🎵 THRALL CADENCE!' });
    }
    for (const p of s.riftPortals) {
      epicenters.push({ pos: p.pos.clone(), color: p.color, label: '🎵 PORTAL RESONANCE!' });
    }
    for (const well of s.singularities) {
      epicenters.push({ pos: well.pos.clone(), color: 0xc084fc, label: '🎵 SINGULARITY PULSE!' });
    }
    for (const sigil of s.polyominoSigils) {
      epicenters.push({ pos: sigil.center.clone(), color: 0x38bdf8, label: '🎵 SIGIL HARMONIC!' });
    }

    for (const ep of epicenters) {
      const ringGeo = new THREE.RingGeometry(0.6, 5.2, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color: ep.color, side: THREE.DoubleSide, transparent: true, opacity: 0.85 });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = -Math.PI / 2;
      ringMesh.position.set(ep.pos.x, 0.14, ep.pos.z);
      this.scene.add(ringMesh);
      setTimeout(() => this.scene.remove(ringMesh), 320);

      for (let i = s.wardens.length - 1; i >= 0; i--) {
        const w = s.wardens[i];
        if (!w.isThrall && w.pos.distanceTo(ep.pos) < 5.4) {
          w.hp -= dmg;
          this.paintAlchemyDisc(w.pos.x, w.pos.z, 2.0, 5);
          this.spawnFloatingText(w.pos, `${ep.label} -${dmg}`, '#fde68a');
          if (w.hp <= 0) this.removeWarden(i);
        }
      }
    }

    s.essence += epicenters.length * 35;
    this.spawnFloatingText(this.hero.pos, `${isOnBeat ? '🎵 PERFECT CADENCE' : '🎵 HARMONIC NOVA'} (${epicenters.length}x NODES)!`, '#fde68a');
    this.updateHUD();
  }

  checkAllHostileWardensCleared() {
    const hostiles = this.state.wardens.filter(w => !w.isThrall);
    if (hostiles.length === 0 && this.currentChamberIdx > 0) {
      this.spawnChamberExitGates(CHAMBERS[this.currentChamberIdx]);
    }
  }

  swingMemorySledgehammer() {
    if (!this.hasAbility('SLEDGEHAMMER') && this.currentChamberIdx < 2) {
      this.meta.unlockedAbilities.add('SLEDGEHAMMER');
    }
    this.sfx.playHammerSmash();
    this.heroMesh.userData.swingTimer = 0.45;
    this.spikeTimeDilation(1.0, 0.35);

    if (this.state.sledgeSpawnsOrbs || this.psyche.isThoughtInternalized('THOUGHT_GLASS_ANATOMY')) {
      this.spawnAstralSphere(this.hero.pos.x, this.hero.pos.z, 12, -10);
      this.spawnAstralSphere(this.hero.pos.x, this.hero.pos.z, -12, 10);
    }

    const ringGeo = new THREE.RingGeometry(0.5, 4.8, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide, transparent: true, opacity: 0.85 });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.set(this.hero.pos.x, 0.12, this.hero.pos.z);
    this.scene.add(ringMesh);
    setTimeout(() => this.scene.remove(ringMesh), 260);

    let shattered = 0;
    for (let i = this.state.pillars.length - 1; i >= 0; i--) {
      const p = this.state.pillars[i];
      if (Math.hypot(p.x - this.hero.pos.x, p.z - this.hero.pos.z) < 4.8) {
        this.scene.remove(p.mesh);
        this.state.pillars.splice(i, 1);
        this.paintAlchemyDisc(p.x, p.z, 2.0, 5);
        shattered++;
      }
    }

    for (let i = this.state.wardens.length - 1; i >= 0; i--) {
      const w = this.state.wardens[i];
      if (!w.isThrall && w.pos.distanceTo(this.hero.pos) < 5.0) {
        const pushDir = new THREE.Vector3().subVectors(w.pos, this.hero.pos).normalize();
        w.pos.addScaledVector(pushDir, 4.5);
        w.hp -= 45;
        shattered++;
        this.spawnFloatingText(w.pos, '🔨 SHATTERED! -45', '#38bdf8');
        if (w.hp <= 0) {
          this.removeWarden(i);
        }
      }
    }

    if (shattered > 0) {
      this.state.essence += shattered * 35;
    } else {
      this.spawnFloatingText(this.hero.pos, '🔨 SLEDGE SHOCKWAVE!', '#38bdf8');
    }
    this.updateHUD();
  }

  executeChronosPhaseDash() {
    const dir = new THREE.Vector3(
      (this.keys.d ? 1 : 0) - (this.keys.a ? 1 : 0),
      0,
      (this.keys.s ? 1 : 0) - (this.keys.w ? 1 : 0)
    );
    if (dir.lengthSq() === 0) {
      dir.set(Math.sin(this.hero.facingAngle), 0, Math.cos(this.hero.facingAngle));
    } else {
      dir.normalize();
    }

    this.sfx.playCastBolt(780);
    const startPos = this.hero.pos.clone();
    const limit = CHAMBERS[this.currentChamberIdx].arenaRadius - 1.5;
    this.hero.pos.addScaledVector(dir, 5.8);
    this.hero.pos.x = Math.max(-limit, Math.min(limit, this.hero.pos.x));
    this.hero.pos.z = Math.max(-limit, Math.min(limit, this.hero.pos.z));

    this.paintAlchemyDisc(startPos.x, startPos.z, 1.5, this.state.vitriolDash ? 2 : 3);
    if (this.state.vitriolDash) {
      this.state.hp = Math.min(this.state.maxHp, this.state.hp + 10);
    }

    for (let i = this.state.wardens.length - 1; i >= 0; i--) {
      const w = this.state.wardens[i];
      if (!w.isThrall && w.pos.distanceTo(this.hero.pos) < 3.4) {
        w.hp -= 35;
        this.spawnFloatingText(w.pos, '⚡ PHASE SLASH! -35', '#38bdf8');
        if (w.hp <= 0) {
          this.removeWarden(i);
        }
      }
    }

    this.spikeTimeDilation(1.0, 0.25);
  }

  completeAstralLasso() {
    const pts = this.state.lassoPoints;
    if (pts.length < 5) {
      this.state.lassoPoints = [];
      this.lassoLine.geometry.setFromPoints([]);
      return;
    }

    const insidePolygon = (tx, tz) => {
      let inside = false;
      for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
        const xi = pts[i].x, zi = pts[i].z;
        const xj = pts[j].x, zj = pts[j].z;
        const intersect = ((zi > tz) !== (zj > tz)) && (tx < (xj - xi) * (tz - zi) / (zj - zi + 0.0001) + xi);
        if (intersect) inside = !inside;
      }
      return inside;
    };

    let snared = 0;
    for (let i = this.state.wardens.length - 1; i >= 0; i--) {
      const w = this.state.wardens[i];
      if (!w.isThrall && insidePolygon(w.pos.x, w.pos.z)) {
        w.hp -= 60;
        snared++;
        this.spawnFloatingText(w.pos, '⭕ ASTRAL SNARE! -60', '#38bdf8');
        if (w.hp <= 0) {
          this.removeWarden(i);
        }
      }
    }

    for (const m of this.state.monoliths) {
      if (m.category === 'EFFECT' && insidePolygon(m.pos.x, m.pos.z)) {
        const pool = ['GOLD', 'ALLY', 'VOLATILE', 'RESONANT'];
        const nextWord = pool[(pool.indexOf(m.word) + 1) % pool.length];
        const pos = m.pos.clone();
        this.scene.remove(m.mesh);
        m.word = nextWord;
        m.mesh = ModelFactory.createAxiomMonolith(nextWord, 'EFFECT');
        m.mesh.position.copy(pos);
        this.scene.add(m.mesh);
        snared++;
        this.spawnFloatingText(pos, `⭕ RUNE SHIFT → [${nextWord}]`, '#c084fc');
      }
    }

    if (snared > 0) {
      this.sfx.playArcanaChord();
      this.state.essence += snared * 40;
      this.evaluateAxiomMonoliths();
    }

    this.state.lassoPoints = [];
    this.lassoLine.geometry.setFromPoints([]);
    this.updateHUD();
  }

  initTarotDeck() {
    this.state.deck = [];
    let id = 1;
    for (const suit of LORE.ARCANA_SUITS) {
      for (const r of LORE.ARCANA_RANKS) {
        this.state.deck.push({
          id: `ARCANA_${id++}`,
          suitId: suit.id,
          suitName: suit.name,
          symbol: suit.symbol,
          color: suit.color,
          elementMat: suit.elementMat,
          rank: r.rank,
          numeral: r.numeral,
          title: r.title,
          essence: r.essence,
          desc: suit.desc
        });
      }
    }
    this.state.hand = this.state.deck.slice(0, 4);
  }

  toggleCardSelection(cardId) {
    if (this.state.selectedCardIds.has(cardId)) {
      this.state.selectedCardIds.delete(cardId);
    } else {
      this.state.selectedCardIds.add(cardId);
    }
    this.invokeSelectedArcana();
  }

  invokeSelectedArcana() {
    if (this.state.hand.length === 0) this.initTarotDeck();
    const card = this.state.hand.pop();
    if (!card) return;

    this.sfx.playArcanaChord();
    this.paintAlchemyDisc(this.hero.pos.x, this.hero.pos.z, 3.8, card.elementMat);
    this.spawnAstralSphere(this.hero.pos.x, this.hero.pos.z, 13, -11);

    for (let i = this.state.wardens.length - 1; i >= 0; i--) {
      const w = this.state.wardens[i];
      if (!w.isThrall && w.pos.distanceTo(this.hero.pos) < 8.5) {
        w.hp -= 50;
        this.spawnFloatingText(w.pos, `✨ ${card.title.toUpperCase()}! -50`, card.color);
        if (w.hp <= 0) this.removeWarden(i);
      }
    }

    this.state.essence += 65;
    if (this.state.hand.length === 0) this.initTarotDeck();
    this.updateHUD();
  }

  removeWarden(index) {
    const w = this.state.wardens[index];
    if (!w) return;
    this.scene.remove(w.mesh);
    this.scene.remove(w.telegraphLine);
    this.scene.remove(w.targetRing);
    this.state.wardens.splice(index, 1);
    this.state.essence += 50;

    this.checkAllHostileWardensCleared();
    this.updateHUD();
  }

  toggleCodexDrawer() {
    this.codexOpen = !this.codexOpen;
    const drawer = document.getElementById('sanctum-codex-drawer');
    if (drawer) {
      drawer.classList.toggle('hidden', !this.codexOpen);
    }
    this.updateHUD();
  }

  switchGrimoireTab(tabId) {
    this.activeTab = tabId;
    this.updateHUD();
  }

  addChronicle(text) {
    this.state.chronicles.unshift({ id: Math.random(), text });
    if (this.state.chronicles.length > 8) this.state.chronicles.pop();
  }

  // ==========================================================================
  // INPUT BINDINGS
  // ==========================================================================
  bindInputs() {
    window.addEventListener('keydown', (e) => {
      if (this.state.onTitleScreen) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.dismissTitleScreen(this.currentChamberIdx);
        }
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        this.openTitleScreen();
        return;
      }

      const k = e.key.toLowerCase();
      if (k === 'w' || e.key === 'ArrowUp') this.keys.w = true;
      if (k === 's' || e.key === 'ArrowDown') this.keys.s = true;
      if (k === 'a' || e.key === 'ArrowLeft') this.keys.a = true;
      if (k === 'd' || e.key === 'ArrowRight') this.keys.d = true;

      if (e.key === ' ' || e.key === 'Shift') {
        e.preventDefault();
        this.executeChronosPhaseDash();
      }
      if (k === 'e') this.interactNearestNPC();
      if (k === 'f') this.swingMemorySledgehammer();
      if (k === 'q') this.invokeSelectedArcana();
      if (k === 'g') this.fireAetherGrapple();
      if (k === 'c') this.triggerSolarAegisParry();
      if (k === 't') this.summonPhantomEchoTwin();
      if (k === 'x') this.toggleAbyssalBurrow();
      if (k === 'z') this.stampPolyominoSigil();
      if (k === 'v') this.projectAstralCrown();
      if (k === 'p') this.deployRiftPortals();
      if (k === 'n') this.spawnGravitySingularity();
      if (k === 'm') this.triggerHarmonicCadence();
      if (k === 'b' && this.hasAbility('FULL_CONVERGENCE')) this.cosmos.placeLeyPylon();
      if (k === 'r') this.state.rewinding = true;
      if (e.key === 'Tab') {
        e.preventDefault();
        this.toggleCodexDrawer();
      }
    });

    window.addEventListener('keyup', (e) => {
      const k = e.key.toLowerCase();
      if (k === 'w' || e.key === 'ArrowUp') this.keys.w = false;
      if (k === 's' || e.key === 'ArrowDown') this.keys.s = false;
      if (k === 'a' || e.key === 'ArrowLeft') this.keys.a = false;
      if (k === 'd' || e.key === 'ArrowRight') this.keys.d = false;
      if (k === 'r') this.state.rewinding = false;
    });

    const dom = this.renderer.domElement;
    dom.addEventListener('contextmenu', (e) => e.preventDefault());

    dom.addEventListener('mousemove', (e) => {
      if (this.state.onTitleScreen) return;
      this.mouseNDC.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouseNDC.y = -(e.clientY / window.innerHeight) * 2 + 1;
      this.raycaster.setFromCamera(this.mouseNDC, this.camera);
      this.raycaster.ray.intersectPlane(this.groundPlane, this.aimWorldPoint);

      if (this.state.lassoActive && this.aimWorldPoint) {
        this.state.lassoPoints.push(this.aimWorldPoint.clone());
        this.lassoLine.geometry.setFromPoints(this.state.lassoPoints);
        this.spikeTimeDilation(0.7, 0.1);
      }
    });

    dom.addEventListener('mousedown', (e) => {
      if (this.state.onTitleScreen) return;
      this.mouseNDC.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouseNDC.y = -(e.clientY / window.innerHeight) * 2 + 1;
      this.raycaster.setFromCamera(this.mouseNDC, this.camera);
      this.raycaster.ray.intersectPlane(this.groundPlane, this.aimWorldPoint);

      if (e.button === 2) {
        this.state.lassoActive = true;
        this.state.lassoPoints = [this.aimWorldPoint.clone()];
        return;
      }

      this.castConduitSpell(this.aimWorldPoint);
    });

    window.addEventListener('mouseup', (e) => {
      if (e.button === 2 && this.state.lassoActive) {
        this.state.lassoActive = false;
        this.completeAstralLasso();
      }
    });
  }

  spikeTimeDilation(target = 1.0, hold = 0.22) {
    this.state.targetTimeScale = Math.max(this.state.targetTimeScale, target);
    this.state.dilationHold = Math.max(this.state.dilationHold, hold);
  }

  // ==========================================================================
  // MAIN 3D SIMULATION LOOP
  // ==========================================================================
  animate() {
    requestAnimationFrame(this.animate);

    const realDt = Math.min(0.05, this.clock.getDelta());
    const s = this.state;
    s.time += realDt;

    this.updateAtmosphericEmbers(realDt);

    if (s.onTitleScreen) {
      const orbitAng = s.time * 0.22;
      const camX = Math.sin(orbitAng) * 14.5;
      const camZ = Math.cos(orbitAng) * 14.5 + 3.5;
      const camY = 5.2 + Math.sin(s.time * 0.45) * 1.1;
      this.camera.position.lerp(new THREE.Vector3(camX, camY, camZ), Math.min(1, realDt * 4.0));
      this.cameraLookTarget.lerp(new THREE.Vector3(2.5, 6.2, -9.5), Math.min(1, realDt * 4.0));
      this.camera.lookAt(this.cameraLookTarget);

      const ud = this.heroMesh.userData;
      ud.halo.rotation.z = s.time * 0.8;
      ud.staffCore.rotation.y = s.time * 2.5;
      this.hero.orbitalMeshes.forEach((m, idx) => {
        const ang = s.time * 2.2 + (idx / this.hero.orbitalMeshes.length) * Math.PI * 2;
        m.position.set(Math.cos(ang) * 2.5, 0, Math.sin(ang) * 2.5);
        m.rotation.y = -ang;
      });
      for (const npc of s.npcs) {
        npc.mesh.userData.crown.rotation.z += realDt * 1.2;
      }
      for (const gate of s.exitGates) {
        gate.mesh.userData.orb.rotation.y += realDt * 2.2;
        gate.mesh.userData.ring.rotation.z -= realDt * 1.4;
      }
    } else {
      if (s.rewinding) {
        this.stepRewind();
      } else {
        this.stepForward(realDt);
      }

      const desiredCamPos = new THREE.Vector3(this.hero.pos.x, 0, this.hero.pos.z).add(this.cameraOffset);
      this.camera.position.lerp(desiredCamPos, Math.min(1, realDt * 7.5));
      this.cameraLookTarget.lerp(new THREE.Vector3(this.hero.pos.x, 1.2, this.hero.pos.z - 1.5), Math.min(1, realDt * 10));
      this.camera.lookAt(this.cameraLookTarget);
      this.updateFloatingLabels(realDt);
    }

    this.sunUniforms.uTime.value = s.time;
    this.sunRing1.rotation.x = s.time * 0.4;
    this.sunRing2.rotation.z = -s.time * 0.35;
    this.floorUniforms.uTime.value = s.time;
    this.floorUniforms.uPulsePhase.value = s.simTime;

    this.renderer.render(this.scene, this.camera);
  }

  stepForward(realDt) {
    const s = this.state;
    const ch = CHAMBERS[this.currentChamberIdx];
    const limit = ch.arenaRadius - 1.3;

    if (s.portalCooldown > 0) {
      s.portalCooldown -= realDt;
    }

    // Update Subterranean Burrow Timer ([X])
    if (s.burrowTimer > 0) {
      s.burrowTimer -= realDt;
      if (Math.random() < 0.35) {
        this.paintAlchemyDisc(this.hero.pos.x, this.hero.pos.z, 1.35, 4); // Mycelium Spore trail while burrowing
      }
      if (s.burrowTimer <= 0) {
        this.eruptFromAbyssalBurrow();
      }
    }

    const moveVec = new THREE.Vector3(
      (this.keys.d ? 1 : 0) - (this.keys.a ? 1 : 0),
      0,
      (this.keys.s ? 1 : 0) - (this.keys.w ? 1 : 0)
    );

    if (moveVec.lengthSq() > 0) {
      moveVec.normalize();
      const moveSpeed = s.burrowTimer > 0 ? 15.6 : 9.5;
      const nextX = this.hero.pos.x + moveVec.x * moveSpeed * realDt;
      const nextZ = this.hero.pos.z + moveVec.z * moveSpeed * realDt;

      // While burrowed underground (s.burrowTimer > 0), Vesper tunnels straight under solid stone pillars!
      let blockedByPillar = false;
      if (s.burrowTimer <= 0) {
        for (const p of s.pillars) {
          if (Math.hypot(nextX - p.x, nextZ - p.z) < 1.35) {
            blockedByPillar = true;
            break;
          }
        }
      }

      if (!blockedByPillar) {
        this.hero.pos.x = Math.max(-limit, Math.min(limit, nextX));
        this.hero.pos.z = Math.max(-limit, Math.min(limit, nextZ));
      }

      this.hero.facingAngle = Math.atan2(moveVec.x, moveVec.z);
      this.heroMesh.rotation.y = this.hero.facingAngle;
      this.heroMesh.userData.walkCycle += realDt * 12;

      // Push 3D Runic Monoliths
      let pushedMonolith = false;
      for (const m of s.monoliths) {
        if (m.pos.distanceTo(new THREE.Vector3(this.hero.pos.x, 0, this.hero.pos.z)) < 1.65) {
          const pushDir = new THREE.Vector3(m.pos.x - this.hero.pos.x, 0, m.pos.z - this.hero.pos.z).normalize();
          m.pos.addScaledVector(pushDir, moveSpeed * realDt * 1.15);

          if (s.triadSocketMesh && m.pos.distanceTo(s.triadSocketMesh.position) < 1.1) {
            m.pos.set(s.triadSocketMesh.position.x, 0, s.triadSocketMesh.position.z);
          }
          pushedMonolith = true;
        }
      }
      if (pushedMonolith) {
        this.evaluateAxiomMonoliths();
      }

      this.spikeTimeDilation(1.0, 0.14);
    }

    // Update Linked 3D Rift-Portals ([P]): Teleport Vesper & Runic Monoliths!
    if (s.riftPortals.length === 2) {
      for (let idx = 0; idx < 2; idx++) {
        const portal = s.riftPortals[idx];
        const pair = s.riftPortals[portal.pairIdx];
        portal.mesh.userData.vortex.rotation.z += realDt * 2.8;
        portal.mesh.userData.outerRing.rotation.z -= realDt * 1.6;

        if (s.portalCooldown <= 0 && Math.hypot(this.hero.pos.x - portal.pos.x, this.hero.pos.z - portal.pos.z) < 1.55) {
          s.portalCooldown = 1.1;
          this.hero.pos.set(pair.pos.x, 0, pair.pos.z + 1.2);
          this.sfx.playCastBolt(920);
          this.spawnFloatingText(this.hero.pos, '🌀 RIFT TELEPORT!', '#38bdf8');
          break;
        }

        for (const m of s.monoliths) {
          if (m.category === 'EFFECT' && s.portalCooldown <= 0 && Math.hypot(m.pos.x - portal.pos.x, m.pos.z - portal.pos.z) < 1.65) {
            s.portalCooldown = 1.1;
            m.pos.set(pair.pos.x + 1.5, 0, pair.pos.z);
            this.spawnFloatingText(m.pos, `🌀 MONOLITH WARPED [${m.word}]!`, '#fbbf24');
            this.evaluateAxiomMonoliths();
            break;
          }
        }
      }
    }

    // Update 3D Black-Sun Gravity Singularities ([N])
    for (let i = s.singularities.length - 1; i >= 0; i--) {
      const well = s.singularities[i];
      well.life -= realDt;
      well.mesh.userData.disk1.rotation.z += realDt * 3.8;
      well.mesh.userData.disk2.rotation.y -= realDt * 2.9;

      if (well.life <= 0) {
        if (s.singularityCollapseBonus) {
          this.paintAlchemyDisc(well.pos.x, well.pos.z, 3.4, 5);
          for (let wIdx = s.wardens.length - 1; wIdx >= 0; wIdx--) {
            const w = s.wardens[wIdx];
            if (!w.isThrall && w.pos.distanceTo(well.pos) < 5.2) {
              w.hp -= 55;
              this.spawnFloatingText(w.pos, '💥 SUPERNOVA COLLAPSE! -55', '#fbbf24');
              if (w.hp <= 0) this.removeWarden(wIdx);
            }
          }
        }
        this.scene.remove(well.mesh);
        s.singularities.splice(i, 1);
        continue;
      }

      // Gravitational pull on hostile Wardens
      for (let wIdx = s.wardens.length - 1; wIdx >= 0; wIdx--) {
        const w = s.wardens[wIdx];
        if (w.isThrall) continue;
        const dist = w.pos.distanceTo(well.pos);
        if (dist < 7.5 && dist > 0.6) {
          const pull = new THREE.Vector3().subVectors(well.pos, w.pos).normalize();
          w.pos.addScaledVector(pull, realDt * 4.2);
          w.hp -= realDt * 38;
          if (Math.random() < 0.08) {
            this.spawnFloatingText(w.pos, '🕳️ SINGULARITY CRUSH!', '#c084fc');
          }
          if (w.hp <= 0) {
            this.removeWarden(wIdx);
          }
        }
      }

      // Gravitational pull on EFFECT Runic Monoliths toward [IS] alignment
      for (const m of s.monoliths) {
        if (m.category === 'EFFECT' && m.pos.distanceTo(well.pos) < 6.8 && m.pos.distanceTo(well.pos) > 0.8) {
          const pull = new THREE.Vector3().subVectors(well.pos, m.pos).normalize();
          m.pos.addScaledVector(pull, realDt * 2.6);
          this.evaluateAxiomMonoliths();
        }
      }
    }

    // Check if Vesper walked into an active 3D Exit Gate!
    for (const gate of s.exitGates) {
      gate.mesh.userData.orb.rotation.y += realDt * 2.2;
      gate.mesh.userData.ring.rotation.z -= realDt * 1.4;
      if (Math.hypot(this.hero.pos.x - gate.pos.x, this.hero.pos.z - gate.pos.z) < 1.95) {
        this.loadChamber(gate.nextChamberIdx, gate.boon);
        return;
      }
    }

    for (const npc of s.npcs) {
      npc.mesh.userData.crown.rotation.z += realDt * 1.2;
      npc.mesh.userData.head.position.y = 1.98 + Math.sin(s.time * 2.5) * 0.05;
    }

    for (const anchor of s.grappleAnchors) {
      anchor.mesh.userData.crystal.rotation.y += realDt * 2.4;
      anchor.mesh.userData.halo.rotation.z -= realDt * 1.8;
    }

    if (s.parryTimer > 0) {
      s.parryTimer -= realDt;
      this.heroMesh.userData.aegisSphere.rotation.y += realDt * 5.0;
      this.heroMesh.userData.aegisMat.opacity = Math.max(0, (s.parryTimer / 0.65) * 0.85);
    }

    // Update 3D Astral Polyomino Sigil Tiles ([Z])
    for (let i = s.polyominoSigils.length - 1; i >= 0; i--) {
      const sigil = s.polyominoSigils[i];
      sigil.life -= realDt;
      if (sigil.life <= 0) {
        this.scene.remove(sigil.mesh);
        s.polyominoSigils.splice(i, 1);
        continue;
      }
      // Sear hostile Wardens standing on any cell of the Polyomino Sigil
      for (let wIdx = s.wardens.length - 1; wIdx >= 0; wIdx--) {
        const w = s.wardens[wIdx];
        if (w.isThrall) continue;
        for (const cellPos of sigil.worldCells) {
          if (Math.hypot(w.pos.x - cellPos.x, w.pos.z - cellPos.z) < 1.45) {
            w.hp -= realDt * 34;
            if (Math.random() < 0.07) {
              this.spawnFloatingText(w.pos, '❖ POLYOMINO SEAR!', '#38bdf8');
            }
            if (w.hp <= 0) {
              this.removeWarden(wIdx);
            }
            break;
          }
        }
      }
    }

    // Update 3D Holographic Phantom Time-Echo Twins
    for (let i = s.phantomTwins.length - 1; i >= 0; i--) {
      const twin = s.phantomTwins[i];
      twin.life -= realDt;
      if (twin.life <= 0) {
        this.scene.remove(twin.mesh);
        s.phantomTwins.splice(i, 1);
        continue;
      }
      twin.orbitAngle += realDt * 1.65;
      const targetX = this.hero.pos.x + Math.cos(twin.orbitAngle) * 3.4;
      const targetZ = this.hero.pos.z + Math.sin(twin.orbitAngle) * 3.4;
      twin.pos.x += (targetX - twin.pos.x) * Math.min(1, realDt * 6);
      twin.pos.z += (targetZ - twin.pos.z) * Math.min(1, realDt * 6);
      twin.mesh.rotation.y = twin.orbitAngle + Math.PI / 2;

      twin.fireCooldown -= realDt;
      const hostile = s.wardens.find(w => !w.isThrall);
      if (twin.fireCooldown <= 0 && hostile) {
        twin.fireCooldown = 1.25;
        const ang = Math.atan2(hostile.pos.x - twin.pos.x, hostile.pos.z - twin.pos.z);
        const geo = new THREE.SphereGeometry(0.22, 10, 10);
        const mat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(twin.pos.x, 1.3, twin.pos.z);
        this.scene.add(mesh);
        s.projectiles.push({
          mesh,
          pos: mesh.position,
          vx: Math.sin(ang) * 20,
          vz: Math.cos(ang) * 20,
          dmg: 22,
          boostedBySigil: false,
          teleportedByPortal: false,
          life: 1.6
        });
      }
    }

    // Chrono-Stillness Dilation
    const minFlow = this.currentChamberIdx === 0 ? 1.0 : 0.12;
    if (s.dilationHold > 0) {
      s.dilationHold -= realDt;
    } else {
      s.targetTimeScale = minFlow;
    }
    s.timeScale += (s.targetTimeScale - s.timeScale) * Math.min(1, realDt * 12);

    const simDt = realDt * s.timeScale;
    s.simTime += simDt;

    if (this.hasAbility('FULL_CONVERGENCE')) {
      this.cosmos.update(realDt, simDt);
    }

    // Animate Vesper Character Rig
    const ud = this.heroMesh.userData;
    ud.halo.rotation.z = s.time * 0.8;
    ud.staffCore.rotation.y = s.time * 2.5;
    ud.cape.rotation.x = 0.18 + Math.sin(ud.walkCycle) * 0.12;
    if (ud.swingTimer > 0) {
      ud.swingTimer -= realDt;
      ud.leftArm.rotation.x = -Math.sin(ud.swingTimer * Math.PI * 2.2) * 1.8;
    } else {
      ud.leftArm.rotation.x = Math.sin(ud.walkCycle) * 0.25;
      ud.rightArm.rotation.x = -Math.sin(ud.walkCycle) * 0.25;
    }

    // Animate Orbiting Blades
    const orbRadius = 2.5;
    this.hero.orbitalMeshes.forEach((m, idx) => {
      const ang = s.time * 2.5 + (idx / this.hero.orbitalMeshes.length) * Math.PI * 2;
      m.position.set(Math.cos(ang) * orbRadius, 0, Math.sin(ang) * orbRadius);
      m.rotation.y = -ang;

      const bladeWorld = new THREE.Vector3(this.hero.pos.x + m.position.x, 1.1, this.hero.pos.z + m.position.z);
      for (let wIdx = s.wardens.length - 1; wIdx >= 0; wIdx--) {
        const w = s.wardens[wIdx];
        if (!w.isThrall && w.pos.distanceTo(bladeWorld) < 1.15 && Math.random() < 0.16) {
          w.hp -= 8;
          if (w.hp <= 0) this.removeWarden(wIdx);
        }
      }
    });

    // Update Projectiles
    for (let i = s.projectiles.length - 1; i >= 0; i--) {
      const p = s.projectiles[i];
      p.life -= simDt;
      if (p.life <= 0) {
        this.scene.remove(p.mesh);
        s.projectiles.splice(i, 1);
        continue;
      }

      // Gravitational lensing of projectiles around 3D Black-Sun Singularities ([N])
      for (const well of s.singularities) {
        const dx = well.pos.x - p.pos.x;
        const dz = well.pos.z - p.pos.z;
        const d = Math.hypot(dx, dz);
        if (d < 6.5 && d > 0.4) {
          p.vx += (dx / d) * 32 * simDt;
          p.vz += (dz / d) * 32 * simDt;
          p.dmg = Math.min(85, p.dmg + 12 * simDt);
        }
      }

      p.pos.x += p.vx * simDt;
      p.pos.z += p.vz * simDt;

      // Cross-Synergy: Projectiles entering a 3D Rift-Portal ([P]) teleport out the paired portal and split into Prismatic Beams!
      if (!p.teleportedByPortal && s.riftPortals.length === 2) {
        for (let portalIdx = 0; portalIdx < 2; portalIdx++) {
          const portal = s.riftPortals[portalIdx];
          if (Math.hypot(p.pos.x - portal.pos.x, p.pos.z - portal.pos.z) < 1.45) {
            const exitPortal = s.riftPortals[portal.pairIdx];
            p.teleportedByPortal = true;
            p.pos.set(exitPortal.pos.x, 1.3, exitPortal.pos.z);
            p.dmg += 18;
            p.life = Math.max(p.life, 1.5);

            // Spawn extra Prismatic Refracted Beams out of the exit portal!
            const baseAng = Math.atan2(p.vx, p.vz);
            const speed = Math.hypot(p.vx, p.vz);
            const extraAngles = s.prismaticPortalsBonus ? [-0.42, -0.21, 0.21, 0.42] : [-0.26, 0.26];
            for (const offset of extraAngles) {
              const ang = baseAng + offset;
              const geo = new THREE.SphereGeometry(0.24, 10, 10);
              const mat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
              const mesh = new THREE.Mesh(geo, mat);
              mesh.position.set(exitPortal.pos.x, 1.3, exitPortal.pos.z);
              this.scene.add(mesh);
              s.projectiles.push({
                mesh,
                pos: mesh.position,
                vx: Math.sin(ang) * speed,
                vz: Math.cos(ang) * speed,
                dmg: p.dmg,
                boostedBySigil: p.boostedBySigil,
                teleportedByPortal: true,
                life: 1.4
              });
            }
            this.spawnFloatingText(exitPortal.pos, '🌀 PRISMATIC PORTAL SPLIT!', '#38bdf8');
            break;
          }
        }
      }

      // Cross-Synergy: Projectiles passing over a 3D Polyomino Sigil supercharge!
      if (!p.boostedBySigil) {
        for (const sigil of s.polyominoSigils) {
          if (Math.hypot(p.pos.x - sigil.center.x, p.pos.z - sigil.center.z) < 2.6) {
            p.boostedBySigil = true;
            p.dmg += 20;
            p.mesh.scale.set(1.6, 1.6, 1.6);
            break;
          }
        }
      }

      if (this.getAlchemyAtWorld(p.pos.x, p.pos.z) === 4) {
        this.paintAlchemyDisc(p.pos.x, p.pos.z, 2.6, 1);
      }

      for (let wIdx = s.wardens.length - 1; wIdx >= 0; wIdx--) {
        const w = s.wardens[wIdx];
        if (!w.isThrall && Math.hypot(w.pos.x - p.pos.x, w.pos.z - p.pos.z) < 1.25) {
          const hitDmg = Math.round(p.dmg);
          w.hp -= hitDmg;
          this.paintAlchemyDisc(w.pos.x, w.pos.z, 1.4, 1);
          this.spawnFloatingText(w.pos, `-${hitDmg}`, '#fbbf24');
          if (w.hp <= 0) {
            this.removeWarden(wIdx);
          }
          this.scene.remove(p.mesh);
          s.projectiles.splice(i, 1);
          break;
        }
      }
    }

    // Update Ricocheting 3D Astral Spheres
    for (let i = s.astralSpheres.length - 1; i >= 0; i--) {
      const orb = s.astralSpheres[i];
      orb.pos.x += orb.vx * Math.max(realDt * 0.25, simDt);
      orb.pos.z += orb.vz * Math.max(realDt * 0.25, simDt);

      let bounced = false;
      if (Math.abs(orb.pos.x) > limit) {
        orb.vx *= -1;
        orb.pos.x = Math.sign(orb.pos.x) * limit;
        bounced = true;
      }
      if (Math.abs(orb.pos.z) > limit) {
        orb.vz *= -1;
        orb.pos.z = Math.sign(orb.pos.z) * limit;
        bounced = true;
      }

      for (let wIdx = s.wardens.length - 1; wIdx >= 0; wIdx--) {
        const w = s.wardens[wIdx];
        if (!w.isThrall && Math.hypot(w.pos.x - orb.pos.x, w.pos.z - orb.pos.z) < 1.35) {
          w.hp -= 28;
          orb.vx *= -1;
          orb.vz *= -1;
          bounced = true;
          this.spawnFloatingText(w.pos, '🔮 RICOCHET! -28', '#38bdf8');
          if (w.hp <= 0) this.removeWarden(wIdx);
        }
      }

      if (bounced) {
        orb.bouncesLeft--;
        if (orb.bouncesLeft <= 0) {
          this.scene.remove(orb.mesh);
          s.astralSpheres.splice(i, 1);
        }
      }
    }

    // Update Seraph Wardens & Crown-Possessed Astral Thralls
    for (let i = s.wardens.length - 1; i >= 0; i--) {
      const w = this.state.wardens[i];
      w.mesh.userData.ring.rotation.y += realDt * 1.8;
      w.mesh.userData.core.rotation.x += realDt * 2.2;

      // If this Warden was possessed by Vesper's Astral Crown [V], it hunts down other hostile Wardens!
      if (w.isThrall) {
        const targetHostileIdx = s.wardens.findIndex((other, idx) => idx !== i && !other.isThrall);
        if (targetHostileIdx !== -1) {
          const other = s.wardens[targetHostileIdx];
          const toOther = new THREE.Vector3().subVectors(other.pos, w.pos);
          toOther.y = 0;
          if (toOther.length() > 1.8) {
            toOther.normalize();
            w.pos.addScaledVector(toOther, realDt * 5.2);
            w.mesh.rotation.y = Math.atan2(toOther.x, toOther.z);
          } else {
            other.hp -= realDt * 55;
            if (Math.random() < 0.12) {
              this.spawnFloatingText(other.pos, '👑 THRALL STRIKE!', '#38bdf8');
            }
            if (other.hp <= 0) {
              this.removeWarden(targetHostileIdx);
            }
          }
        }
        continue;
      }

      const floorMat = this.getAlchemyAtWorld(w.pos.x, w.pos.z);
      if (floorMat === 1 || floorMat === 2) {
        w.hp -= simDt * 28;
        if (Math.random() < 0.08) {
          this.spawnFloatingText(w.pos, floorMat === 2 ? '🐍 VITRIOL MELT!' : '🔥 WILDFIRE BURN!', '#10b981');
        }
        if (w.hp <= 0) {
          this.removeWarden(i);
          continue;
        }
      }

      if (w.pos.distanceTo(w.telegraphOrigin) > 1.8) {
        s.essence += 45;
        this.spawnFloatingText(w.pos, '🛡️ STANCE BROKEN!', '#38bdf8');
        w.telegraphOrigin.copy(w.pos);
        w.telegraphTarget.set(this.hero.pos.x, 0, this.hero.pos.z);
        w.telegraphTimer = 4.2;
      }

      const toHero = new THREE.Vector3(this.hero.pos.x - w.pos.x, 0, this.hero.pos.z - w.pos.z);

      let wardenBlocked = false;
      for (const p of s.pillars) {
        if (Math.hypot(w.pos.x - p.x, w.pos.z - p.z) < 2.2) wardenBlocked = true;
      }

      if (toHero.length() > 3.2 && !wardenBlocked) {
        toHero.normalize();
        w.pos.addScaledVector(toHero, simDt * 2.0);
        w.telegraphOrigin.copy(w.pos);
        w.mesh.rotation.y = Math.atan2(toHero.x, toHero.z);
      }

      w.telegraphLine.geometry.setFromPoints([
        new THREE.Vector3(w.pos.x, 1.45, w.pos.z),
        new THREE.Vector3(w.telegraphTarget.x, 0.15, w.telegraphTarget.z)
      ]);
      w.targetRing.position.set(w.telegraphTarget.x, 0.06, w.telegraphTarget.z);

      w.telegraphTimer -= simDt;
      if (w.telegraphTimer <= 0) {
        if (s.parryTimer > 0) {
          w.hp -= 90;
          this.spawnFloatingText(w.pos, '🛡️ PERFECT PARRY! -90', '#fbbf24');
          w.telegraphTimer = 4.2;
          if (w.hp <= 0) {
            this.removeWarden(i);
            continue;
          }
        } else if (s.burrowTimer <= 0) {
          this.paintAlchemyDisc(w.telegraphTarget.x, w.telegraphTarget.z, 2.0, 1);
          if (Math.hypot(this.hero.pos.x - w.telegraphTarget.x, this.hero.pos.z - w.telegraphTarget.z) < 2.1) {
            s.hp = Math.max(10, s.hp - 14);
            this.spawnFloatingText(this.hero.pos, '-14 HP', '#f43f5e');
          }
          w.telegraphTarget.set(this.hero.pos.x, 0, this.hero.pos.z);
          w.telegraphTimer = 4.2;
        } else {
          w.telegraphTarget.set(this.hero.pos.x, 0, this.hero.pos.z);
          w.telegraphTimer = 4.2;
        }
      }
    }

    if (Math.random() < 0.35) {
      this.stepAlchemicalSimulation();
    }

    if (Math.random() < 0.3) {
      s.history.push({
        heroPos: new THREE.Vector3(this.hero.pos.x, 0, this.hero.pos.z),
        monolithPos: s.monoliths.map(m => m.pos.clone())
      });
      if (s.history.length > 180) s.history.shift();
    }

    if (Math.random() < 0.2) {
      this.updateHUD();
    }
  }

  stepRewind() {
    const s = this.state;
    if (s.history.length === 0) {
      s.rewinding = false;
      return;
    }
    const snap = s.history.pop();
    this.hero.pos.copy(snap.heroPos);
    snap.monolithPos.forEach((p, idx) => {
      if (s.monoliths[idx]) s.monoliths[idx].pos.copy(p);
    });
    this.evaluateAxiomMonoliths();
  }

  // ==========================================================================
  // 3D WORLD LABELS & PROGRESSIVE HADES-STYLE HUD
  // ==========================================================================
  spawnFloatingText(worldPos, text, color = '#ffffff') {
    const vector = worldPos.clone();
    vector.y = 2.2;
    this.state.floatingLabels.push({
      worldPos: vector,
      text,
      color,
      life: 1.3
    });
  }

  updateFloatingLabels(dt) {
    const container = document.getElementById('floating-labels-layer');
    if (!container) return;

    const labels = this.state.floatingLabels;
    for (let i = labels.length - 1; i >= 0; i--) {
      labels[i].life -= dt;
      labels[i].worldPos.y += dt * 1.4;
      if (labels[i].life <= 0) labels.splice(i, 1);
    }

    const htmlParts = [];

    for (const l of labels) {
      const p = l.worldPos.clone().project(this.camera);
      if (p.z > 1) continue;
      const x = (p.x * 0.5 + 0.5) * window.innerWidth;
      const y = (-(p.y * 0.5) + 0.5) * window.innerHeight;
      htmlParts.push(`<div class="world-float-label" style="left:${x}px; top:${y}px; color:${l.color}; opacity:${Math.min(1, l.life)}">${l.text}</div>`);
    }

    for (const npc of this.state.npcs) {
      const p = npc.pos.clone().add(new THREE.Vector3(0, 2.65, 0)).project(this.camera);
      if (p.z <= 1) {
        const x = (p.x * 0.5 + 0.5) * window.innerWidth;
        const y = (-(p.y * 0.5) + 0.5) * window.innerHeight;
        const near = npc.pos.distanceTo(this.hero.pos) < 4.2;
        htmlParts.push(`
          <div class="world-float-label" style="left:${x}px; top:${y}px; color:${npc.color}; font-size:${near ? '13px' : '11px'};">
            ${npc.name} ${near ? '<span style="color:#fff; background:rgba(0,0,0,0.75); padding:2px 6px; border-radius:4px; border:1px solid #fbbf24;">[E] Converse</span>' : ''}
          </div>
        `);
      }
    }

    for (const gate of this.state.exitGates) {
      const p = gate.pos.clone().add(new THREE.Vector3(0, 4.4, 0)).project(this.camera);
      if (p.z <= 1) {
        const x = (p.x * 0.5 + 0.5) * window.innerWidth;
        const y = (-(p.y * 0.5) + 0.5) * window.innerHeight;
        htmlParts.push(`
          <div class="world-float-label gate-label" style="left:${x}px; top:${y}px;">
            ${gate.label}
          </div>
        `);
      }
    }

    if (this.state.triadSocketMesh && this.state.activeAxioms.length === 0) {
      const p = this.state.triadSocketMesh.position.clone().add(new THREE.Vector3(0, 0.6, 0)).project(this.camera);
      if (p.z <= 1) {
        const x = (p.x * 0.5 + 0.5) * window.innerWidth;
        const y = (-(p.y * 0.5) + 0.5) * window.innerHeight;
        htmlParts.push(`
          <div class="world-float-label" style="left:${x}px; top:${y}px; color:#fbbf24; font-size:12px;">
            ⬇ Push [GOLD] Monolith Here
          </div>
        `);
      }
    }

    container.innerHTML = htmlParts.join('');
  }

  updateHUD() {
    const s = this.state;
    const ch = CHAMBERS[this.currentChamberIdx];
    const setTxt = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    setTxt('hud-chamber-title', ch.title);
    setTxt('hud-chamber-sub', s.chamberCleared && this.currentChamberIdx > 0
      ? '✨ Chamber Cleared — Walk through a Northern Boon Gate to ascend!'
      : ch.inWorldPrompt);

    setTxt('hud-vitality', `${Math.ceil(s.hp)} / ${s.maxHp}`);
    setTxt('hud-essence', `${s.essence} (${s.resonance}x)`);
    setTxt('hud-chrono', `${Math.round(s.timeScale * 100)}%`);

    // Progressive Ability Bar: Only show abilities the player has actually unlocked!
    const hotbarEl = document.getElementById('progressive-hotbar');
    if (hotbarEl) {
      const pills = [
        `<span class="ability-pill unlocked">⚡ Attack <b>[Left-Click]</b></span>`,
        `<span class="ability-pill unlocked">💨 Phase-Dash <b>[Space]</b></span>`
      ];
      if (this.hasAbility('SLEDGEHAMMER')) {
        pills.push(`<button class="ability-pill active-btn" onclick="window.VESPER.swingMemorySledgehammer()">🔨 Sledgehammer <b>[F]</b></button>`);
      }
      if (this.hasAbility('MONOLITHS') && s.activeAxioms.length > 0) {
        pills.push(`<span class="ability-pill gold">◈ Axiom: <b>${s.activeAxioms.map(a => a.phrase).join(', ')}</b></span>`);
      }
      if (this.hasAbility('LASSO_AND_ARCANA')) {
        pills.push(`<span class="ability-pill unlocked">⭕ Astral Lasso <b>[Right-Drag]</b></span>`);
        pills.push(`<button class="ability-pill active-btn gold" onclick="window.VESPER.invokeSelectedArcana()">🃏 Cast Arcana <b>[Q]</b> (${s.hand.length})</button>`);
      }
      if (this.hasAbility('FULL_CONVERGENCE')) {
        pills.push(`<button class="ability-pill active-btn" onclick="window.VESPER.cosmos.placeLeyPylon()">⚡ Ley-Pylon <b>[B]</b></button>`);
        pills.push(`<button class="ability-pill active-btn" onmousedown="window.VESPER.state.rewinding=true" onmouseup="window.VESPER.state.rewinding=false">⏪ Rewind <b>[R]</b></button>`);
      }
      if (this.hasAbility('AETHER_GRAPPLE')) {
        pills.push(`<button class="ability-pill active-btn" onclick="window.VESPER.fireAetherGrapple()">⛓️ Grapple <b>[G]</b></button>`);
      }
      if (this.hasAbility('SOLAR_PARRY')) {
        pills.push(`<button class="ability-pill active-btn gold" onclick="window.VESPER.triggerSolarAegisParry()">🛡️ Solar Parry <b>[C]</b></button>`);
      }
      if (this.hasAbility('PHANTOM_ECHO')) {
        pills.push(`<button class="ability-pill active-btn" onclick="window.VESPER.summonPhantomEchoTwin()">👥 Phantom Twin <b>[T]</b></button>`);
      }
      if (this.hasAbility('ABYSSAL_BURROW')) {
        pills.push(`<button class="ability-pill active-btn" onclick="window.VESPER.toggleAbyssalBurrow()">💎 Burrow <b>[X]</b></button>`);
      }
      if (this.hasAbility('POLYOMINO_SIGILS')) {
        pills.push(`<button class="ability-pill active-btn" onclick="window.VESPER.stampPolyominoSigil()">❖ Polyomino <b>[Z]</b></button>`);
      }
      if (this.hasAbility('CROWN_POSSESSION')) {
        pills.push(`<button class="ability-pill active-btn gold" onclick="window.VESPER.projectAstralCrown()">👑 Crown Possess <b>[V]</b></button>`);
      }
      if (this.hasAbility('RIFT_PORTALS')) {
        pills.push(`<button class="ability-pill active-btn" onclick="window.VESPER.deployRiftPortals()">🌀 Rift Portals <b>[P]</b></button>`);
      }
      if (this.hasAbility('GRAVITY_SINGULARITY')) {
        pills.push(`<button class="ability-pill active-btn" onclick="window.VESPER.spawnGravitySingularity()">🕳️ Singularity <b>[N]</b></button>`);
      }
      if (this.hasAbility('HARMONIC_CADENCE')) {
        pills.push(`<button class="ability-pill active-btn gold" onclick="window.VESPER.triggerHarmonicCadence()">🎵 Harmonic Cadence <b>[M]</b></button>`);
      }
      hotbarEl.innerHTML = pills.join('');
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.VESPER = new VesperGame();
});
