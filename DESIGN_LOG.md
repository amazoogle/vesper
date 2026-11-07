# VESPER: THE GILDED ECLIPSE
### A 3D Systemic Dark-Fantasy Action-RPG & Roguelike

## World & Premise
In **Vesper: The Gilded Eclipse**, you play as **Vesper**, an Ashen Chronomancer ascending from **The House of Ash** through the shattered Gothic chambers of **Sol-Vespera** beneath a boiling, dying Eclipse Star.

Every mechanic is introduced **one chamber at a time** through spatial 3D level design—with **zero blocking popup modals**—and every new ability cross-interacts with all previously awakened systems:

---

## Progressive 3D Chamber Campaign ([`src/chambers.js`](file:///X:/Now/game/src/chambers.js))

- **Chamber 0 — The House of Ash (Sanctuary Hub):**
  Converse with **Soren, the Blind Astrolaber**, **Lady Nyxara, Weaver of Arcana**, and **Magistrate Vane** (`[E]` non-blocking voice banner), then step through the glowing North Archway to begin your escape run.
- **Chamber I — Courtyard of First Blood (`CHRONO_STILLNESS`):**
  Time slows to **12%** when Vesper stands still. Read the Wardens' deterministic crimson sightlines, fire Solar Lances (`[Left-Click]`), and Phase-Dash (`[Space]`) through incoming strikes.
- **Chamber II — The Sealed Colonnade (`SLEDGEHAMMER` `[F]`):**
  A solid wall of cracked stone pillars physically blocks the arena. Swing the **Memory Sledgehammer (`[F]`)** to shatter the pillars into Gilded Ichor and knock Wardens off their sightlines.
- **Chamber III — The Alchemical Crucible (`ALCHEMY`):**
  64×64 cellular-automata surface alchemy mapped onto the 3D floor (`floorVertex` / `floorFragment`). Shoot purple **Mycelium Spore-Rings** to ignite chain-reaction **Wildfire** across **Vitriol** pools.
- **Chamber IV — Hall of Living Axioms (`MONOLITHS`):**
  Push 3D **Runic Monoliths** across the floor to slide `[GOLD]` into the glowing golden Triad Socket beside `[WARDEN] [IS]`, physically enacting `[WARDEN IS GOLD]` and transmuting all Wardens in the chamber into solid gold statues.
- **Chamber V — The Astral Observatory (`LASSO_AND_ARCANA`):**
  Hold **`[Right-Click]`** and drag a 3D **Astral Lasso** loop on the stone floor to snare Wardens and shift Runic Monolith inscriptions, or press **`[Q]`** to weave **Tarot Arcana**.
- **Chamber VI — Sanctum of the Eclipse Throne (`FULL_CONVERGENCE`):**
  Deploy **Ley-Line Pylons (`[B]`)**, rewind causality (`[R]`), and battle alongside the **14-Segment IK Abyssal Leviathan**.
- **Chamber VII — The Chasm of Chains (`AETHER_GRAPPLE` `[G]`):**
  Fire a 3D **Aether Grapple-Hook (`[G]`)** to zip across corrosive Vitriol moats via 3D Grapple Anchor Pylons—or aim `[G]` at a 3D Runic Monolith to yank it across the arena into alignment!
- **Chamber VIII — Cloister of Mirrored Blades (`SOLAR_PARRY` `[C]`):**
  Flash a 3D **Golden Aegis Shield (`[C]`)** to deflect Warden strikes at 300% speed, shatter enemy Posture, and trigger an instant **`🛡️ SOLAR DEATHBLOW!`** execution.
- **Chamber IX — Hall of Convergent Selves (`PHANTOM_ECHO` `[T]`):**
  Summon a 3D holographic **Phantom Time-Echo Twin (`[T]`)** that orbits the arena and fires synchronized cyan lances whenever Vesper casts.
- **Chamber X — The Hollowed Catacombs (`ABYSSAL_BURROW` `[X]`):**
  Dive underground beneath solid stone barricades and corrosive Vitriol pools at 165% speed while trailing Bioluminescent Mycelium Spores, then erupt in a 3D **Geode Spike Burst** that shatters pillars from below and launches nearby Wardens.
- **Chamber XI — The Moonsigil Scriptorium (`POLYOMINO_SIGILS` `[Z]`):**
  Stamp interlocking 3D **Astral Polyomino Sigil Tiles** (L-Tetromino, T-Tetromino, Cross-Pentomino) onto the courtyard floor to sear Wardens, supercharge Solar Lances passing over them, and magnetically slide Runic Monoliths toward Triad alignment.
- **Chamber XII — Choir of the Detached Crown (`CROWN_POSSESSION` `[V]`):**
  Project Vesper's levitating **Astral Crown (`[V]`)** to possess enemy Wardens—turning their cores cyan as allied **Astral Thralls** that hunt down other Wardens—or uproot 3D Cathedral Pillars and hurl them into foes!
- **Chamber XIII — Gallery of Fractured Horizons (`RIFT_PORTALS` `[P]`):**
  Open a linked pair of 3D **Solar & Aether Rift-Portals (`[P]`)**. Walk through to teleport across the arena, warp `[GOLD]` Runic Monoliths through the rift into Triad alignment, or fire Solar Lances into a portal to refract them into a **3-Beam Prismatic Volley** out of the twin portal!
- **Chamber XIV — The Inverted Planetarium (`GRAVITY_SINGULARITY` `[N]`):**
  Collapse a 3D **Black-Sun Gravity Singularity (`[N]`)** at your cursor. Its accretion disk drags hostile Wardens off their sightlines (`-38 HP/s`), curves Solar Lance trajectories through gravitational lensing, and pulls distant Runic Monoliths into `[IS]` alignment!
- **Chamber XV — Amphitheater of the Dying Pulse (`HARMONIC_CADENCE` `[M]`):**
  Pulse the 120 BPM **Harmonic Eclipse Cadence (`[M]`)** to detonate synchronized Resonance Shockwaves from Vesper AND every active **Phantom Twin (`[T]`)**, **Possessed Thrall (`[V]`)**, **Rift-Portal (`[P]`)**, **Gravity Singularity (`[N]`)**, and **Polyomino Sigil (`[Z]`)** simultaneously!
