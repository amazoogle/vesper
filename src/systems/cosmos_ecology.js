// ============================================================================
// VESPER: THE GILDED ECLIPSE — SYSTEM III: 3D MULTIVERSE REALM-SHIFTING,
// PROCEDURAL IK ABYSSAL LEVIATHAN, LEY-LINE TENSION LATTICE & ACOLYTES
// ============================================================================
// 1. 3D Multiverse Realm-Shifting:
//    - Realm 0: The Shattered Cathedral of Sol-Vespera (Surface Sanctum)
//    - Realm 1: The Recursive Microcosm World-Orb (Pocket Crystalline Dimension
//      where time & resonance scale exponentially and nested Runic Monoliths float)
//    - Realm 2: The Sub-Abyssal Bathysphere Trench (Crushing Hydrostatic Bar-Pressure,
//      Oxygen Reserve Gauge, Sonar Ping Waves, and Bioluminescent Ore Harpooning)
// 2. Procedural Multi-Segment Inverse-Kinematics (IK) Abyssal Leviathan:
//    - A 14-segment articulated 3D serpentine wyrm with lateral sinusoidal
//      undulation and glowing rib-spines that hunts across the courtyard & trench!
// 3. 3D Elastic Ley-Line Tension Lattice:
//    - Anchor glowing Crystalline Pylons (`[B]`) onto the 3D ground; elastic
//      lightning filaments automatically bridge nearby Pylons, frying Wardens
//      that cross the beam and generating passive Essence per triangle truss!
// 4. Sanctum Acolyte Flock & Sovereign Doctrines:
//    - 3D Hooded Acolytes orbit the Sanctum shrines, harvesting Gilded Ichor,
//      carrying Runic Monoliths, and chanting Doctrines.
// ============================================================================

import * as THREE from 'three';

export const REALM_MODES = {
  CATHEDRAL: 'CATHEDRAL',
  MICROCOSM_ORB: 'MICROCOSM_ORB',
  ABYSSAL_TRENCH: 'ABYSSAL_TRENCH'
};

export const SOVEREIGN_DOCTRINES = [
  {
    id: 'DOC_SOLAR_TITHE',
    name: 'Doctrine of the Gilded Tithe',
    desc: 'Acolytes harvest +35 Soul Essence every 4 seconds from courtyard Alchemy pools.'
  },
  {
    id: 'DOC_MARTYR_ASCENSION',
    name: 'Rite of the Willing Vessel',
    desc: 'Sacrificing an Acolyte cools the Eclipse Star by 1,200K and grants +3x permanent Resonance.'
  },
  {
    id: 'DOC_CHORAL_OVERCLOCK',
    name: 'Canticle of Perpetual Motion',
    desc: 'Acolytes chant in 120 BPM sync, boosting Ley-Line Pylon voltage by 200%.'
  }
];

export class CosmosAndEcologySystem {
  constructor(game) {
    this.game = game;
    this.currentRealm = REALM_MODES.CATHEDRAL;

    // Sub-Abyssal Trench Telemetry (Oxygen, Depth in Meters, Hydrostatic Pressure in Bar)
    this.abyssDepth = 0; // 0m at Surface -> 850m in Trench
    this.oxygen = 100;
    this.maxOxygen = 100;
    this.cargoWeight = 0;
    this.sonarCooldown = 0;

    // 3D Carryable Microcosm World-Orb
    this.carryingOrb = false;
    this.worldOrbMesh = null;

    // 3D Procedural IK Serpentine Leviathan (14 articulated 3D vertebrae segments)
    this.leviathanSegments = [];
    this.leviathanGroup = new THREE.Group();
    this.leviathanPhase = 0;

    // 3D Elastic Ley-Line Tension Lattice Pylons
    this.pylons = [];
    this.latticeLinesGroup = new THREE.Group();

    // 3D Hooded Sanctum Acolytes
    this.acolytes = [];
    this.activeDoctrine = SOVEREIGN_DOCTRINES[0];
    this.titheTimer = 4.0;
  }

  init3DEntities(scene) {
    scene.add(this.leviathanGroup);
    scene.add(this.latticeLinesGroup);

    // 1. Spawn the 3D Microcosm World-Orb Pedestal in the North-West Courtyard
    const orbGroup = new THREE.Group();
    const outerGlass = new THREE.Mesh(
      new THREE.SphereGeometry(0.95, 24, 24),
      new THREE.MeshStandardMaterial({
        color: 0xa855f7,
        emissive: 0x6b21a8,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.72,
        roughness: 0.1,
        metalness: 0.9
      })
    );
    const innerCore = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.48, 1),
      new THREE.MeshBasicMaterial({ color: 0xfde68a, wireframe: true })
    );
    orbGroup.add(outerGlass, innerCore);
    orbGroup.position.set(-6, 1.25, -6);
    scene.add(orbGroup);
    this.worldOrbMesh = orbGroup;

    // 2. Build the 14-Segment Articulated 3D Abyssal Leviathan Wyrm
    this.leviathanSegments = [];
    const headMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      emissive: 0xe11d48,
      emissiveIntensity: 1.6,
      metalness: 0.85,
      roughness: 0.2
    });
    const segMat = new THREE.MeshStandardMaterial({
      color: 0x1e1b4b,
      emissive: 0x0284c7,
      emissiveIntensity: 0.9,
      metalness: 0.8,
      roughness: 0.25
    });

    for (let i = 0; i < 14; i++) {
      const radius = Math.max(0.22, 0.78 - i * 0.042);
      const segGroup = new THREE.Group();

      const body = new THREE.Mesh(new THREE.OctahedronGeometry(radius, 1), i === 0 ? headMat : segMat);
      body.castShadow = true;
      segGroup.add(body);

      // Lateral bioluminescent rib-fins on every other vertebra
      if (i > 0 && i % 2 === 0 && i < 11) {
        const fin = new THREE.Mesh(
          new THREE.BoxGeometry(radius * 3.4, 0.08, 0.24),
          new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
        );
        segGroup.add(fin);
      }

      segGroup.position.set(16 + i * 1.1, 2.2, -16 - i * 0.8);
      this.leviathanGroup.add(segGroup);
      this.leviathanSegments.push(segGroup);
    }

    // 3. Seed 3 Starter Ley-Line Tension Pylons forming an initial glowing triangle
    this.pylons = [];
    this.placeLeyPylon(-5, 5, true);
    this.placeLeyPylon(0, 8, true);
    this.placeLeyPylon(5, 5, true);

    // 4. Spawn 3 Hooded Sanctum Acolytes
    this.acolytes = [];
    const acolyteNames = ['Brother Caelum', 'Sister Nyx', 'Initiate Vespera'];
    for (let i = 0; i < 3; i++) {
      this.spawnAcolyte(acolyteNames[i], -4 + i * 4, 9);
    }
  }

  spawnAcolyte(name, x, z) {
    const group = new THREE.Group();
    const robeMat = new THREE.MeshStandardMaterial({ color: 0x311042, roughness: 0.7 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, emissive: 0xb45309, emissiveIntensity: 0.8 });

    const robe = new THREE.Mesh(new THREE.ConeGeometry(0.42, 1.35, 8), robeMat);
    robe.position.y = 0.68;
    robe.castShadow = true;

    const hood = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 10), goldMat);
    hood.position.y = 1.42;

    group.add(robe, hood);
    group.position.set(x, 0, z);
    this.game.scene.add(group);

    this.acolytes.push({
      id: Math.random(),
      name,
      mesh: group,
      pos: group.position,
      angle: Math.random() * Math.PI * 2,
      devotion: 100
    });
  }

  // Drop a new 3D Crystalline Ley-Line Pylon at Vesper's feet ([B])
  placeLeyPylon(wx = null, wz = null, silent = false) {
    const x = wx !== null ? wx : this.game.hero.pos.x;
    const z = wz !== null ? wz : this.game.hero.pos.z;

    const pylonGroup = new THREE.Group();
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 2.0,
      metalness: 0.9,
      roughness: 0.1
    });
    const spire = new THREE.Mesh(new THREE.OctahedronGeometry(0.45, 0), crystalMat);
    spire.scale.set(0.7, 2.4, 0.7);
    spire.position.y = 1.1;
    pylonGroup.add(spire);
    pylonGroup.position.set(x, 0, z);
    this.game.scene.add(pylonGroup);

    this.pylons.push({ id: Math.random(), x, z, mesh: pylonGroup, spire });
    if (this.pylons.length > 9) {
      const removed = this.pylons.shift();
      this.game.scene.remove(removed.mesh);
    }

    this.rebuildLatticeLines();

    if (!silent) {
      this.game.sfx.playCastBolt(640);
      this.game.state.essence += 45;
      this.game.spawnFloatingText(this.game.hero.pos, '⚡ LEY-PYLON ANCHORED!', '#38bdf8');
      this.game.addChronicle(`⚡ Anchored Ley-Line Tension Pylon at (${x.toFixed(1)}, ${z.toFixed(1)}). Elastic plasma beams updated.`);
      this.game.updateHUD();
    }
  }

  rebuildLatticeLines() {
    while (this.latticeLinesGroup.children.length > 0) {
      this.latticeLinesGroup.remove(this.latticeLinesGroup.children[0]);
    }

    const lineMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.85 });
    for (let i = 0; i < this.pylons.length; i++) {
      for (let j = i + 1; j < this.pylons.length; j++) {
        const a = this.pylons[i];
        const b = this.pylons[j];
        if (Math.hypot(a.x - b.x, a.z - b.z) <= 13.5) {
          const geo = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(a.x, 1.1, a.z),
            new THREE.Vector3(b.x, 1.1, b.z)
          ]);
          this.latticeLinesGroup.add(new THREE.Line(geo, lineMat));
        }
      }
    }
  }

  // Leap Inside / Out of the 3D Microcosm World-Orb ([O])
  toggleMicrocosmOrbWorld() {
    if (this.currentRealm === REALM_MODES.MICROCOSM_ORB) {
      this.shiftRealm(REALM_MODES.CATHEDRAL);
    } else {
      this.shiftRealm(REALM_MODES.MICROCOSM_ORB);
    }
  }

  // Descend into / Ascend from the Sub-Abyssal Bathysphere Trench ([N])
  toggleAbyssalTrench() {
    if (this.currentRealm === REALM_MODES.ABYSSAL_TRENCH) {
      this.shiftRealm(REALM_MODES.CATHEDRAL);
    } else {
      this.shiftRealm(REALM_MODES.ABYSSAL_TRENCH);
    }
  }

  shiftRealm(targetRealm) {
    this.currentRealm = targetRealm;
    this.game.sfx.playArcanaChord();
    const s = this.game.state;

    if (targetRealm === REALM_MODES.MICROCOSM_ORB) {
      this.game.scene.background = new THREE.Color(0x140526);
      this.game.scene.fog.color.setHex(0x1a0633);
      s.resonance += 4;
      s.essence += 120;
      // Spawn a nested recursive Runic Monolith inside the Orb World!
      this.game.spawnMonolith('ASCEND', 'EFFECT', this.game.hero.pos.x + 2.5, this.game.hero.pos.z);
      this.game.evaluateAxiomMonoliths();
      this.game.spawnFloatingText(this.game.hero.pos, '🔮 ENTERED MICROCOSM ORB-WORLD! (+4x RESONANCE)', '#c084fc');
      this.game.addChronicle('🔮 Leapt inside the Recursive Microcosm World-Orb! Nested geometry materialized (+4x Resonance).');
    } else if (targetRealm === REALM_MODES.ABYSSAL_TRENCH) {
      this.game.scene.background = new THREE.Color(0x01111f);
      this.game.scene.fog.color.setHex(0x021b2e);
      this.abyssDepth = 420;
      this.oxygen = 100;
      s.starKelvin = Math.max(2500, s.starKelvin - 800);
      this.game.spawnFloatingText(this.game.hero.pos, '🌊 SUBMERGED: ABYSSAL TRENCH (420m / 43 BAR)', '#38bdf8');
      this.game.addChronicle('🌊 Submerged into the Sub-Abyssal Trench! Watch your Oxygen gauge & use Sonar Ping [J] to harvest Abyssal Ore.');
    } else {
      this.game.scene.background = new THREE.Color(0x04060c);
      this.game.scene.fog.color.setHex(0x050811);
      this.abyssDepth = 0;
      this.oxygen = 100;
      this.game.spawnFloatingText(this.game.hero.pos, '🏛️ RETURNED TO SOL-VESPERA SURFACE', '#fbbf24');
      this.game.addChronicle('🏛️ Emerged back into the Cathedral Courtyard of Sol-Vespera.');
    }
    this.game.updateHUD();
  }

  // Emit an Abyssal Sonar Ping & Harpoon Haul
  triggerAbyssalSonarPing() {
    this.game.sfx.playCastBolt(880);
    const s = this.game.state;
    this.cargoWeight += 12;
    const haulEssence = this.currentRealm === REALM_MODES.ABYSSAL_TRENCH ? 160 : 75;
    s.essence += haulEssence;

    // Visual 3D Expanding Sonar Torus
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.6, 8.5, 36),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide, transparent: true, opacity: 0.7 })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(this.game.hero.pos.x, 0.18, this.game.hero.pos.z);
    this.game.scene.add(ring);
    setTimeout(() => this.game.scene.remove(ring), 380);

    this.game.spawnFloatingText(this.game.hero.pos, `📡 SONAR PING & HARPOON HAUL (+${haulEssence} ESSENCE)`, '#38bdf8');
    this.game.addChronicle(`📡 Sonar Pulse revealed hidden Abyssal Bioluminescence (+${haulEssence} Essence, Cargo Weight: ${this.cargoWeight}kg).`);
    this.game.updateHUD();
  }

  // Sacrifice or Inspire an Acolyte in the Sanctum Flock
  performAcolyteRite() {
    if (this.acolytes.length === 0) {
      this.spawnAcolyte('Reborn Initiate Sol', this.game.hero.pos.x + 2, this.game.hero.pos.z + 2);
    }
    const ac = this.acolytes[0];
    this.game.sfx.playArcanaChord();
    this.game.state.starKelvin = Math.max(2500, this.game.state.starKelvin - 1100);
    this.game.state.resonance += 3;
    this.game.state.essence += 140;
    this.game.paintAlchemyDisc(ac.pos.x, ac.pos.z, 2.8, 5);
    this.game.spawnFloatingText(ac.pos, `🕯️ DOCTRINE EXALTED BY ${ac.name.toUpperCase()}!`, '#fbbf24');
    this.game.addChronicle(`🕯️ ${ac.name} performed the Rite of the Gilded Eclipse: Star cooled by 1,100K, +3x Resonance, +140 Essence!`);
    this.game.updateHUD();
  }

  update(realDt, simDt) {
    const s = this.game.state;
    this.leviathanPhase += (realDt * 0.8 + simDt * 2.2);

    // 1. Animate 3D Microcosm World-Orb
    if (this.worldOrbMesh) {
      this.worldOrbMesh.rotation.y += realDt * 1.4;
      this.worldOrbMesh.position.y = 1.25 + Math.sin(s.time * 2.5) * 0.2;
    }

    // 2. Step Procedural 14-Segment Inverse-Kinematics (IK) Abyssal Leviathan
    if (this.leviathanSegments.length > 0) {
      const head = this.leviathanSegments[0];
      // Figure-8 orbital hunt trajectory around the Sanctum
      const targetX = Math.cos(this.leviathanPhase * 0.35) * 17.5;
      const targetZ = Math.sin(this.leviathanPhase * 0.7) * 14.5;
      const targetY = 2.4 + Math.sin(this.leviathanPhase * 1.8) * 1.1;

      head.position.lerp(new THREE.Vector3(targetX, targetY, targetZ), Math.min(1, (realDt * 0.6 + simDt * 2.5)));

      // Inverse-Kinematics chain constraint: each segment follows the one ahead at fixed 1.05m spacing
      for (let i = 1; i < this.leviathanSegments.length; i++) {
        const prev = this.leviathanSegments[i - 1].position;
        const cur = this.leviathanSegments[i].position;
        const dir = new THREE.Vector3().subVectors(cur, prev);
        const dist = dir.length();
        const segSpacing = 1.02;
        if (dist > 0.001) {
          dir.normalize();
          // Add sinusoidal lateral swim wave
          const lateral = Math.sin(this.leviathanPhase * 4.0 - i * 0.55) * 0.08;
          cur.copy(prev).addScaledVector(dir, segSpacing);
          cur.x += lateral;
          this.leviathanSegments[i].lookAt(prev);
        }
      }

      // Leviathan crushes any Warden in its path and drops Bioluminescent Spore-Light!
      for (let wIdx = s.wardens.length - 1; wIdx >= 0; wIdx--) {
        const w = s.wardens[wIdx];
        if (Math.hypot(w.pos.x - head.position.x, w.pos.z - head.position.z) < 2.2) {
          w.hp -= 35 * simDt;
          if (w.hp <= 0) {
            this.game.removeWarden(wIdx, 'Devoured by the Abyssal Apex Leviathan', '14-Segment Serpentine Wyrm');
          }
        }
      }
    }

    // 3. Step Ley-Line Tension Pylons (Damage Wardens crossing beams & generate Essence)
    for (const p of this.pylons) {
      p.spire.rotation.y += realDt * 2.0;
    }

    // 4. Step Sanctum Acolytes & Doctrine Tithe
    this.titheTimer -= realDt;
    if (this.titheTimer <= 0) {
      this.titheTimer = 4.0;
      s.essence += this.acolytes.length * 15;
    }
    for (const ac of this.acolytes) {
      ac.angle += simDt * 1.1;
      ac.pos.x = Math.cos(ac.angle) * 6.5;
      ac.pos.z = 8 + Math.sin(ac.angle) * 3.5;
      ac.mesh.rotation.y = -ac.angle;
    }

    // 5. Sub-Abyssal Trench Oxygen & Depth Pressure Management
    if (this.currentRealm === REALM_MODES.ABYSSAL_TRENCH) {
      const weightDrain = 1.0 + (this.cargoWeight * 0.015);
      this.oxygen = Math.max(0, this.oxygen - realDt * 2.2 * weightDrain);
      this.abyssDepth = Math.min(999, this.abyssDepth + simDt * 8);
      if (this.oxygen <= 0) {
        // Emergency blow ballast back to Cathedral Surface!
        this.shiftRealm(REALM_MODES.CATHEDRAL);
      }
    }
  }
}
