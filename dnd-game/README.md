# 🏔️ Deague
### *An Interactive D&D Tabletop & AI Dungeon Master Campaign Engine*

Eldritch Ascent is a premium web-based, text-driven RPG experience combining the traditional structures of D&D 5e tabletop gaming with the power of generative AI. Set in the freezing High Pass of a dark fantasy mountain, players choose a hero, manage stats and equipment, engage in tactical combat, and watch their story unfold under a dynamic narrative system.

---

## 🌟 Key Features

### 1. 🔮 Gemini Infinite Dungeon Master (AI DM Mode)
Connect directly to the Gemini API (`gemini-2.5-flash`) for a consequence-driven campaign.
- **Dynamic Storytelling**: Every custom action typed by the player or choice selected is resolved dynamically by the AI.
- **Consequence-Aware Prompts**: The AI maintains context of your character class, remaining health, current inventory, and previous choices.
- **Detailed Dice Roll Context**: The exact base d20 roll, attribute modifiers, gear bonuses, and difficulty thresholds are passed to the AI to narrate customized, dramatic success or failure outcomes.

### 2. 📖 Cinematic Typewriter Prologue
Experience a highly atmospheric, ember-filled typing intro backstory prior to starting your adventure.
- **Static Campaign Mode**: Explores the classic, hand-crafted backstory of the mountain pass.
- **AI Campaign Mode**: Generates a 3-4 paragraph custom prologue backstory tailored to your class motivators and past failures using the Gemini API.

### 3. ⚔️ Tactical Combat & Checks
- **Round-Based Evasion & Efficacy**: Battle monsters like the Shadow-Hound using physical attacks, magic spells, and active dodging.
- **Dynamic Damage & Animation**: Features screen shake effects, visual damage popups, and state tracking.
- **Backpack Inventory**: Equip items to gain stats (e.g., *Steel Broadsword* grants +2 Strength Checks) or drink potions in real-time to heal.

### 4. 🎵 Procedural Sound FX Synth Engine
An audio synthesis system driven by the Web Audio API that creates custom, contextual soundscapes:
- Unique synth tones for selecting choices.
- Spellcasting/magical sparkles and heavy weapon strike impacts.
- Rolling d20 dice spin sounds.
- Victory melodies and failure chords.

---

## 🛠️ Tech Stack
- **Frontend Framework**: [React 18](https://reactjs.org/) + [Vite](https://vite.dev/)
- **Iconography**: [Lucide React](https://lucide.dev/)
- **AI Model Integration**: Google Gemini API via Fetch calls with strict JSON Response Schema enforcement
- **Styling**: Glassmorphic UI styled with vanilla CSS animations and Tailwind CSS variables
- **Audio**: Web Audio API Sound Synthesizer

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Lin18210/Deague.git
   cd Deague/dnd-game
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables. Create a `.env` file in the root of the `dnd-game` folder:
   ```env
   VITE_OPENROUTER_API_KEY=your_gemini_api_key_here
   VITE_AI_MODEL=google/gemini-2.5-flash
   ```

4. Launch the local development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/` in your browser to begin the ascent!

---

## 🗺️ Campaign Roadmap & Lore

The campaign consists of five distinct Acts, taking the player from the frozen peak to the depth of the Far Realm rift:

1. **Act 1: The High Pass — The Broken Seal**: Waking of the ancient runes, investigating the outpost, and the first skirmish with shadow hounds.
2. **Act 2: The Sunken Vault — Crypt of Malveth**: The silent elven city, parleying or fighting the corrupted Captain Malveth, and securing the Mythal-vial.
3. **Act 3: The Void Rift — Cultists of Zal'thrix**: Infiltrating the dark ritual at reality's edge, rescuing captives, and facing the Void Hierophant.
4. **Act 4: The Dwarven Under-Empire — Sewers of Kheldrak**: Navigating the ratfolk warrens, seeking pathfinding help from Hermit Bram, and reaching the inner sanctum.
5. **Act 5: The Dreaming One — Final Confrontation**: Facing Seraphax the Herald, using the Void-Anchor Shard, and deciding the fate of the Eye of the Void against Zal'thrix.

### 👥 Companion Stories
- **Lyra Dawnveil (Cleric)**: Plagued by visions of light fading under the mountain. She is the direct descendant of the high mage Coranthil Dawnveil who sealed the horror 3000 years ago.
- **Kael Thornblade (Rogue)**: Seeking a specific Zhentarim-looted forbidden book, "The Whispers of the Star-weaver," which holds secrets to powerful high-magic, while trying to escape his criminal past.
- **Vorn Ashmantle (Barbarian)**: Seeking vengeance against the specific shadow creatures that wiped out the Ashmantle clan three winters ago.




---

## August 2026 – Development Changelog

### New Features
- World map region definitions
- Save/load service with localStorage
- Achievement unlock system with notifications
- Adaptive difficulty scaling service
- Pub/sub event bus for decoupled game events
- Procedural weather system for outdoor scenes
- Ambient banter lines for companions during downtime
- New SFX: door, ambient wind, spell miss, XP gain, quest complete
- Custom hooks: useLocalStorage, useCombatLog, useGameTimer, usePartyStatus, useKeyboard, useFlashMessage, useAchievements, useWindowSize
- Game balance constants file
- Loot tables with tiered randomised drops
- Enemy lore / bestiary flavour text
- Side quest nodes (hermit cave)
- Epilogue wanderer ending node
- Companion ability lore descriptions
- Class lore blurbs and starting equipment flavour text

### UI Polish
- Tooltip popup component and CSS
- Scrollbar refinements across all panels
- HP bar colour thresholds (green/yellow/red)
- Combat log fade-in and striped rows
- Achievement banner slide-in animation
- Gold shimmer text effect for loot rewards
- Glass morphism panel utility
- Ripple effect for interactive buttons
- Void particle field and arcane orbit animations
- Weather overlay animations (rain, fog)
- Mobile responsive sidebar collapse
- Reduced-motion accessibility support
- Focus-visible keyboard accessibility ring
- Flash message types (info/warn/danger/success)

---

## September 2026 – Master Campaign Engine Update

### ⚔️ Tactical Combat & Encounters
- **Enemy Intent Prediction System**: Monsters telegraph upcoming tactical actions (Heavy Strike, Channeling Void Magic, Bracing Shield, Poison Spit) with threat ratings.
- **Tactical Combat Retreat**: Flee active battles through DEX agility checks with opportunistic flank strike penalties and companion morale shifts.
- **Turn-based Status Effects**: Bleed, Poison, Burn, Stun, and Haste status conditions with dynamic damage-over-time ticking and cleansing potions.
- **Spell Scroll Pouch**: Single-use arcane scrolls (Fireball, Divine Aegis, Rift Blink) allowing any hero class to unleash emergency magic.
- **Combat VFX Particle Canvas**: Lightweight 60fps HTML5 particle canvas rendering hit sparks, blood splatters, and tiered screen shake intensities.

### 🛡️ Equipment, Armory & Currency
- **Expanded Hero Armory**: Multi-slot paperdoll gear loadout (Weapon, Armor, Amulet, Relic) with dynamic D&D 5e stat modifier calculations.
- **Tiered Item Rarity**: Color-coded rarity frames and glow borders (Common, Uncommon, Rare, Epic, Legendary).
- **Multi-Currency Wallet**: Live tracking of Gold Sovereigns, Soul Shards, and Ancient Relic Coins with HUD widget.
- **Spoils of Conquest Modal**: 3D card-flip victory loot reveal screen with item inspection and coin pickups.

### 🏕️ World, Lore & Campfire
- **Campfire Rest System**: D&D 5e short rest hit die recovery and full night encampment restoring health and dispelling curses.
- **Bestiary Grimoire**: Complete monster dossier cataloging creature vulnerabilities, elemental resistances, and combat tactics.
- **Quest Tracker Overlay**: Collapsible pinned HUD widget with objective milestone checklist and completion strikethrough.
- **The Ascent Chronicle**: Illustrated campaign timeline documenting pivotal choices, companion fates, and Act conclusions.
- **Dialogue Transcript Archive**: Searchable conversation history log preserving all Dungeon Master narrations and party interactions.

### 🎨 Themes & Customization
- **Atmospheric Palette Presets**: High Pass Onyx, Crimson Blood Moon, and Abyssal Azure themes selectable on the fly.
- **Persistent Game Settings**: Dedicated settings menu for Master/SFX volume, text animation speed, and reduced motion toggles.
- **Multi-Slot Save Archives**: Support for 3 distinct campaign save slots with level, location, and playtime metadata.
- **Keyboard Shortcuts Engine**: Quick navigation hotkeys (1-4 for choices, Space for dice, F5 quicksave, F9 quickload, '?' guide).

