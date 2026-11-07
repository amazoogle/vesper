// ============================================================================
// VESPER: THE GILDED ECLIPSE
// Custom Procedural 3D Models & Articulated Character Rigging
// - Vesper (Articulated Chronomancer Knight with Cape, Hood, Pauldrons, Staff, Hammer)
// - Seraph Automaton Wardens (Articulated Brass & Obsidian Guardians with Halos)
// - House of Ash NPCs (Soren the Blind Astrolaber, Lady Nyxara, Magistrate Vane)
// - 3D Hades-Style Exit Gates & Physical Boon Altars
// - Runic Axiom Monoliths, Glowing Triad Target Sockets & Cathedral Pillars
// - 3D Aether Grapple Anchors & Holographic Phantom Time-Echo Twin
// - 3D Subterranean Geode Spikes, Astral Polyomino Sigil Tiles & Detached Crown Orb
// - 3D Spatial Rift-Portals, Black-Sun Gravity Singularity & Cadence Pulse Rings
// - 3D Astral Fusion Spheres, GildedFate Dice & Prism Mirror Obelisks
// ============================================================================

import * as THREE from 'three';

function createRuneTexture(word, category) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createRadialGradient(128, 128, 16, 128, 128, 130);
  if (category === 'SUBJECT') {
    grad.addColorStop(0, '#1e1b4b');
    grad.addColorStop(1, '#090a10');
  } else if (category === 'VERB') {
    grad.addColorStop(0, '#064e3b');
    grad.addColorStop(1, '#090a10');
  } else {
    grad.addColorStop(0, '#4c0519');
    grad.addColorStop(1, '#090a10');
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  ctx.strokeStyle = category === 'SUBJECT' ? '#818cf8' : (category === 'VERB' ? '#34d399' : '#fbbf24');
  ctx.lineWidth = 8;
  ctx.strokeRect(12, 12, 232, 232);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(128, 128, 92, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = ctx.strokeStyle;
  ctx.shadowBlur = 18;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const glyphs = {
    WARDEN: '⚔',
    PILLAR: '🏛',
    FLAME: '🜂',
    VESPER: '☽',
    IS: '⟐',
    BREEDS: '☥',
    GOLD: '☉',
    VOLATILE: '✹',
    ALLY: '✧',
    ASCEND: '👑',
    FRAGILE: '⛨',
    RESONANT: '❖'
  };

  ctx.font = 'bold 64px serif';
  ctx.fillText(glyphs[word] || '◈', 128, 98);

  ctx.font = 'bold 30px Cinzel, Georgia, serif';
  ctx.fillText(word, 128, 178);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

export const ModelFactory = {
  // 1. HERO MODEL: VESPER, THE ASHEN CHRONOMANCER
  createVesperHero() {
    const root = new THREE.Group();

    const armorMat = new THREE.MeshStandardMaterial({
      color: 0x1e2436,
      metalness: 0.78,
      roughness: 0.28
    });
    const goldTrimMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.92,
      roughness: 0.18,
      emissive: 0x451a03,
      emissiveIntensity: 0.35
    });
    const cloakMat = new THREE.MeshStandardMaterial({
      color: 0x7f1d1d,
      roughness: 0.65,
      metalness: 0.15,
      side: THREE.DoubleSide
    });
    const glowCyanMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 2.2
    });

    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.24, 0.95, 8), armorMat);
    torso.position.y = 1.15;
    torso.castShadow = true;
    root.add(torso);

    const crest = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.03, 8, 20), goldTrimMat);
    crest.position.set(0, 1.25, 0.31);
    root.add(crest);

    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.82, 0);
    const hood = new THREE.Mesh(new THREE.ConeGeometry(0.32, 0.55, 8), cloakMat);
    hood.position.y = 0.08;
    hood.castShadow = true;
    headGroup.add(hood);

    const faceMask = new THREE.Mesh(new THREE.SphereGeometry(0.21, 12, 12), armorMat);
    headGroup.add(faceMask);

    const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), glowCyanMat);
    leftEye.position.set(-0.08, 0.02, 0.18);
    const rightEye = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), glowCyanMat);
    rightEye.position.set(0.08, 0.02, 0.18);
    headGroup.add(leftEye, rightEye);

    const halo = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.022, 8, 32), goldTrimMat);
    halo.position.set(0, 0.08, -0.14);
    headGroup.add(halo);
    root.add(headGroup);

    const leftPauldron = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 10, 0, Math.PI * 2, 0, Math.PI * 0.6), goldTrimMat);
    leftPauldron.position.set(-0.42, 1.48, 0);
    leftPauldron.rotation.z = 0.35;
    const rightPauldron = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 10, 0, Math.PI * 2, 0, Math.PI * 0.6), goldTrimMat);
    rightPauldron.position.set(0.42, 1.48, 0);
    rightPauldron.rotation.z = -0.35;
    root.add(leftPauldron, rightPauldron);

    const capeGeo = new THREE.PlaneGeometry(0.75, 1.35, 4, 6);
    const cape = new THREE.Mesh(capeGeo, cloakMat);
    cape.position.set(0, 0.92, -0.28);
    cape.rotation.x = 0.18;
    cape.castShadow = true;
    root.add(cape);

    const rightArm = new THREE.Group();
    rightArm.position.set(0.45, 1.42, 0);
    const armMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.65, 8), armorMat);
    armMesh.position.y = -0.25;
    rightArm.add(armMesh);

    const staffGroup = new THREE.Group();
    staffGroup.position.set(0, -0.45, 0.25);
    staffGroup.rotation.x = Math.PI * 0.38;
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.035, 1.9, 8), goldTrimMat);
    staffGroup.add(shaft);
    const staffRing = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.025, 8, 24), goldTrimMat);
    staffRing.position.y = 0.95;
    staffGroup.add(staffRing);
    const staffCore = new THREE.Mesh(new THREE.OctahedronGeometry(0.11, 0), glowCyanMat);
    staffCore.position.y = 0.95;
    staffGroup.add(staffCore);
    rightArm.add(staffGroup);
    root.add(rightArm);

    const leftArm = new THREE.Group();
    leftArm.position.set(-0.45, 1.42, 0);
    const leftArmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.65, 8), armorMat);
    leftArmMesh.position.y = -0.25;
    leftArm.add(leftArmMesh);

    const hammerGroup = new THREE.Group();
    hammerGroup.position.set(0, -0.45, 0.2);
    hammerGroup.rotation.x = Math.PI * 0.4;
    const hammerHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.2, 8), armorMat);
    const hammerHead = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.22, 0.52), goldTrimMat);
    hammerHead.position.y = 0.55;
    hammerGroup.add(hammerHandle, hammerHead);
    leftArm.add(hammerGroup);
    root.add(leftArm);

    // 3D Solar Aegis Parry Shield (hidden until [C] is triggered)
    const aegisMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      emissive: 0xf59e0b,
      emissiveIntensity: 2.2,
      wireframe: true,
      transparent: true,
      opacity: 0.0
    });
    const aegisSphere = new THREE.Mesh(new THREE.IcosahedronGeometry(1.55, 1), aegisMat);
    aegisSphere.position.y = 1.15;
    root.add(aegisSphere);

    const orbitalGroup = new THREE.Group();
    orbitalGroup.position.y = 1.1;
    root.add(orbitalGroup);

    root.userData = {
      headGroup,
      rightArm,
      leftArm,
      cape,
      halo,
      staffCore,
      aegisSphere,
      aegisMat,
      orbitalGroup,
      walkCycle: 0,
      swingTimer: 0
    };

    return root;
  },

  // 2. HOUSE OF ASH NPC MODEL (Soren, Nyxara, Vane)
  createNPCModel(colorHex = '#fbbf24') {
    const group = new THREE.Group();
    const col = new THREE.Color(colorHex);

    const robeMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.6,
      metalness: 0.3
    });
    const trimMat = new THREE.MeshStandardMaterial({
      color: col,
      emissive: col,
      emissiveIntensity: 0.65,
      metalness: 0.85,
      roughness: 0.2
    });

    const robe = new THREE.Mesh(new THREE.ConeGeometry(0.55, 1.75, 8), robeMat);
    robe.position.y = 0.88;
    robe.castShadow = true;
    group.add(robe);

    const mantle = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.04, 8, 24), trimMat);
    mantle.rotation.x = Math.PI / 2;
    mantle.position.y = 1.45;
    group.add(mantle);

    const head = new THREE.Mesh(new THREE.OctahedronGeometry(0.26, 1), trimMat);
    head.position.y = 1.98;
    group.add(head);

    const crown = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.025, 8, 24), trimMat);
    crown.position.set(0, 2.15, -0.1);
    group.add(crown);

    const auraRing = new THREE.Mesh(
      new THREE.RingGeometry(1.1, 1.25, 32),
      new THREE.MeshBasicMaterial({ color: col, side: THREE.DoubleSide, transparent: true, opacity: 0.55 })
    );
    auraRing.rotation.x = -Math.PI / 2;
    auraRing.position.y = 0.04;
    group.add(auraRing);

    group.userData = { crown, head, auraRing };
    return group;
  },

  // 3. HADES-STYLE 3D CHAMBER EXIT GATE (Glowing Archway with Reward Orb)
  createExitGate(colorHex = 0xf59e0b) {
    const group = new THREE.Group();
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5, metalness: 0.4 });
    const glowMat = new THREE.MeshStandardMaterial({
      color: colorHex,
      emissive: colorHex,
      emissiveIntensity: 1.8,
      metalness: 0.8,
      roughness: 0.2
    });

    const leftCol = new THREE.Mesh(new THREE.BoxGeometry(0.6, 3.8, 0.6), stoneMat);
    leftCol.position.set(-1.5, 1.9, 0);
    leftCol.castShadow = true;
    const rightCol = new THREE.Mesh(new THREE.BoxGeometry(0.6, 3.8, 0.6), stoneMat);
    rightCol.position.set(1.5, 1.9, 0);
    rightCol.castShadow = true;

    const lintel = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.6, 0.8), stoneMat);
    lintel.position.set(0, 3.9, 0);

    const orb = new THREE.Mesh(new THREE.OctahedronGeometry(0.55, 0), glowMat);
    orb.position.set(0, 2.0, 0);

    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.25, 0.06, 10, 32), glowMat);
    ring.position.set(0, 2.0, 0);

    const pad = new THREE.Mesh(
      new THREE.RingGeometry(1.2, 1.6, 32),
      new THREE.MeshBasicMaterial({ color: colorHex, side: THREE.DoubleSide, transparent: true, opacity: 0.75 })
    );
    pad.rotation.x = -Math.PI / 2;
    pad.position.y = 0.05;

    group.add(leftCol, rightCol, lintel, orb, ring, pad);
    group.userData = { orb, ring, pad, glowMat };
    return group;
  },

  // 4. ENEMY MODEL: SERAPH AUTOMATON WARDEN
  createWardenEnemy(variant = 0) {
    const group = new THREE.Group();

    const bodyMat = new THREE.MeshStandardMaterial({
      color: variant === 1 ? 0x3b0764 : 0x27272a,
      metalness: 0.85,
      roughness: 0.22
    });
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.9,
      roughness: 0.2
    });
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      emissive: 0xe11d48,
      emissiveIntensity: 2.5
    });

    const spire = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.8, 6), bodyMat);
    spire.rotation.x = Math.PI;
    spire.position.y = 0.65;
    spire.castShadow = true;
    group.add(spire);

    const chest = new THREE.Mesh(new THREE.OctahedronGeometry(0.55, 1), bodyMat);
    chest.scale.set(1.1, 1.25, 0.75);
    chest.position.y = 1.45;
    chest.castShadow = true;
    group.add(chest);

    const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.22, 0), coreMat);
    core.position.set(0, 1.45, 0.32);
    group.add(core);

    const head = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.45, 6), brassMat);
    head.position.y = 2.15;
    group.add(head);

    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.04, 8, 24), brassMat);
    ring.position.y = 1.55;
    group.add(ring);

    const leftBlade = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.35, 0.28), brassMat);
    leftBlade.position.set(-0.72, 1.4, 0.25);
    const rightBlade = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.35, 0.28), brassMat);
    rightBlade.position.set(0.72, 1.4, 0.25);
    group.add(leftBlade, rightBlade);

    group.userData = { ring, core, coreMat, leftBlade, rightBlade, chest };
    return group;
  },

  // 5. RUNIC AXIOM MONOLITH
  createAxiomMonolith(word, category) {
    const group = new THREE.Group();
    const tex = createRuneTexture(word, category);
    const borderColor = category === 'SUBJECT' ? 0x6366f1 : (category === 'VERB' ? 0x10b981 : 0xf59e0b);

    const mat = new THREE.MeshStandardMaterial({
      map: tex,
      roughness: 0.3,
      metalness: 0.5,
      emissive: borderColor,
      emissiveIntensity: 0.22
    });

    const block = new THREE.Mesh(new THREE.BoxGeometry(1.55, 1.85, 1.55), mat);
    block.position.y = 0.95;
    block.castShadow = true;
    block.receiveShadow = true;
    group.add(block);

    const capMat = new THREE.MeshStandardMaterial({
      color: borderColor,
      metalness: 0.85,
      roughness: 0.15,
      emissive: borderColor,
      emissiveIntensity: 0.6
    });
    const cap = new THREE.Mesh(new THREE.ConeGeometry(0.95, 0.55, 4), capMat);
    cap.position.y = 2.18;
    cap.rotation.y = Math.PI * 0.25;
    group.add(cap);

    group.userData = { block, cap, word, category };
    return group;
  },

  // 6. DESTRUCTIBLE / CRACKED STONE PILLAR
  createCathedralPillar() {
    const group = new THREE.Group();
    const stoneMat = new THREE.MeshStandardMaterial({
      color: 0x262f45,
      roughness: 0.6,
      metalness: 0.25
    });
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      emissive: 0x78350f,
      emissiveIntensity: 0.4,
      metalness: 0.85,
      roughness: 0.25
    });

    const base = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.45, 1.6), stoneMat);
    base.position.y = 0.22;
    base.castShadow = true;
    base.receiveShadow = true;

    const column = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.68, 3.2, 8), stoneMat);
    column.position.y = 1.85;
    column.castShadow = true;
    column.receiveShadow = true;

    const faultRing = new THREE.Mesh(new THREE.TorusGeometry(0.65, 0.045, 8, 20), goldMat);
    faultRing.rotation.x = Math.PI / 2;
    faultRing.position.y = 1.4;

    const capital = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.4, 1.55), goldMat);
    capital.position.y = 3.55;
    capital.castShadow = true;

    group.add(base, column, faultRing, capital);
    return group;
  },

  // 7. ECLIPSE BRAZIER
  createBrazier() {
    const group = new THREE.Group();
    const ironMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, metalness: 0.8, roughness: 0.35 });
    const fireMat = new THREE.MeshStandardMaterial({
      color: 0xff6b00,
      emissive: 0xff4500,
      emissiveIntensity: 3.0
    });

    const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.75, 1.1, 8), ironMat);
    stand.position.y = 0.55;
    stand.castShadow = true;

    const flame = new THREE.Mesh(new THREE.DodecahedronGeometry(0.45, 0), fireMat);
    flame.position.y = 1.35;

    group.add(stand, flame);
    group.userData = { flame };
    return group;
  },

  // 8. 3D AETHER GRAPPLE ANCHOR PYLON (Chamber VII: Chasm of Chains)
  createGrappleAnchor() {
    const group = new THREE.Group();
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xb45309, metalness: 0.88, roughness: 0.2 });
    const cyanGlowMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 2.6,
      metalness: 0.7,
      roughness: 0.15
    });

    const plinth = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.65, 1.6, 6), brassMat);
    plinth.position.y = 0.8;
    plinth.castShadow = true;
    group.add(plinth);

    const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.42, 0), cyanGlowMat);
    crystal.position.y = 2.15;
    group.add(crystal);

    const halo = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.04, 8, 24), cyanGlowMat);
    halo.position.y = 2.15;
    group.add(halo);

    const pad = new THREE.Mesh(
      new THREE.RingGeometry(0.85, 1.15, 24),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide, transparent: true, opacity: 0.7 })
    );
    pad.rotation.x = -Math.PI / 2;
    pad.position.y = 0.05;
    group.add(pad);

    group.userData = { crystal, halo };
    return group;
  },

  // 9. 3D HOLOGRAPHIC PHANTOM TIME-ECHO TWIN (Chamber IX: Hall of Convergent Selves)
  createPhantomTwin() {
    const twin = this.createVesperHero();
    const holoMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 1.6,
      transparent: true,
      opacity: 0.65,
      wireframe: false
    });
    twin.traverse((child) => {
      if (child.isMesh && child !== twin.userData.aegisSphere) {
        child.material = holoMat;
      }
    });
    return twin;
  },

  // 10. 3D SUBTERRANEAN GEODE SPIKE ERUPTION (Chamber X: The Hollowed Catacombs)
  createGeodeEruption() {
    const group = new THREE.Group();
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0xc084fc,
      emissive: 0x9333ea,
      emissiveIntensity: 2.2,
      metalness: 0.75,
      roughness: 0.15
    });

    for (let i = 0; i < 6; i++) {
      const ang = (i / 6) * Math.PI * 2;
      const spike = new THREE.Mesh(new THREE.ConeGeometry(0.38, 2.3, 5), crystalMat);
      spike.position.set(Math.cos(ang) * 0.9, 1.0, Math.sin(ang) * 0.9);
      spike.rotation.z = -Math.cos(ang) * 0.35;
      spike.rotation.x = Math.sin(ang) * 0.35;
      group.add(spike);
    }
    const centerSpike = new THREE.Mesh(new THREE.ConeGeometry(0.55, 2.9, 6), crystalMat);
    centerSpike.position.y = 1.35;
    group.add(centerSpike);

    return group;
  },

  // 11. 3D ASTRAL POLYOMINO SIGIL TILES (Chamber XI: The Moonsigil Scriptorium)
  createPolyominoSigilGroup(cells) {
    const group = new THREE.Group();
    const tileMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 1.7,
      metalness: 0.85,
      roughness: 0.2,
      transparent: true,
      opacity: 0.82
    });
    const borderMat = new THREE.MeshBasicMaterial({ color: 0xfde68a, wireframe: true });

    const tileSize = 2.1;
    for (const [cx, cz] of cells) {
      const slab = new THREE.Mesh(new THREE.BoxGeometry(tileSize * 0.92, 0.18, tileSize * 0.92), tileMat);
      slab.position.set(cx * tileSize, 0.09, cz * tileSize);
      const wire = new THREE.Mesh(new THREE.BoxGeometry(tileSize * 0.95, 0.2, tileSize * 0.95), borderMat);
      wire.position.copy(slab.position);
      group.add(slab, wire);
    }
    return group;
  },

  // 12. 3D DETACHED ASTRAL CROWN ORB (Chamber XII: Choir of the Detached Crown)
  createAstralCrownOrb() {
    const group = new THREE.Group();
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xfde68a,
      emissive: 0xf59e0b,
      emissiveIntensity: 2.5
    });
    const crownRing = new THREE.Mesh(new THREE.TorusGeometry(0.65, 0.08, 8, 24), goldMat);
    crownRing.rotation.x = Math.PI / 2;
    const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.38, 0), goldMat);
    group.add(crownRing, core);
    return group;
  },

  // 13. 3D SPATIAL RIFT-PORTAL ARCH (Chamber XIII: Gallery of Fractured Horizons)
  createRiftPortalArch(colorHex = 0xf59e0b) {
    const group = new THREE.Group();
    const portalMat = new THREE.MeshStandardMaterial({
      color: colorHex,
      emissive: colorHex,
      emissiveIntensity: 2.4,
      metalness: 0.85,
      roughness: 0.15
    });
    const outerRing = new THREE.Mesh(new THREE.TorusGeometry(1.35, 0.09, 10, 32), portalMat);
    outerRing.position.y = 1.45;
    const vortex = new THREE.Mesh(
      new THREE.CircleGeometry(1.25, 28),
      new THREE.MeshBasicMaterial({ color: colorHex, side: THREE.DoubleSide, transparent: true, opacity: 0.38 })
    );
    vortex.position.y = 1.45;
    const baseRing = new THREE.Mesh(
      new THREE.RingGeometry(1.1, 1.45, 32),
      new THREE.MeshBasicMaterial({ color: colorHex, side: THREE.DoubleSide, transparent: true, opacity: 0.75 })
    );
    baseRing.rotation.x = -Math.PI / 2;
    baseRing.position.y = 0.05;
    group.add(outerRing, vortex, baseRing);
    group.userData = { outerRing, vortex };
    return group;
  },

  // 14. 3D BLACK-SUN GRAVITY SINGULARITY WELL (Chamber XIV: The Inverted Planetarium)
  createGravitySingularity() {
    const group = new THREE.Group();
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x05050a,
      emissive: 0x4c1d95,
      emissiveIntensity: 1.8,
      roughness: 0.1,
      metalness: 0.95
    });
    const horizonMat = new THREE.MeshStandardMaterial({
      color: 0xc084fc,
      emissive: 0x9333ea,
      emissiveIntensity: 2.6,
      wireframe: true
    });
    const blackSphere = new THREE.Mesh(new THREE.SphereGeometry(0.85, 24, 24), coreMat);
    blackSphere.position.y = 1.6;
    const disk1 = new THREE.Mesh(new THREE.TorusGeometry(2.1, 0.08, 10, 40), horizonMat);
    disk1.rotation.x = Math.PI / 2.3;
    disk1.position.y = 1.6;
    const disk2 = new THREE.Mesh(
      new THREE.RingGeometry(1.8, 5.2, 36),
      new THREE.MeshBasicMaterial({ color: 0xa855f7, side: THREE.DoubleSide, transparent: true, opacity: 0.26 })
    );
    disk2.rotation.x = -Math.PI / 2;
    disk2.position.y = 0.06;
    group.add(blackSphere, disk1, disk2);
    group.userData = { disk1, disk2 };
    return group;
  },

  // 15. 3D ASTRAL FUSION SPHERE (Chamber XVI: Crucible of Convergent Spheres — Tier 1/2/3 Merge)
  createFusionSphere(tier = 1) {
    const group = new THREE.Group();
    const colors = { 1: 0x38bdf8, 2: 0xf59e0b, 3: 0xf43f5e };
    const radii = { 1: 0.48, 2: 0.86, 3: 1.38 };
    const col = colors[tier] || 0x38bdf8;
    const rad = radii[tier] || 0.48;

    const coreMat = new THREE.MeshStandardMaterial({
      color: col,
      emissive: col,
      emissiveIntensity: 1.8 + tier * 0.4,
      metalness: 0.85,
      roughness: 0.15
    });
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(rad, 20, 20), coreMat);
    sphere.position.y = rad + 0.15;

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(rad * 1.32, 0.05, 8, 28),
      new THREE.MeshBasicMaterial({ color: 0xfde68a, wireframe: true })
    );
    ring.rotation.x = Math.PI / 2.4;
    ring.position.y = rad + 0.15;

    group.add(sphere, ring);
    group.userData = { sphere, ring, tier };
    return group;
  },

  // 16. 3D GILDED FATE DIE (Chamber XVII: The Gilded Dice Reliquary)
  createFateDie(pipValue = 6) {
    const group = new THREE.Group();
    const dieMat = new THREE.MeshStandardMaterial({
      color: 0x1e1b4b,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.55,
      metalness: 0.85,
      roughness: 0.2
    });
    const edgeMat = new THREE.MeshBasicMaterial({ color: 0xfde68a, wireframe: true });

    const cube = new THREE.Mesh(new THREE.BoxGeometry(1.15, 1.15, 1.15), dieMat);
    cube.position.y = 0.85;
    cube.castShadow = true;

    const wire = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 1.2), edgeMat);
    wire.position.y = 0.85;

    const core = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.42, 0),
      new THREE.MeshBasicMaterial({ color: pipValue >= 5 ? 0xfbbf24 : 0x38bdf8 })
    );
    core.position.y = 1.75;

    group.add(cube, wire, core);
    group.userData = { cube, wire, core, pipValue };
    return group;
  },

  // 17. 3D CRYSTALLINE PRISM MIRROR OBELISK (Chamber XVIII: Hall of Refracted Mirrors)
  createPrismMirror() {
    const group = new THREE.Group();
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0x67e8f9,
      emissive: 0x0284c7,
      emissiveIntensity: 2.1,
      metalness: 0.92,
      roughness: 0.08,
      transparent: true,
      opacity: 0.88
    });
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xb45309,
      emissiveIntensity: 0.9,
      metalness: 0.9,
      roughness: 0.2
    });

    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.95, 0.4, 6), goldMat);
    base.position.y = 0.2;

    const prism = new THREE.Mesh(new THREE.OctahedronGeometry(0.95, 0), crystalMat);
    prism.scale.set(0.85, 1.85, 0.85);
    prism.position.y = 1.85;
    prism.castShadow = true;

    const halo = new THREE.Mesh(new THREE.TorusGeometry(1.35, 0.05, 8, 28), goldMat);
    halo.rotation.x = Math.PI / 2;
    halo.position.y = 1.85;

    group.add(base, prism, halo);
    group.userData = { prism, halo };
    return group;
  }
};
