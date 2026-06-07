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

