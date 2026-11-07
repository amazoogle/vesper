// ============================================================================
// VESPER: THE GILDED ECLIPSE
// Lore, Characters, Tarot Arcana Deck, Relics, Sanctum Blueprints & Decrees
// Everything is diegetic to the world of Sol-Vespera — zero immersion-breaking meta-labels.
// ============================================================================

export const LORE = {
  TITLE: 'VESPER: THE GILDED ECLIPSE',
  SUBTITLE: 'Chronicles of the Sun-Shattered Sanctum',

  NPCS: {
    ARCHIVIST: {
      name: 'Archivist Soren of the Astral Loom',
      role: 'Keeper of the Eternal Astrolabe',
      portrait: '🧙‍♂️',
      quotes: [
        '“The Eclipse Star above us is dying, Vesper. When you stand still, time itself holds its breath—use that stillness to weave your spells.”',
        '“Look upon the Runic Monoliths in the courtyard. They are the physical laws of Sol-Vespera. Push [WARDEN] [IS] [GOLD], and our sworn foes shall turn to gilded statues!”',
        '“Every soul that falls leaves an Astral Echo. Gaze into their final moment with your Chronodiviner Watch, and the Sanctum will reward your truth.”'
      ]
    },
    MAGISTRATE: {
      name: 'High Magistrate Vane',
      role: 'Arbiter of Ontological Paradoxes',
      portrait: '⚖️',
      quotes: [
        '“When two Runic Monoliths contradict the natural order, the Tribunal of Paradoxes convenes. Your seal determines whether the anomaly becomes law or ash.”'
      ]
    }
  },

  // Diegetic Tarot Arcana Cards (Played to weave spells, alter terrain, and build Resonance)
  ARCANA_SUITS: [
    {
      id: 'SOLAR',
      symbol: '☉',
      name: 'Crown of Sol',
      color: '#f59e0b',
      elementMat: 5, // Gilded Gold
      desc: 'Transmutes courtyard stone into Gilded Ichor & launches Ricocheting Solar Spheres'
    },
    {
      id: 'ABYSS',
      symbol: '☽',
      name: 'Tide of Aether',
      color: '#38bdf8',
      elementMat: 3, // Aether Water
      desc: 'Summons Cooling Aether Rain to calm the Eclipse Star & restores Vesper’s Vitality'
    },
    {
      id: 'VITRIOL',
      symbol: '🐍',
      name: 'Serpent of Vitriol',
      color: '#10b981',
      elementMat: 2, // Vitriol Acid
      desc: 'Floods the ground with corrosive Vitriol that dissolves armor and stone pillars'
    },
    {
      id: 'SPORE',
      symbol: '🍄',
      name: 'Blight of Mycelium',
      color: '#c084fc',
      elementMat: 4, // Bioluminescent Mycelium
      desc: 'Grows luminous Mycelium rings that entangle Wardens and sprout new Runic Monoliths'
    }
  ],

  ARCANA_RANKS: [
    { rank: 14, numeral: 'XIV', title: 'The Eclipse', essence: 15 },
    { rank: 13, numeral: 'XIII', title: 'The Sovereign', essence: 12 },
    { rank: 12, numeral: 'XII', title: 'The Seraph', essence: 11 },
    { rank: 11, numeral: 'XI', title: 'The Warden', essence: 10 },
    { rank: 10, numeral: 'X', title: 'Wheel of Stars', essence: 10 },
    { rank: 9,  numeral: 'IX', title: 'The Hermit', essence: 9 },
    { rank: 8,  numeral: 'VIII', title: 'Fortitude', essence: 8 }
  ],

  // Diegetic Relics (Passive Artifacts worn on Vesper's Belt)
  STARTER_RELICS: [
    {
      id: 'RELIC_HOURGLASS',
      name: 'Ashen Hourglass',
      icon: '⏳',
      desc: 'While Time Dilation is below 25%, Spell & Arcana Multipliers gain +3x Resonance.'
    },
    {
      id: 'RELIC_ALEMBIC',
      name: 'Emerald Alembic',
      icon: '⚗️',
      desc: 'Every pool of Wildfire, Vitriol, or Gilded Ichor in the courtyard feeds +25 Soul Essence.'
    },
    {
      id: 'RELIC_TABLET',
      name: 'Lexicon of First Laws',
      icon: '📜',
      desc: 'Each aligned Runic Monolith Triad in the Sanctum multiplies your Resonance by 1.35x.'
    },
    {
      id: 'RELIC_ASTROLABE',
      name: 'Celestial Orbs of Vespera',
      icon: '🔮',
      desc: 'Kinetic Astral Spheres draw a fresh Arcana Card on every 5th ricochet.'
    }
  ],

  // Sanctum Architectural Wings (Drafted in 3D space around the courtyard)
  SANCTUM_WINGS: [
    {
      id: 'WING_ASTROLABE',
      name: 'Cryo-Astrolabe Spire',
      cost: 3,
      icon: '🔭',
      desc: 'Erects an Astral Fountain that cools the dying Eclipse Star by 1,500K and grants +2x Resonance.'
    },
    {
      id: 'WING_AUTOMATON_FORGE',
      name: 'Gilded Automaton Conduit',
      cost: 3,
      icon: '⚙️',
      desc: 'Constructs 3D Kinetic Ley-Line Tracks that slide Runic Monoliths & harvest fallen Wardens automatically.'
    },
    {
      id: 'WING_RELIQUARY',
      name: 'Vault of the Golden Idol',
      cost: 2,
      icon: '🏛️',
      desc: 'Materializes a [GOLD] Runic Monolith and floods the eastern sanctum with Gilded Ichor (+150 Essence).'
    }
  ],

  // Codex Entries (Persisting across Eclipse Supernovas)
  CODEX_RUMORS: {
    STAR_PACT: {
      title: 'The Dying Eclipse Star',
      text: 'Every 120 seconds of real-flow time, the star above Sol-Vespera collapses into a Supernova. Only your Codex memories, Relics, and Resonance survive the rebirth.'
    },
    MONOLITH_LAWS: {
      title: 'The Runic Monoliths of Creation',
      text: 'When three carved Monoliths align in the courtyard—such as [WARDEN] [IS] [GOLD] or [PILLAR] [IS] [VOLATILE]—reality immediately rewrites itself to obey.'
    },
    CHRONO_STILLNESS: {
      title: 'Breath of the Chronomancer',
      text: 'Time flows at the speed of your motion. Stand still to freeze incoming Warden strikes and plan your trajectory.'
    },
    ASTRAL_LASSO: {
      title: 'Sigil of Encirclement',
      text: 'Hold Right-Click and trace a glowing Astral Loop on the courtyard floor to snare Wardens or transmute Runic Monoliths inside the circle.'
    },
    LIVING_SANCTUM: {
      title: 'The Living Cathedral',
      text: 'Press [H] to project Vesper’s soul into the stone pillars of the Sanctum itself, crushing Wardens between moving walls.'
    }
  }
};
