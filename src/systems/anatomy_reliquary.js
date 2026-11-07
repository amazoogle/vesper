// ============================================================================
// VESPER: THE GILDED ECLIPSE — SYSTEM II: SOMATIC ANATOMY MATRIX,
// SPATIAL RELIQUARY CARGO TETRIS, ASTROLABE POWER BUS & THE INQUISITOR'S CASE BOARD
// ============================================================================
// 1. 6-Limb Somatic Anatomy Matrix (Cranial Crown, Ocular Lens, Thoracic Heart,
//    Conduit Right Arm, Sledge Left Arm, Chrono-Greaves): Each limb has its own
//    Integrity %, Armor Plating, and splicable Trans-Human Grafts.
// 2. 6x4 Spatial Reliquary Grid (Polyomino Cargo Inventory): Relics occupy specific
//    2D tetromino shapes (L-Piece, T-Piece, 2x2 Cube, 1x3 Bar). Adjacent matching
//    aether-ports form Harmonic Circuits; taking Thoracic damage cracks specific
//    grid slots until repaired!
// 3. 4-Sub-System Astrolabe Reactor Bus (Aegis Wards, Solar Conduit, Cryo-Star
//    Siphon, Abyssal Airlocks) + Emergency Atmospheric Venting.
// 4. The Inquisitor's Case Board (Procedural Conspiracy String-Board): Every
//    Seraph Warden has a hidden Heresy Dossier (Sigil, Cipher Frequency, Sin).
//    Pinning 3 matching evidence nodes with red string exposes the Arch-Traitor!
// ============================================================================

export const ANATOMY_LIMBS = [
  { id: 'CRANIUM',  name: 'Cranial Crown',      integrity: 100, graft: 'Base Visor',        bonusDesc: 'Governs Humor Skill Checks & Tuner Bandwidth' },
  { id: 'OCULAR',   name: 'Ocular Astrolabe',   integrity: 100, graft: 'Star-Sight Lens',   bonusDesc: 'Reveals Warden Telegraph Vectors & Echo Trails' },
  { id: 'THORAX',   name: 'Thoracic Reliquary', integrity: 100, graft: 'Obsidian Cuirass',  bonusDesc: 'Houses the 6×4 Spatial Cargo Hold & Heart Core' },
  { id: 'ARM_R',    name: 'Conduit Right Arm',  integrity: 100, graft: 'Sun-Forged Gauntlet',bonusDesc: 'Modulates Solar Lance Velocity & Split Count' },
  { id: 'ARM_L',    name: 'Sledge Left Arm',    integrity: 100, graft: 'Pneumatic Tendon',  bonusDesc: 'Amplifies Memory Sledgehammer Shockwave Radius' },
  { id: 'GREAVES',  name: 'Chrono-Greaves',     integrity: 100, graft: 'Quicksilver Spurs', bonusDesc: 'Controls Phase-Dash Distance & Stillness Dilation' }
];

export const AVAILABLE_GRAFTS = [
  { limbId: 'CRANIUM', name: 'Third-Eye Oscilloscope',   multBonus: 3, desc: '+3x Resonance; Auto-locks nearest Harmonic Radio Band' },
  { limbId: 'OCULAR',  name: 'Prism-Refractor Cornea',   multBonus: 2, desc: 'Spatial Prism [V] duplicates +1 extra Runic Monolith' },
  { limbId: 'THORAX',  name: 'Gilded Furnace Ventricle', multBonus: 4, desc: '+4x Resonance; Blood Tribute costs 50% less Vitality' },
  { limbId: 'ARM_R',   name: 'Bifurcated Tendon Coil',   multBonus: 3, desc: '+1 extra Solar Lance projectile per Conduit cast' },
  { limbId: 'ARM_L',   name: 'Seismic Piston Knuckle',   multBonus: 3, desc: 'Sledgehammer [F] leaves a ring of Gilded Ichor on impact' },
  { limbId: 'GREAVES', name: 'Zero-Entropy Anklets',     multBonus: 3, desc: 'Phase-Dash [SHIFT] cools the Eclipse Star by 250K' }
];

// Polyomino Shapes for the 6x4 Spatial Reliquary Grid
export const RELIQUARY_ITEMS = [
  {
    id: 'ITEM_HOURGLASS',
    name: 'Ashen Hourglass',
    icon: '⏳',
    color: '#38bdf8',
    shape: [[0,0], [0,1]], // 1x2 Vertical Domino
    originX: 0,
    originY: 0,
    resonanceBonus: 3
  },
  {
    id: 'ITEM_ALEMBIC',
    name: 'Emerald Alembic',
    icon: '⚗️',
    color: '#10b981',
    shape: [[0,0], [1,0], [0,1]], // 3-cell L-Tromino
    originX: 1,
    originY: 0,
    resonanceBonus: 4
  },
  {
    id: 'ITEM_LEXICON',
    name: 'Lexicon of First Laws',
    icon: '📜',
    color: '#c084fc',
    shape: [[0,0], [1,0], [0,1], [1,1]], // 2x2 Square Tetromino
    originX: 3,
    originY: 0,
    resonanceBonus: 5
  },
  {
    id: 'ITEM_IDOL',
    name: 'Golden Sun-Idol',
    icon: '☉',
    color: '#f59e0b',
    shape: [[0,0], [1,0], [2,0]], // 3x1 Horizontal Bar
    originX: 0,
    originY: 2,
    resonanceBonus: 4
  },
  {
    id: 'ITEM_CHALICE',
    name: 'Crimson Sacramental Chalice',
    icon: '🍷',
    color: '#f43f5e',
    shape: [[0,0], [1,0], [1,1]], // 3-cell Corner
    originX: 3,
    originY: 2,
    resonanceBonus: 4
  }
];

export class AnatomyAndReliquarySystem {
  constructor(game) {
    this.game = game;
    this.limbs = ANATOMY_LIMBS.map(l => ({ ...l }));
    this.graftIndex = 0;

    // 6x4 Spatial Reliquary Matrix (width=6, height=4)
    this.gridW = 6;
    this.gridH = 4;
    this.items = RELIQUARY_ITEMS.map(item => ({ ...item, active: true }));
    this.crackedCells = new Set(); // e.g., "5,3" when hull/thorax takes heavy damage

    // 4-Bar Astrolabe Reactor Power Allocation
    this.reactor = {
      maxPower: 10,
      aegisWards: 2,     // Reduces incoming damage
      solarConduit: 3,   // Increases projectile & orbital blade speed
      cryoSiphon: 3,     // Passively drains Kelvin from the Eclipse Star
      abyssalLocks: 2    // Governs Atmospheric Vacuum Venting
    };
    this.vacuumVenting = false;
    this.vacuumTimer = 0;

    // The Inquisitor's Conspiracy Case Board
    this.suspectDossiers = [
      {
        name: 'Seraph Vael, the Gilded Inquisitor',
        sigil: 'Solar Ouroboros',
        cipherFreq: '108.4 MHz',
        heresy: 'Smuggled Liquid Vitriol into the High Choir',
        pinnedClues: 2,
        exposed: false
      },
      {
        name: 'Automaton Kaelen of the Ninth Choir',
        sigil: 'Broken Astrolabe',
        cipherFreq: '432.0 MHz',
        heresy: 'Sabotaged the Cryo-Spire Coolant Valves',
        pinnedClues: 1,
        exposed: false
      },
      {
        name: 'Castellan Morvath the Unbroken',
        sigil: 'Crimson Scale',
        cipherFreq: '666.6 MHz',
        heresy: 'Forged Paradox Writs in Magistrate Vane’s Name',
        pinnedClues: 1,
        exposed: false
      }
    ];
  }

  update(realDt, simDt) {
    const s = this.game.state;

    // Cryo-Siphon reactor power cools the Eclipse Star continuously
    s.starKelvin = Math.max(2500, s.starKelvin - this.reactor.cryoSiphon * simDt * 18);

    // Atmospheric Vacuum Venting
    if (this.vacuumVenting) {
      this.vacuumTimer -= realDt;
      if (Math.random() < 0.2) {
        for (const w of s.wardens) {
          w.hp -= 4;
          this.game.spawnFloatingText(w.pos, '🌬️ VACUUM ASPHYXIATION!', '#38bdf8');
        }
      }
      if (this.vacuumTimer <= 0) {
        this.vacuumVenting = false;
        this.game.addChronicle('🚪 Sanctum Airlocks re-pressurized.');
      }
    }
  }

  // Splice a new biomechanical graft onto one of Vesper's 6 anatomical limbs
  spliceNextBiomechanicalGraft() {
    const graft = AVAILABLE_GRAFTS[this.graftIndex % AVAILABLE_GRAFTS.length];
    this.graftIndex++;

    const limb = this.limbs.find(l => l.id === graft.limbId);
    if (limb) {
      limb.graft = graft.name;
      limb.integrity = 100;
    }

    this.game.state.resonance += graft.multBonus;
    this.game.state.essence += 75;
    this.game.sfx.playAxiomShift();
    this.game.spawnFloatingText(this.game.hero.pos, `🧬 GRAFT SPLICED: ${graft.name}!`, '#10b981');
    this.game.addChronicle(`🧬 Somatic Surgery: Spliced "${graft.name}" onto ${limb ? limb.name : graft.limbId} (${graft.desc}).`);
    this.game.updateHUD();
  }

  hasGraft(graftNamePart) {
    return this.limbs.some(l => l.graft.includes(graftNamePart));
  }

  // Damage a random limb & crack a slot in the 6x4 Reliquary Cargo Hold
  inflictSomaticTrauma(amount = 15) {
    const limb = this.limbs[Math.floor(Math.random() * this.limbs.length)];
    limb.integrity = Math.max(10, limb.integrity - amount);

    const cx = Math.floor(Math.random() * this.gridW);
    const cy = Math.floor(Math.random() * this.gridH);
    this.crackedCells.add(`${cx},${cy}`);
    this.game.psyche?.triggerHumorInterjection('MORTAL_COIL');
  }

  repairReliquaryAndLimbs() {
    this.crackedCells.clear();
    for (const l of this.limbs) l.integrity = 100;
    this.game.state.essence += 50;
    this.game.sfx.playArcanaChord();
    this.game.spawnFloatingText(this.game.hero.pos, '🛠️ RELIQUARY & LIMBS RESTORED!', '#fbbf24');
    this.game.addChronicle('🛠️ Sanctum Artificer repaired all cracked Reliquary slots and restored 100% Somatic Limb Integrity.');
    this.game.updateHUD();
  }

  // Cycle Astrolabe Reactor Power Bars
  cycleReactorSubsystem(key) {
    if (this.reactor[key] === undefined) return;
    this.reactor[key] = (this.reactor[key] % 5) + 1;
    this.game.sfx.playCastBolt(320 + this.reactor[key] * 90);
    this.game.addChronicle(`⚡ Astrolabe Reactor: Rerouted [${key}] to ${this.reactor[key]} Aether Bars.`);
    this.game.updateHUD();
  }

  ventSanctumAtmosphere() {
    if (this.vacuumVenting) return;
    this.vacuumVenting = true;
    this.vacuumTimer = 6.0;
    this.game.state.starKelvin = Math.max(2500, this.game.state.starKelvin - 600);
    this.game.sfx.playHammerSmash();
    this.game.spawnFloatingText(this.game.hero.pos, '🌬️ SANCTUM AIRLOCKS VENTED!', '#38bdf8');
    this.game.addChronicle('🌬️ Emergency Airlocks opened! Vacuum extinguishes Wildfire, cools the Star by 600K, and suffocates Wardens for 6s.');
    this.game.updateHUD();
  }

  // Connect a red-string evidence node on the Inquisitor's Conspiracy Case Board
  pinConspiracyEvidence(suspectIndex) {
    const d = this.suspectDossiers[suspectIndex];
    if (!d) return;
    d.pinnedClues++;
    this.game.sfx.playArcanaChord();

    if (d.pinnedClues >= 3 && !d.exposed) {
      d.exposed = true;
      this.game.state.essence += 280;
      this.game.state.resonance += 4;
      this.game.spawnFloatingText(this.game.hero.pos, `🕵️ ARCH-HERETIC EXPOSED: ${d.name}!`, '#f43f5e');
      this.game.addChronicle(`🕵️ Case Board Solved! Connected [Sigil: ${d.sigil}] ─── [Cipher: ${d.cipherFreq}] → Exposed ${d.name} (+280 Essence, +4x Resonance)!`);
    } else {
      this.game.state.essence += 45;
      this.game.addChronicle(`📌 Pinned red string to ${d.name}'s dossier (${d.pinnedClues}/3 clues linked).`);
    }
    this.game.updateHUD();
  }
}
