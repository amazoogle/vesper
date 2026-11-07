// ============================================================================
// VESPER: THE GILDED ECLIPSE — HADES-STYLE PROGRESSION & CHAMBER ARCHITECTURE
// ============================================================================
// Design Philosophy:
// 1. ZERO POPUP MODALS. Gameplay never stops for a wall of text or menu.
// 2. START CLEAN & TACTILE: In Chamber 0 (The House of Ash) & Chamber 1, only
//    Health, Dash, and your Basic Attack are visible. The HUD is ultra-clean.
// 3. ONE NEW MECHANIC PER CHAMBER, TAUGHT PURELY BY SPATIAL LEVEL DESIGN:
//    Each room has a bespoke 3D physical layout where solving/clearing the
//    room naturally requires using the newly awakened mechanic alongside your
//    existing repertoire.
// 4. HADES-STYLE 3D REWARD GATES & BOON ALTARS: Clearing a chamber ignites
//    two 3D Exit Gates at the north end of the room—walk through the gate you
//    want to seamlessly transition to the next chamber!
// ============================================================================

export const HOUSE_NPCS = [
  {
    id: 'SOREN',
    name: 'Soren, the Blind Astrolaber',
    title: 'Keeper of the House of Ash',
    color: '#fbbf24',
    pos: { x: -4.5, z: -2.0 },
    greetings: [
      '“Back from the ash, little Prince? The North Gate is unsealed. Strike the Wardens with your staff [Left-Click] and dash [Space/Shift] when their crimson sightlines lock onto you.”',
      '“Every chamber above us remembers a different law of the old world. Claim their Boons—and let your hands learn what my old eyes cannot.”',
      '“Notice how the dust hangs still when you stop moving? The Eclipse Star bends to your pulse. Stand still to read the room; move to strike.”'
    ]
  },
  {
    id: 'NYXARA',
    name: 'Lady Nyxara of the Loom',
    title: 'Patron of the Shattered Choir',
    color: '#c084fc',
    pos: { x: 4.5, z: -2.0 },
    greetings: [
      '“Do not fear the ascent, Vesper. Each chamber will awaken one dormant gift in your blood—first the Chrono-Stillness, then the Sledgehammer, then the Living Stone.”',
      '“When a chamber falls silent, two Astral Gates will ignite at its northern arch. Walk through the sigil whose Boon calls to you.”',
      '“Beyond the Celestial Observatory lies the Sovereign Reliquary: where Astral Spheres fuse into Supernovas [J], Fate Dice rewrite destiny [K], and Prism Mirrors chain Solar Lasers [L].”'
    ]
  },
  {
    id: 'VANE',
    name: 'Magistrate Vane',
    title: 'Arbiter of Paradoxes',
    color: '#38bdf8',
    pos: { x: 0, z: -5.2 },
    greetings: [
      '“No paperwork today, Vesper—only the trial of the courtyard. Step into the glowing Gate Ring to the North whenever you are ready to begin your run.”',
      '“Should two Runic Monoliths contradict one another in the upper chambers, strike the Paradox Seal in-world to bend the law in your favor.”'
    ]
  }
];

export const CHAMBERS = [
  // --------------------------------------------------------------------------
  // CHAMBER 0: THE HOUSE OF ASH (Sanctuary Hub)
  // --------------------------------------------------------------------------
  {
    index: 0,
    id: 'CHAMBER_HUB',
    title: 'The House of Ash',
    subtitle: 'Sanctuary Beneath the Eclipse',
    arenaRadius: 14,
    floorTint: 0x090d18,
    fogColor: 0x050811,
    unlocksMechanic: 'CORE_COMBAT',
    inWorldPrompt: 'Speak with Soren & Nyxara [E] · Step into the North Gate to begin your Escape',
    wardens: [],
    pillars: [[-7, -4], [7, -4], [-7, 4], [7, 4]],
    braziers: [[-3.5, -6], [3.5, -6]],
    monoliths: [],
    alchemyPools: []
  },

  // --------------------------------------------------------------------------
  // CHAMBER 1: COURTYARD OF FIRST BLOOD
  // --------------------------------------------------------------------------
  {
    index: 1,
    id: 'CHAMBER_1_SIGHTLINES',
    title: 'Chamber I · Courtyard of First Blood',
    subtitle: 'Evade the Crimson Sightlines · Strike the Wardens',
    arenaRadius: 15,
    floorTint: 0x0c1220,
    fogColor: 0x070b14,
    unlocksMechanic: 'CHRONO_STILLNESS',
    boonTitle: 'Aspect of Stillness Awakened',
    boonDesc: 'Stand still to slow time to 12% and read enemy laser vectors. Dash [Space / Shift] to phase through attacks.',
    inWorldPrompt: 'Stand still to slow time · Dash [Space] out of red laser sightlines · Defeat both Wardens',
    wardens: [
      { x: -5, z: -5, name: 'Vanguard Sentinel', hp: 70 },
      { x: 5,  z: -5, name: 'Vanguard Sentinel', hp: 70 }
    ],
    pillars: [[-4, 0], [4, 0]],
    braziers: [[-8, -6], [8, -6]],
    monoliths: [],
    alchemyPools: []
  },

  // --------------------------------------------------------------------------
  // CHAMBER 2: THE SEALED COLONNADE
  // --------------------------------------------------------------------------
  {
    index: 2,
    id: 'CHAMBER_2_SLEDGEHAMMER',
    title: 'Chamber II · The Sealed Colonnade',
    subtitle: 'Shatter the Stone Barrier & Disrupt Enemy Stances [F]',
    arenaRadius: 16,
    floorTint: 0x111526,
    fogColor: 0x080c18,
    unlocksMechanic: 'SLEDGEHAMMER',
    boonTitle: 'The Memory Sledgehammer [F]',
    boonDesc: 'Press [F] to swing your heavy Sledgehammer—shattering stone pillars into Gilded Ichor and knocking Wardens off their laser sightlines!',
    inWorldPrompt: 'Walk up to the Cracked Stone Wall & Press [F] to shatter it with your Sledgehammer!',
    wardens: [
      { x: -4, z: -7, name: 'Bulwark Warden', hp: 95 },
      { x: 0,  z: -8, name: 'Choir Arbiter',  hp: 95 },
      { x: 4,  z: -7, name: 'Bulwark Warden', hp: 95 }
    ],
    pillars: [[-6, -1], [-3, -1], [0, -1], [3, -1], [6, -1]],
    braziers: [[-9, -5], [9, -5]],
    monoliths: [],
    alchemyPools: []
  },

  // --------------------------------------------------------------------------
  // CHAMBER 3: THE ALCHEMICAL CRUCIBLE
  // --------------------------------------------------------------------------
  {
    index: 3,
    id: 'CHAMBER_3_ALCHEMY',
    title: 'Chamber III · The Alchemical Crucible',
    subtitle: 'Ignite the Spore Rings · Dissolve Armored Wardens in Vitriol',
    arenaRadius: 17,
    floorTint: 0x101a24,
    fogColor: 0x07121a,
    unlocksMechanic: 'ALCHEMY',
    boonTitle: 'Alchemical Resonance Awakened',
    boonDesc: 'Your Solar Lance now ignites Mycelium Spore-Rings into Wildfire, while green Vitriol pools melt heavy Warden armor on contact.',
    inWorldPrompt: 'Shoot the purple Spore pools to ignite Wildfire chain-reactions beneath the Wardens!',
    wardens: [
      { x: -6, z: -5, name: 'Crucible Myrmidon', hp: 120 },
      { x: 6,  z: -5, name: 'Crucible Myrmidon', hp: 120 },
      { x: 0,  z: -9, name: 'Alchemical Prelate', hp: 135 }
    ],
    pillars: [[-5, 2], [5, 2]],
    braziers: [[-6, -2], [6, -2]],
    monoliths: [],
    alchemyPools: [
      { x: -6, z: -5, radius: 3.6, matId: 4 },
      { x: 6,  z: -5, radius: 3.6, matId: 2 },
      { x: 0,  z: -9, radius: 3.8, matId: 4 },
      { x: 0,  z: 3,  radius: 3.0, matId: 3 }
    ]
  },

  // --------------------------------------------------------------------------
  // CHAMBER 4: HALL OF LIVING AXIOMS
  // --------------------------------------------------------------------------
  {
    index: 4,
    id: 'CHAMBER_4_MONOLITHS',
    title: 'Chamber IV · Hall of Living Axioms',
    subtitle: 'Push the [GOLD] Monolith into the Glowing Triad Socket',
    arenaRadius: 18,
    floorTint: 0x161129,
    fogColor: 0x0b0718,
    unlocksMechanic: 'MONOLITHS',
    boonTitle: 'Runic Monoliths of Creation',
    boonDesc: 'Carved 3D Monoliths hold the physical laws of the Sanctum. Push three into a row—like [WARDEN] [IS] [GOLD]—to rewrite reality on the spot!',
    inWorldPrompt: 'Walk into the [GOLD] Monolith to slide it beside [WARDEN] [IS]—or fight the Wardens head-on!',
    wardens: [
      { x: -6, z: -7, name: 'Immortal Seraph', hp: 220 },
      { x: 6,  z: -7, name: 'Immortal Seraph', hp: 220 },
      { x: 0,  z: -9, name: 'Grand Inquisitor Vael', hp: 260 }
    ],
    pillars: [[-8, -2], [8, -2]],
    braziers: [[-4, -6], [4, -6]],
    monoliths: [
      { word: 'WARDEN', category: 'SUBJECT', x: -2.2, z: 0 },
      { word: 'IS',     category: 'VERB',    x: 0.0,  z: 0 },
      { word: 'GOLD',   category: 'EFFECT',  x: 2.2,  z: 2.6 }
    ],
    alchemyPools: [
      { x: 0, z: -5, radius: 2.8, matId: 5 }
    ]
  },

  // --------------------------------------------------------------------------
  // CHAMBER 5: THE ASTRAL WEAVE & LASSO
  // --------------------------------------------------------------------------
  {
    index: 5,
    id: 'CHAMBER_5_LASSO_ARCANA',
    title: 'Chamber V · The Astral Observatory',
    subtitle: 'Right-Drag an Astral Circle to Snare Wardens · Press [Q] to Weave Arcana',
    arenaRadius: 19,
    floorTint: 0x0d1b2a,
    fogColor: 0x050e17,
    unlocksMechanic: 'LASSO_AND_ARCANA',
    boonTitle: 'Sigil of Encirclement & Tarot Arcana [Q]',
    boonDesc: 'Hold Right-Click and draw a 3D loop around Wardens to snare them in starlight, or press [Q] to unleash your drawn Tarot Arcana!',
    inWorldPrompt: 'Hold Right-Click & draw a circle around the Wardens, or press [Q] to cast your Tarot Arcana!',
    wardens: [
      { x: -5, z: -6, name: 'Astral Myrmidon', hp: 130 },
      { x: 0,  z: -5, name: 'Astral Myrmidon', hp: 130 },
      { x: 5,  z: -6, name: 'Star-Caller Kaelen', hp: 150 }
    ],
    pillars: [[-6, 1], [6, 1], [0, -10]],
    braziers: [[-8, -7], [8, -7]],
    monoliths: [
      { word: 'PILLAR',   category: 'SUBJECT', x: -6, z: -2 },
      { word: 'IS',       category: 'VERB',    x: -4, z: -2 },
      { word: 'VOLATILE', category: 'EFFECT',  x: -2, z: -2 }
    ],
    alchemyPools: [
      { x: -4, z: -6, radius: 3.0, matId: 3 },
      { x: 4,  z: -6, radius: 3.0, matId: 4 }
    ]
  },

  // --------------------------------------------------------------------------
  // CHAMBER 6: SANCTUM OF THE ECLIPSE THRONE
  // --------------------------------------------------------------------------
  {
    index: 6,
    id: 'CHAMBER_6_APEX_SANCTUM',
    title: 'Chamber VI · Sanctum of the Eclipse Throne',
    subtitle: 'Anchor Ley-Pylons [B] · Rewind Time [R] · Conquer the High Choir',
    arenaRadius: 20,
    floorTint: 0x1a0b1e,
    fogColor: 0x0f0514,
    unlocksMechanic: 'FULL_CONVERGENCE',
    boonTitle: 'Crown of the Chronomancer [B / R]',
    boonDesc: 'Drop high-voltage Ley-Line Pylons with [B] to string plasma beams across the arena, and hold [R] at any moment to rewind time!',
    inWorldPrompt: 'Drop Ley-Pylons [B] to electrify the arena · Hold [R] to rewind time · Defeat the High Choir!',
    wardens: [
      { x: -7, z: -6, name: 'High Seraph Morvath', hp: 165 },
      { x: 7,  z: -6, name: 'High Seraph Lyra',    hp: 165 },
      { x: 0,  z: -10,name: 'Archon of the Gilded Eclipse', hp: 230 }
    ],
    pillars: [[-6, 2], [6, 2], [-6, -3], [6, -3]],
    braziers: [[-10, -8], [10, -8], [0, -13]],
    monoliths: [
      { word: 'WARDEN', category: 'SUBJECT', x: 3, z: 1 },
      { word: 'IS',     category: 'VERB',    x: 5, z: 1 },
      { word: 'GOLD',   category: 'EFFECT',  x: 8, z: 4 }
    ],
    alchemyPools: [
      { x: 0,  z: -6, radius: 3.5, matId: 5 },
      { x: -7, z: -6, radius: 3.0, matId: 2 },
      { x: 7,  z: -6, radius: 3.0, matId: 4 }
    ]
  },

  // --------------------------------------------------------------------------
  // CHAMBER 7: THE CHASM OF CHAINS (Biome II: Upper Astral Spire)
  // --------------------------------------------------------------------------
  {
    index: 7,
    id: 'CHAMBER_7_GRAPPLE_CHASM',
    title: 'Chamber VII · The Chasm of Chains',
    subtitle: 'Fire your Aether Grapple [G] at Anchors or Wardens to Zip Across the Vitriol Moat!',
    arenaRadius: 21,
    floorTint: 0x091e26,
    fogColor: 0x041016,
    unlocksMechanic: 'AETHER_GRAPPLE',
    boonTitle: 'Aether Hookshot Awakened [G]',
    boonDesc: 'Press [G] to fire a 3D Aether Chain toward your cursor—zipping Vesper to Grapple Anchors/Wardens with an aerial slam, or yanking Runic Monoliths to your side!',
    inWorldPrompt: 'Aim at the glowing Cyan Grapple Pylons across the acid moat & press [G] to Grapple-Slam!',
    wardens: [
      { x: -6, z: -9,  name: 'Spire Harpooner', hp: 160 },
      { x: 0,  z: -11, name: 'Chain-Cantor Vex', hp: 185 },
      { x: 6,  z: -9,  name: 'Spire Harpooner', hp: 160 }
    ],
    pillars: [[-8, 3], [8, 3]],
    braziers: [[-9, -9], [9, -9]],
    grappleAnchors: [
      { x: -6, z: -6 },
      { x: 0,  z: -7 },
      { x: 6,  z: -6 }
    ],
    monoliths: [
      { word: 'WARDEN', category: 'SUBJECT', x: -3, z: -10 },
      { word: 'IS',     category: 'VERB',    x: -1, z: -10 },
      { word: 'GOLD',   category: 'EFFECT',  x: 5,  z: 4 }
    ],
    alchemyPools: [
      { x: -9, z: -2, radius: 3.4, matId: 2 },
      { x: -4, z: -2, radius: 3.4, matId: 2 },
      { x: 0,  z: -2, radius: 3.4, matId: 2 },
      { x: 4,  z: -2, radius: 3.4, matId: 2 },
      { x: 9,  z: -2, radius: 3.4, matId: 2 }
    ]
  },

  // --------------------------------------------------------------------------
  // CHAMBER 8: CLOISTER OF MIRRORED BLADES
  // --------------------------------------------------------------------------
  {
    index: 8,
    id: 'CHAMBER_8_AEGIS_PARRY',
    title: 'Chamber VIII · Cloister of Mirrored Blades',
    subtitle: 'Press [C] to Raise your Solar Aegis · Deflect Attacks & Shatter Warden Posture!',
    arenaRadius: 19,
    floorTint: 0x24160b,
    fogColor: 0x120b04,
    unlocksMechanic: 'SOLAR_PARRY',
    boonTitle: 'Solar Aegis Deflection [C]',
    boonDesc: 'Press [C] to flash your 3D Golden Aegis Shield—reflecting Warden strikes back at 300% damage and shattering their Posture for an instant Deathblow!',
    inWorldPrompt: 'Press [C] when red sightlines flash to Parry & trigger a Golden Deathblow!',
    wardens: [
      { x: -5, z: -6, name: 'Blade-Saint Oren',   hp: 190 },
      { x: 5,  z: -6, name: 'Blade-Saint Kael',   hp: 190 },
      { x: 0,  z: -9, name: 'Grandmaster of the Mirror', hp: 240 }
    ],
    pillars: [[-5, 0], [5, 0]],
    braziers: [[-7, -7], [7, -7]],
    monoliths: [],
    alchemyPools: [
      { x: 0, z: -4, radius: 3.2, matId: 5 }
    ]
  },

  // --------------------------------------------------------------------------
  // CHAMBER 9: HALL OF CONVERGENT SELVES
  // --------------------------------------------------------------------------
  {
    index: 9,
    id: 'CHAMBER_9_TIME_ECHO',
    title: 'Chamber IX · Hall of Convergent Selves',
    subtitle: 'Press [T] to Manifest a 3D Phantom Time-Echo Clone · Conquer the Twin Choir!',
    arenaRadius: 22,
    floorTint: 0x140d2e,
    fogColor: 0x080417,
    unlocksMechanic: 'PHANTOM_ECHO',
    boonTitle: 'Phantom Time-Echo Twin [T]',
    boonDesc: 'Press [T] to split your timeline—spawning a 3D Holographic Twin of Vesper that fights, dashes, and fires Solar Lances in tandem with you!',
    inWorldPrompt: 'Press [T] to summon your 3D Phantom Time-Echo Twin & overwhelm the Sovereign Choir!',
    wardens: [
      { x: -8, z: -6,  name: 'Chrono-Inquisitor Alpha', hp: 195 },
      { x: 8,  z: -6,  name: 'Chrono-Inquisitor Omega', hp: 195 },
      { x: -3, z: -10, name: 'Eclipse Seraph',          hp: 210 },
      { x: 3,  z: -10, name: 'Eclipse Seraph',          hp: 210 }
    ],
    pillars: [[-7, 1], [7, 1], [0, -4]],
    braziers: [[-10, -9], [10, -9], [0, -13]],
    grappleAnchors: [
      { x: -8, z: -3 },
      { x: 8,  z: -3 }
    ],
    monoliths: [
      { word: 'WARDEN', category: 'SUBJECT', x: -2.2, z: 2 },
      { word: 'IS',     category: 'VERB',    x: 0.0,  z: 2 },
      { word: 'GOLD',   category: 'EFFECT',  x: 6.5,  z: 5 }
    ],
    alchemyPools: [
      { x: -6, z: -7, radius: 3.2, matId: 4 },
      { x: 6,  z: -7, radius: 3.2, matId: 2 },
      { x: 0,  z: -9, radius: 3.5, matId: 5 }
    ]
  },

  // --------------------------------------------------------------------------
  // CHAMBER 10: THE HOLLOWED CATACOMBS (Biome III: The Abyssal Clockwork)
  // --------------------------------------------------------------------------
  {
    index: 10,
    id: 'CHAMBER_10_ABYSSAL_BURROW',
    title: 'Chamber X · The Hollowed Catacombs',
    subtitle: 'Press [X] to Burrow Underground Beneath Stone Walls & Erupt in a Geode Burst!',
    arenaRadius: 21,
    floorTint: 0x120a1c,
    fogColor: 0x07040e,
    unlocksMechanic: 'ABYSSAL_BURROW',
    boonTitle: 'Subterranean Rift-Burrow [X]',
    boonDesc: 'Press [X] to dive beneath the obsidian floor—tunneling under solid pillars and acid pools at 165% speed before erupting in a 3D Geode Spike Burst!',
    inWorldPrompt: 'Press [X] to Burrow underground beneath the double pillar barricade & erupt under the Wardens!',
    wardens: [
      { x: -5, z: -8,  name: 'Catacomb Excavator', hp: 205 },
      { x: 0,  z: -10, name: 'Subterranean Archon', hp: 235 },
      { x: 5,  z: -8,  name: 'Catacomb Excavator', hp: 205 }
    ],
    pillars: [[-8, 0], [-5, 0], [-2, 0], [1, 0], [4, 0], [7, 0], [-4, -4], [4, -4]],
    braziers: [[-9, -8], [9, -8]],
    grappleAnchors: [
      { x: -7, z: -6 },
      { x: 7,  z: -6 }
    ],
    monoliths: [
      { word: 'PILLAR',   category: 'SUBJECT', x: -3, z: -6 },
      { word: 'IS',       category: 'VERB',    x: -1, z: -6 },
      { word: 'VOLATILE', category: 'EFFECT',  x: 1,  z: -6 }
    ],
    alchemyPools: [
      { x: -5, z: -8, radius: 3.4, matId: 4 },
      { x: 5,  z: -8, radius: 3.4, matId: 4 }
    ]
  },

  // --------------------------------------------------------------------------
  // CHAMBER 11: THE MOONSIGIL SCRIPTORIUM
  // --------------------------------------------------------------------------
  {
    index: 11,
    id: 'CHAMBER_11_POLYOMINO_TECTONICS',
    title: 'Chamber XI · The Moonsigil Scriptorium',
    subtitle: 'Press [Z] to Stamp 3D Astral Polyomino Sigils onto the Courtyard Floor!',
    arenaRadius: 22,
    floorTint: 0x0a1929,
    fogColor: 0x040b14,
    unlocksMechanic: 'POLYOMINO_SIGILS',
    boonTitle: 'Astral Polyomino Tectonics [Z]',
    boonDesc: 'Press [Z] to stamp interlocking 3D Polyomino Sigil Tiles at your cursor—searing Wardens on contact, splitting your projectiles, and sliding Runic Monoliths!',
    inWorldPrompt: 'Aim at the floor & press [Z] to stamp 3D Polyomino Sigil Tiles beneath Wardens and Monoliths!',
    wardens: [
      { x: -6, z: -7,  name: 'Scriptorium Geometer', hp: 215 },
      { x: 6,  z: -7,  name: 'Scriptorium Geometer', hp: 215 },
      { x: 0,  z: -11, name: 'High Cartographer Solis', hp: 255 }
    ],
    pillars: [[-6, 1], [6, 1]],
    braziers: [[-9, -9], [9, -9]],
    monoliths: [
      { word: 'WARDEN', category: 'SUBJECT', x: -2.2, z: -2 },
      { word: 'IS',     category: 'VERB',    x: 0.0,  z: -2 },
      { word: 'GOLD',   category: 'EFFECT',  x: 5.5,  z: 2 }
    ],
    alchemyPools: [
      { x: 0, z: -7, radius: 3.6, matId: 3 }
    ]
  },

  // --------------------------------------------------------------------------
  // CHAMBER 12: CHOIR OF THE DETACHED CROWN
  // --------------------------------------------------------------------------
  {
    index: 12,
    id: 'CHAMBER_12_CROWN_POSSESSION',
    title: 'Chamber XII · Choir of the Detached Crown',
    subtitle: 'Press [V] to Project Your Astral Crown & Possess Wardens or Stone Pillars!',
    arenaRadius: 23,
    floorTint: 0x1c0d1f,
    fogColor: 0x0b040e,
    unlocksMechanic: 'CROWN_POSSESSION',
    boonTitle: 'Sovereign Crown-Possession [V]',
    boonDesc: 'Press [V] to project your Astral Crown toward your cursor—converting enemy Wardens into allied Astral Thralls or uprooting Stone Pillars into flying rams!',
    inWorldPrompt: 'Aim at any Warden or Pillar & press [V] to Possess them with your Astral Crown!',
    wardens: [
      { x: -8, z: -6,  name: 'Choir Executioner', hp: 225 },
      { x: -3, z: -9,  name: 'Seraphic Adjudicator', hp: 240 },
      { x: 3,  z: -9,  name: 'Seraphic Adjudicator', hp: 240 },
      { x: 8,  z: -6,  name: 'Choir Executioner', hp: 225 }
    ],
    pillars: [[-5, -1], [0, -1], [5, -1], [-5, -5], [5, -5]],
    braziers: [[-10, -10], [10, -10], [0, -14]],
    grappleAnchors: [
      { x: -9, z: -4 },
      { x: 9,  z: -4 }
    ],
    monoliths: [
      { word: 'WARDEN', category: 'SUBJECT', x: -2.2, z: 3 },
      { word: 'IS',     category: 'VERB',    x: 0.0,  z: 3 },
      { word: 'GOLD',   category: 'EFFECT',  x: 7.0,  z: 5 }
    ],
    alchemyPools: [
      { x: -6, z: -8, radius: 3.4, matId: 2 },
      { x: 6,  z: -8, radius: 3.4, matId: 4 },
      { x: 0,  z: -10,radius: 3.8, matId: 5 }
    ]
  },

  // --------------------------------------------------------------------------
  // CHAMBER 13: GALLERY OF FRACTURED HORIZONS (Biome IV: The Celestial Observatory)
  // --------------------------------------------------------------------------
  {
    index: 13,
    id: 'CHAMBER_13_RIFT_PORTALS',
    title: 'Chamber XIII · Gallery of Fractured Horizons',
    subtitle: 'Press [P] to Tear Open Linked 3D Rift-Portals · Teleport Lances, Monoliths & Yourself!',
    arenaRadius: 22,
    floorTint: 0x0b1628,
    fogColor: 0x040914,
    unlocksMechanic: 'RIFT_PORTALS',
    boonTitle: 'Horizon Rift-Portals [P]',
    boonDesc: 'Press [P] to link an Amber Rift-Portal at your feet with a Cyan Rift-Portal at your cursor—teleporting Vesper, Runic Monoliths, and splitting Solar Lances into 3x Prismatic Volleys!',
    inWorldPrompt: 'Aim across the arena & press [P] to open linked 3D Rift-Portals · Shoot through portals to Tri-Split!',
    wardens: [
      { x: -7, z: -8,  name: 'Horizon Warden', hp: 230 },
      { x: 0,  z: -11, name: 'Rift-Weaver Orin', hp: 265 },
      { x: 7,  z: -8,  name: 'Horizon Warden', hp: 230 }
    ],
    pillars: [[-6, -2], [-2, -2], [2, -2], [6, -2]],
    braziers: [[-9, -9], [9, -9]],
    monoliths: [
      { word: 'WARDEN', category: 'SUBJECT', x: -2.2, z: -7 },
      { word: 'IS',     category: 'VERB',    x: 0.0,  z: -7 },
      { word: 'GOLD',   category: 'EFFECT',  x: 0.0,  z: 4 }
    ],
    alchemyPools: [
      { x: -6, z: -8, radius: 3.2, matId: 3 },
      { x: 6,  z: -8, radius: 3.2, matId: 4 }
    ]
  },

  // --------------------------------------------------------------------------
  // CHAMBER 14: THE INVERTED PLANETARIUM
  // --------------------------------------------------------------------------
  {
    index: 14,
    id: 'CHAMBER_14_GRAVITY_SINGULARITY',
    title: 'Chamber XIV · The Inverted Planetarium',
    subtitle: 'Press [N] to Collapse a 3D Black-Sun Gravity Singularity at Your Cursor!',
    arenaRadius: 23,
    floorTint: 0x160926,
    fogColor: 0x090312,
    unlocksMechanic: 'GRAVITY_SINGULARITY',
    boonTitle: 'Black-Sun Gravity Well [N]',
    boonDesc: 'Press [N] to spawn a 3D Black-Sun Singularity that drags Wardens off their sightlines, bends projectile orbits, and pulls Runic Monoliths into alignment!',
    inWorldPrompt: 'Aim between the Wardens & press [N] to collapse a 3D Black-Sun Gravity Singularity!',
    wardens: [
      { x: -8, z: -7,  name: 'Planetarium Astromancer', hp: 245 },
      { x: 8,  z: -7,  name: 'Planetarium Astromancer', hp: 245 },
      { x: -3, z: -11, name: 'Void-Centurion',          hp: 255 },
      { x: 3,  z: -11, name: 'Void-Centurion',          hp: 255 }
    ],
    pillars: [[-6, 1], [6, 1], [0, -5]],
    braziers: [[-10, -9], [10, -9]],
    monoliths: [
      { word: 'WARDEN', category: 'SUBJECT', x: -2.2, z: -1 },
      { word: 'IS',     category: 'VERB',    x: 0.0,  z: -1 },
      { word: 'GOLD',   category: 'EFFECT',  x: 6.5,  z: -1 }
    ],
    alchemyPools: [
      { x: 0, z: -9, radius: 4.0, matId: 4 }
    ]
  },

  // --------------------------------------------------------------------------
  // CHAMBER 15: AMPHITHEATER OF THE DYING PULSE
  // --------------------------------------------------------------------------
  {
    index: 15,
    id: 'CHAMBER_15_HARMONIC_CADENCE',
    title: 'Chamber XV · Amphitheater of the Dying Pulse',
    subtitle: 'Press [M] on the Eclipse Beat to Detonate a Full-Arena Harmonic Symphony!',
    arenaRadius: 24,
    floorTint: 0x210b18,
    fogColor: 0x0e040a,
    unlocksMechanic: 'HARMONIC_CADENCE',
    boonTitle: 'Symphony of the Dying Pulse [M]',
    boonDesc: 'Press [M] to unleash a 120 BPM Harmonic Cadence Nova—triggering simultaneous Resonance Bursts from every active Twin [T], Thrall [V], Portal [P], and Polyomino Sigil [Z]!',
    inWorldPrompt: 'Summon your Twins [T] & Portals [P], then press [M] to detonate a synchronized Harmonic Symphony!',
    wardens: [
      { x: -9, z: -6,  name: 'Cantor of the First Seal',   hp: 250 },
      { x: 9,  z: -6,  name: 'Cantor of the Seventh Seal', hp: 250 },
      { x: -4, z: -11, name: 'Seraphic Conductor',         hp: 270 },
      { x: 4,  z: -11, name: 'Seraphic Conductor',         hp: 270 },
      { x: 0,  z: -13, name: 'Sovereign of the Eclipse Choir', hp: 340 }
    ],
    pillars: [[-7, 0], [7, 0], [-4, -5], [4, -5]],
    braziers: [[-11, -10], [11, -10], [0, -15]],
    grappleAnchors: [
      { x: -9, z: -3 },
      { x: 0,  z: -7 },
      { x: 9,  z: -3 }
    ],
    monoliths: [
      { word: 'WARDEN', category: 'SUBJECT', x: -2.2, z: 2 },
      { word: 'IS',     category: 'VERB',    x: 0.0,  z: 2 },
      { word: 'GOLD',   category: 'EFFECT',  x: 7.5,  z: 4 }
    ],
    alchemyPools: [
      { x: -6, z: -8, radius: 3.5, matId: 4 },
      { x: 6,  z: -8, radius: 3.5, matId: 2 },
      { x: 0,  z: -10,radius: 4.2, matId: 5 }
    ]
  },

  // --------------------------------------------------------------------------
  // CHAMBER 16: CRUCIBLE OF CONVERGENT SPHERES (Biome V: The Sovereign Reliquary)
  // Teaches: 3D Alchemical Sphere Drop-and-Merge Fusion [J]
  // --------------------------------------------------------------------------
  {
    index: 16,
    id: 'CHAMBER_16_FUSION_SPHERES',
    title: 'Chamber XVI · Crucible of Convergent Spheres',
    subtitle: 'Press [J] to Launch 3D Astral Fusion Orbs · Colliding Identical Tiers Merges Into a Supernova!',
    arenaRadius: 23,
    floorTint: 0x0c1926,
    fogColor: 0x040b12,
    unlocksMechanic: 'FUSION_SPHERES',
    boonTitle: 'Astral Sphere Fusion [J]',
    boonDesc: 'Press [J] to hurl 3D Astral Fusion Orbs that bounce across the arena—when two identical-tier Orbs collide, they fuse into a massive Solar Star and detonate a Supernova!',
    inWorldPrompt: 'Press [J] repeatedly to bounce & merge identical 3D Astral Spheres into Tier-III Supernova Stars!',
    wardens: [
      { x: -7, z: -7,  name: 'Crucible Alchemist', hp: 255 },
      { x: 0,  z: -10, name: 'Sphere-WeaverSolon', hp: 290 },
      { x: 7,  z: -7,  name: 'Crucible Alchemist', hp: 255 }
    ],
    pillars: [[-5, -1], [5, -1]],
    braziers: [[-9, -9], [9, -9]],
    monoliths: [
      { word: 'WARDEN', category: 'SUBJECT', x: -2.2, z: -3 },
      { word: 'IS',     category: 'VERB',    x: 0.0,  z: -3 },
      { word: 'GOLD',   category: 'EFFECT',  x: 6.0,  z: 2 }
    ],
    alchemyPools: [
      { x: -5, z: -7, radius: 3.4, matId: 4 },
      { x: 5,  z: -7, radius: 3.4, matId: 3 }
    ]
  },

  // --------------------------------------------------------------------------
  // CHAMBER 17: THE GILDED DICE RELIQUARY
  // Teaches: 3D Fate-Die Roll & Pip-Multiplier Shockwave [K]
  // --------------------------------------------------------------------------
  {
    index: 17,
    id: 'CHAMBER_17_FATE_DICE',
    title: 'Chamber XVII · The Gilded Dice Reliquary',
    subtitle: 'Press [K] to Hurl 3D Gilded Fate Dice · High Rolls Trigger Jackpot Lightning & Axiom Shifts!',
    arenaRadius: 23,
    floorTint: 0x1f1409,
    fogColor: 0x0e0803,
    unlocksMechanic: 'FATE_DICE',
    boonTitle: 'Sovereign Fate-Dice [K]',
    boonDesc: 'Press [K] to hurl tumbling 3D Gilded Fate Dice—unleashing Pip-scaled shockwaves, transmuting nearby Runic Monoliths to [GOLD], and striking all Wardens on a 6-Pip Jackpot!',
    inWorldPrompt: 'Aim at the Wardens or Monoliths & press [K] to roll 3D Gilded Fate Dice across the reliquary!',
    wardens: [
      { x: -8, z: -7,  name: 'Croupier of Ash',      hp: 265 },
      { x: 8,  z: -7,  name: 'Croupier of Ash',      hp: 265 },
      { x: -3, z: -11, name: 'Arbiter of Fortune',   hp: 280 },
      { x: 3,  z: -11, name: 'Arbiter of Fortune',   hp: 280 }
    ],
    pillars: [[-6, 1], [6, 1], [0, -5]],
    braziers: [[-10, -9], [10, -9]],
    monoliths: [
      { word: 'WARDEN',   category: 'SUBJECT', x: -2.2, z: 1 },
      { word: 'IS',       category: 'VERB',    x: 0.0,  z: 1 },
      { word: 'VOLATILE', category: 'EFFECT',  x: 2.2,  z: 1 }
    ],
    alchemyPools: [
      { x: 0, z: -9, radius: 3.8, matId: 5 }
    ]
  },

  // --------------------------------------------------------------------------
  // CHAMBER 18: HALL OF REFRACTED MIRRORS
  // Teaches: 3D Crystalline Prism Mirror Constellation & Laser Lattice [L]
  // --------------------------------------------------------------------------
  {
    index: 18,
    id: 'CHAMBER_18_PRISM_MIRRORS',
    title: 'Chamber XVIII · Hall of Refracted Mirrors',
    subtitle: 'Press [L] to Erect 3D Crystalline Prism Mirrors · Shoot Any Prism to Ignite a Laser Lattice!',
    arenaRadius: 24,
    floorTint: 0x091d24,
    fogColor: 0x030c10,
    unlocksMechanic: 'PRISM_MIRRORS',
    boonTitle: 'Crystalline Prism Constellation [L]',
    boonDesc: 'Press [L] to erect 3D Crystalline Prism Obelisks that link via continuous Aether Laser Beams and ricochet any Solar Lance across every Prism into hostile Wardens!',
    inWorldPrompt: 'Place 3D Prism Mirrors around the Wardens with [L], then shoot any Prism to trigger a Chain-Laser Volley!',
    wardens: [
      { x: -9, z: -6,  name: 'Mirror-Seraph',              hp: 270 },
      { x: 9,  z: -6,  name: 'Mirror-Seraph',              hp: 270 },
      { x: -4, z: -11, name: 'Prismatic Inquisitor',       hp: 295 },
      { x: 4,  z: -11, name: 'Prismatic Inquisitor',       hp: 295 },
      { x: 0,  z: -14, name: 'Hierophant of the Glass Sun',hp: 380 }
    ],
    pillars: [[-7, 0], [7, 0], [-4, -5], [4, -5]],
    braziers: [[-11, -10], [11, -10], [0, -16]],
    grappleAnchors: [
      { x: -9, z: -3 },
      { x: 0,  z: -7 },
      { x: 9,  z: -3 }
    ],
    monoliths: [
      { word: 'WARDEN', category: 'SUBJECT', x: -2.2, z: 2 },
      { word: 'IS',     category: 'VERB',    x: 0.0,  z: 2 },
      { word: 'GOLD',   category: 'EFFECT',  x: 7.5,  z: 4 }
    ],
    alchemyPools: [
      { x: -6, z: -8, radius: 3.5, matId: 3 },
      { x: 6,  z: -8, radius: 3.5, matId: 4 },
      { x: 0,  z: -10,radius: 4.2, matId: 5 }
    ]
  }
];

export const BOON_CHOICES = [
  {
    id: 'BOON_SOLAR_FLARE',
    name: 'Boon of the Twin Sun',
    patron: 'Soren of the Astrolabe',
    icon: '☀️',
    color: 0xf59e0b,
    desc: 'Your Solar Lance fires +1 additional split beam and deals +35% damage.'
  },
  {
    id: 'BOON_SEISMIC_SLEDGE',
    name: 'Blessing of the Shattered Bell',
    patron: 'Lady Nyxara',
    icon: '🔨',
    color: 0x38bdf8,
    desc: 'Memory Sledgehammer [F] unleashes a wider shockwave and launches 2 Ricocheting Astral Spheres.'
  },
  {
    id: 'BOON_AETHER_ORBITALS',
    name: 'Halo of the Seraphim',
    patron: 'Magistrate Vane',
    icon: '⚔️',
    color: 0xc084fc,
    desc: 'Summons +2 additional Crystalline Aether Blades that orbit Vesper and slice nearby foes.'
  },
  {
    id: 'BOON_VITRIOL_WAKE',
    name: 'Venom of the Emerald Serpent',
    patron: 'Lady Nyxara',
    icon: '🐍',
    color: 0x10b981,
    desc: 'Phase-Dashing [Space] leaves a corrosive Vitriol wake that melts enemy armor and restores +20 Vitality.'
  },
  {
    id: 'BOON_GEODE_BURROW',
    name: 'Mantle of the Hollow Earth',
    patron: 'Soren of the Astrolabe',
    icon: '💎',
    color: 0xc084fc,
    desc: 'Subterranean Burrow [X] erupts with 2x larger Geode Crystal Spikes and restores +15 Vitality.'
  },
  {
    id: 'BOON_POLYOMINO_RESONANCE',
    name: 'Atlas of the Moonsigil',
    patron: 'Magistrate Vane',
    icon: '❖',
    color: 0x38bdf8,
    desc: 'Polyomino Sigils [Z] cover +1 additional tile and amplify all Essence harvested by +2x.'
  },
  {
    id: 'BOON_PRISMATIC_PORTALS',
    name: 'Lens of Fractured Horizons',
    patron: 'Soren of the Astrolabe',
    icon: '🌀',
    color: 0x38bdf8,
    desc: 'Rift-Portals [P] split any Solar Lance passing through them into 5 Prismatic Beams.'
  },
  {
    id: 'BOON_SINGULARITY_COLLAPSE',
    name: 'Heart of the Black Sun',
    patron: 'Lady Nyxara',
    icon: '🕳️',
    color: 0xa855f7,
    desc: 'Gravity Singularities [N] pull Wardens from 50% farther away and detonate in a Supernova on expiry.'
  },
  {
    id: 'BOON_LOADED_FATE_DICE',
    name: 'Loaded Dice of the Sovereign',
    patron: 'Magistrate Vane',
    icon: '🎲',
    color: 0xfbbf24,
    desc: 'Fate Dice [K] always roll 5 or 6 Pips, and Fusion Orbs [J] start at Tier II Solar Mass!'
  }
];
