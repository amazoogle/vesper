// ============================================================================
// VESPER: THE GILDED ECLIPSE — SYSTEM I: THE PARLIAMENT OF HUMORS,
// INTERNALIZED THOUGHT CABINET & THE 4-HARMONIC AETHER RESONANCE TUNER
// ============================================================================
// - 8 Competing Inner Voices (Humors of the Shattered Soul) that dynamically
//   interject into the UI based on 3D world telemetry, roll skill checks on
//   every player action, and argue with one another in real-time.
// - Thought Cabinet where philosophical/heretical Axioms are incubated over
//   real flow-time (applying bizarre temporary penalties while gestating, then
//   unlocking permanent reality-warping laws once internalized).
// - 4-Band Aether Frequency Oscilloscope (50.0 MHz – 999.9 MHz) with live
//   waveform synthesis that hacks Seraph Warden brains, unlocks harmonic
//   vaults, and alters alchemical phase states.
// ============================================================================

export const HUMORS = [
  {
    id: 'ESOTERICA',
    name: 'Esoterica',
    sphere: 'Arcane Intuition & Unseen Geometry',
    color: '#c084fc',
    level: 4,
    interjections: [
      '“Do you hear the mortar between the basalt stones? It hums in 432.8 MHz. The cathedral is dreaming of its own collapse.”',
      '“That Runic Monolith is weeping ultraviolet light. Push it three paces eastward and the sky will bleed gold.”',
      '“The Wardens do not see you with eyes; they track the guilt in your pulse.”'
    ]
  },
  {
    id: 'PYROCHEMISTRY',
    name: 'Pyrochemistry',
    sphere: 'Alchemical Hunger & Volatile Ecstasy',
    color: '#fb923c',
    level: 5,
    interjections: [
      '“Drink the Vitriol! Or better yet—ignite the Mycelium ring and watch the Kelvin gauge scream past 9,000!”',
      '“Too much cold stone. Spill Wildfire across the nave. Everything is fuel if your faith is hot enough.”',
      '“The Emerald Alembic on your belt is starving. Feed it a Warden’s core!”'
    ]
  },
  {
    id: 'SOVEREIGNTY',
    name: 'Sovereignty',
    sphere: 'Imperial Command & Iron Will',
    color: '#fbbf24',
    level: 4,
    interjections: [
      '“Kneel to no Tribunal! If Magistrate Vane questions our Paradox, stamp his writ in molten gold and annex the Spire.”',
      '“The Seraph Choir was forged to serve the throne. Rewrite [WARDEN IS VASSAL] and make them bow.”',
      '“Your posture is faltering, Chronomancer. Strike the pillar until it remembers who carved it.”'
    ]
  },
  {
    id: 'MORTAL_COIL',
    name: 'Mortal Coil',
    sphere: 'Somatic Pain, Limb Integrity & Blood Pressure',
    color: '#f43f5e',
    level: 3,
    interjections: [
      '“Your left gauntlet is hairline-fractured and your arterial pressure is spiking. One more Blood Tribute and the heart seizes.”',
      '“The air near the Abyssal Trench tastes of copper and ozone. Check your Thoracic Cage before you dash again.”'
    ]
  },
  {
    id: 'CHRONOMETRY',
    name: 'Chronometry',
    sphere: 'Vector Calculus & Causal Loops',
    color: '#38bdf8',
    level: 5,
    interjections: [
      '“At current angular velocity, that Astral Sphere will ricochet off the North Pillar in 1.42 seconds. Stand still—let time freeze.”',
      '“We have lived this exact second four times across three Supernovas. Rewind 18 frames and intercept the laser vector.”'
    ]
  },
  {
    id: 'VOID_WHISPER',
    name: 'Abyssal Dread',
    sphere: 'Eldritch Entropy & Eclipse Madness',
    color: '#818cf8',
    level: 2,
    interjections: [
      '“When the Eclipse Star hits 10,000 Kelvin, the shadows detach from the columns and walk on their own.”',
      '“Look inside the Microcosm Orb. There is another Vesper looking back up at you.”'
    ]
  }
];

export const THOUGHT_CABINET_PROJECTS = [
  {
    id: 'THOUGHT_SOLAR_HERESY',
    title: 'The Theorem of Inverted Heliocentricity',
    incubationSeconds: 35,
    gestationPenalty: '-15% Chrono-Stillness efficiency; Wildfire burns 20% hotter',
    completionBonus: '+5x Base Resonance; Wildfire heals Vesper instead of burning',
    lore: 'What if the dying star is not in the sky at all, but trapped beneath the cathedral flagstones?'
  },
  {
    id: 'THOUGHT_GLASS_ANATOMY',
    title: 'Vitreous Osteology',
    incubationSeconds: 40,
    gestationPenalty: 'Thoracic armor takes +20% knockback from Warden strikes',
    completionBonus: 'Every Sledgehammer smash spawns 2 Ricocheting Astral Spheres & +150 Essence',
    lore: 'To shatter the stone of Sol-Vespera, one must first accept that one’s own bones are blown from brittle spun glass.'
  },
  {
    id: 'THOUGHT_BUREAUCRATIC_APOTHEOSIS',
    title: 'Codicil 99-Omega: Sovereign Immunity',
    incubationSeconds: 30,
    gestationPenalty: 'Tarot Arcana invocations cost +5 Aether Mana',
    completionBonus: 'All Paradox Tribunal rulings grant BOTH Sanctify and Purge rewards simultaneously!',
    lore: 'A legal loophole discovered in the pre-Eclipse concordat: if the universe is a contradiction, the defendant is automatically crowned Judge.'
  },
  {
    id: 'THOUGHT_RECURSIVE_TAXONOMY',
    title: 'Ontological Nesting of the Demiurge',
    incubationSeconds: 45,
    gestationPenalty: 'Eclipse Star heats +12K/s faster while pondering',
    completionBonus: 'Dropping a Microcosm World-Orb on the ground duplicates all nearby Runic Monoliths',
    lore: 'If a pocket world fits inside a glass sphere on your belt, whose belt is Sol-Vespera hanging from?'
  }
];

export const HARMONIC_FREQUENCIES = [
  {
    freq: 108.4,
    tolerance: 4.5,
    name: 'Choir Override Carrier (108.4 MHz)',
    waveform: 'SAW',
    effect: 'Hacks all Seraph Wardens within 18m—jamming their laser sightlines and forcing them to drop 60 Soul Essence.'
  },
  {
    freq: 432.0,
    tolerance: 5.0,
    name: 'Cryo-Harmonic Cantor (432.0 MHz)',
    waveform: 'SINE',
    effect: 'Resonates with Aether pools to drain 900 Kelvin from the dying Eclipse Star and restore 25 Vitality.'
  },
  {
    freq: 666.6,
    tolerance: 4.5,
    name: 'Crimson Transmutation Band (666.6 MHz)',
    waveform: 'SQUARE',
    effect: 'Boils all Blood and Vitriol on the floor into pure Gilded Ichor (+220 Essence, +2x Resonance).'
  },
  {
    freq: 888.8,
    tolerance: 5.0,
    name: 'Monolith Phase-Lock (888.8 MHz)',
    waveform: 'TRIANGLE',
    effect: 'Magnetically pulls loose Runic Monoliths into a collinear 3D Triad alignment automatically!'
  }
];

export class PsycheAndTunerSystem {
  constructor(game) {
    this.game = game;
    this.humors = HUMORS.map(h => ({ ...h }));
    this.activeVoiceLog = [];

    // Thought Cabinet state
    this.thoughts = THOUGHT_CABINET_PROJECTS.map((t, i) => ({
      ...t,
      status: i === 0 ? 'INCUBATING' : 'LOCKED', // LOCKED | INCUBATING | INTERNALIZED
      progress: 0
    }));

    // 4-Harmonic Radio Tuner state
    this.currentFreq = 240.0;
    this.targetBand = HARMONIC_FREQUENCIES[0];
    this.phaseAngle = 0;
    this.broadcastCooldown = 0;

    // Dread / Eclipse Sanity (0 = Lucid, 100 = Eldritch Eclipse Fracture)
    this.eclipseDread = 12;
    this.quirks = [];
  }

  update(realDt, simDt) {
    this.phaseAngle += realDt * 8.0;
    if (this.broadcastCooldown > 0) this.broadcastCooldown = Math.max(0, this.broadcastCooldown - realDt);

    // 1. Update Incubating Thoughts in the Thought Cabinet
    for (const th of this.thoughts) {
      if (th.status === 'INCUBATING') {
        th.progress += realDt;
        if (th.id === 'THOUGHT_RECURSIVE_TAXONOMY') {
          this.game.state.starKelvin += realDt * 12;
        }
        if (th.progress >= th.incubationSeconds) {
          th.status = 'INTERNALIZED';
          this.onThoughtInternalized(th);
        }
      }
    }

    // 2. Dynamic Eclipse Dread (rises when Star is >7500K or in Abyssal Trench)
    const s = this.game.state;
    if (s.starKelvin > 7500) {
      this.eclipseDread = Math.min(100, this.eclipseDread + simDt * 2.5);
    } else {
      this.eclipseDread = Math.max(0, this.eclipseDread - realDt * 0.6);
    }

    // Spawn a Supernatural Relic Quirk if Dread exceeds 65%
    if (this.eclipseDread > 65 && this.quirks.length < 2 && Math.random() < 0.01) {
      this.manifestRelicQuirk();
    }

    // 3. Periodic Inner Humor Voice Interjection
    if (Math.random() < 0.008) {
      this.triggerHumorInterjection();
    }
  }

  triggerHumorInterjection(forcedHumorId = null) {
    const h = forcedHumorId
      ? this.humors.find(x => x.id === forcedHumorId)
      : this.humors[Math.floor(Math.random() * this.humors.length)];
    if (!h) return;

    // Roll a 2d6 + Humor Level check
    const d1 = 1 + Math.floor(Math.random() * 6);
    const d2 = 1 + Math.floor(Math.random() * 6);
    const total = d1 + d2 + h.level;
    const passed = total >= 11;

    const quote = h.interjections[Math.floor(Math.random() * h.interjections.length)];
    const entry = {
      id: Math.random(),
      humorName: h.name,
      color: h.color,
      rollText: `[${h.name} — ${passed ? 'Success' : 'Strain'} ${total}/11]`,
      quote
    };

    this.activeVoiceLog.unshift(entry);
    if (this.activeVoiceLog.length > 5) this.activeVoiceLog.pop();

    if (passed) {
      this.game.state.essence += 15;
    }
  }

  startIncubatingThought(thoughtId) {
    const th = this.thoughts.find(t => t.id === thoughtId);
    if (!th || th.status !== 'LOCKED') return;
    th.status = 'INCUBATING';
    th.progress = 0;
    this.triggerHumorInterjection('ESOTERICA');
    this.game.addChronicle(`🧠 Thought Cabinet: Began internalizing "${th.title}" (${th.incubationSeconds}s).`);
    this.game.updateHUD();
  }

  onThoughtInternalized(th) {
    this.game.sfx.playArcanaChord();
    if (th.id === 'THOUGHT_SOLAR_HERESY') {
      this.game.state.resonance += 5;
    } else if (th.id === 'THOUGHT_GLASS_ANATOMY') {
      this.game.state.essence += 250;
    } else if (th.id === 'THOUGHT_BUREAUCRATIC_APOTHEOSIS') {
      this.game.state.resonance += 4;
    } else if (th.id === 'THOUGHT_RECURSIVE_TAXONOMY') {
      this.game.state.resonance += 6;
    }
    this.game.spawnFloatingText(this.game.hero.pos, `🧠 THOUGHT INTERNALIZED: ${th.title}!`, '#c084fc');
    this.game.addChronicle(`🧠 INTERNALIZED "${th.title}": ${th.completionBonus}!`);
    this.game.updateHUD();
  }

  isThoughtInternalized(thoughtId) {
    const th = this.thoughts.find(t => t.id === thoughtId);
    return Boolean(th && th.status === 'INTERNALIZED');
  }

  // 4-HARMONIC AETHER RESONANCE TUNER
  setFrequency(freqVal) {
    this.currentFreq = Math.max(50, Math.min(999.9, parseFloat(freqVal) || 240.0));
  }

  pulseHarmonicBroadcast() {
    if (this.broadcastCooldown > 0) return;
    this.broadcastCooldown = 1.2;

    const matched = HARMONIC_FREQUENCIES.find(b => Math.abs(b.freq - this.currentFreq) <= b.tolerance);
    this.game.sfx.playCastBolt(this.currentFreq);

    if (!matched) {
      this.game.spawnFloatingText(this.game.hero.pos, `📻 ${this.currentFreq.toFixed(1)} MHz: STATIC DISSONANCE`, '#94a3b8');
      this.game.addChronicle(`📻 Broadcasted on ${this.currentFreq.toFixed(1)} MHz—only astral static answered. Tune near 108.4, 432.0, 666.6, or 888.8 MHz.`);
      return;
    }

    const s = this.game.state;
    this.game.spawnFloatingText(this.game.hero.pos, `📻 HARMONIC LOCK: ${matched.name}!`, '#38bdf8');
    this.game.addChronicle(`📻 ${matched.name}: ${matched.effect}`);

    if (matched.freq === 108.4) {
      // Hack Wardens
      for (const w of s.wardens) {
        w.telegraphTimer = 8.0;
        w.hp -= 25;
        s.essence += 60;
        this.game.spawnFloatingText(w.pos, '📻 NEURAL OVERRIDE! -25', '#38bdf8');
      }
    } else if (matched.freq === 432.0) {
      // Cool Star & Heal
      s.starKelvin = Math.max(2500, s.starKelvin - 900);
      s.hp = Math.min(s.maxHp, s.hp + 25);
      this.game.paintAlchemyDisc(this.game.hero.pos.x, this.game.hero.pos.z, 3.8, 3);
    } else if (matched.freq === 666.6) {
      // Transmute Blood/Vitriol into Gold
      s.essence += 220;
      s.resonance += 2;
      this.game.paintAlchemyDisc(this.game.hero.pos.x, this.game.hero.pos.z, 4.2, 5);
    } else if (matched.freq === 888.8) {
      // Magnetic Monolith Triad Alignment!
      const sub = s.monoliths.find(m => m.category === 'SUBJECT');
      const verb = s.monoliths.find(m => m.category === 'VERB');
      const eff = s.monoliths.find(m => m.category === 'EFFECT');
      if (sub && verb && eff) {
        const bx = this.game.hero.pos.x - 2;
        const bz = this.game.hero.pos.z - 3;
        sub.pos.set(bx - 2.0, 0, bz);
        verb.pos.set(bx, 0, bz);
        eff.pos.set(bx + 2.0, 0, bz);
        this.game.evaluateAxiomMonoliths();
        this.game.spawnFloatingText(verb.pos, '📻 MAGNETIC TRIAD LOCKED!', '#fbbf24');
      }
    }
    this.game.updateHUD();
  }

  manifestRelicQuirk() {
    const quirkPool = [
      {
        id: 'QUIRK_PHASE_ECHO',
        symptom: 'Whenever Vesper Phase-Dashes, the Eclipse Star cools by 300K',
        cause: 'Chrono-Boots',
        effect: 'Star-Core Capacitor',
        diagnosed: false
      },
      {
        id: 'QUIRK_HAMMER_ARCANA',
        symptom: 'Swinging the Memory Sledgehammer automatically draws +1 Tarot Arcana card',
        cause: 'Sledgehammer Haft',
        effect: 'Astral Deck-Sleeve',
        diagnosed: false
      }
    ];
    const q = quirkPool[this.quirks.length % quirkPool.length];
    this.quirks.push({ ...q });
    this.game.addChronicle(`⚡ ANOMALOUS RELIC QUIRK MANIFESTED: "${q.symptom}". Diagnose it in the Sanctum Matrix!`);
  }
}
