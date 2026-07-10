/**
 * ELDRITCH ASCENT — FULL CAMPAIGN STORY NODES
 *
 * Five Acts spanning the High Pass, the Sunken Vault, the Void Rift,
 * the Dwarven Under-Empire, and the Chamber of the Dreaming One.
 *
 * Node structure:
 * {
 *   title: string,
 *   text: string,
 *   visualType: 'hearth' | 'arcane' | 'battle' | 'camp' | 'void' | 'dungeon',
 *   act: number (1-5),
 *   damage?: number,
 *   loot?: { id, name, desc, type, value?, statBonus?, equipped? },
 *   heal?: number,
 *   choices: [
 *     { text, nextNode? } |
 *     { text, check: { stat, difficulty, successNode, failNode } } |
 *     { text, combatStart: true, enemyGroup: string, nextNode: string }
 *   ]
 * }
 */

export const STORY_NODES = {

  // ═══════════════════════════════════════════
  // ACT I — THE HIGH PASS: THE BROKEN SEAL
  // ═══════════════════════════════════════════

  intro: {
    title: "An Outpost Under Shadow",
    act: 1,
    actLabel: "ACT I — THE HIGH PASS",
    text: "The campfire crackles weakly against the freezing gales sealing the High Pass. You huddle among the ruins of a Zhentarim trading outpost, its banners long since shredded by the relentless mountain wind. Beneath your boots, a rhythmic thrum shakes the ancient stone — deep in the forgotten chambers below, a three-thousand-year-old magic seal has finally given way. Runes carved into the cave walls bleed crimson light, and the temperature drops ten degrees as a distant, inhuman wail echoes from the dark below.",
    visualType: "hearth",
    choices: [
      { text: "Grip your weapon and approach the bleeding runestones for a closer look.", nextNode: "approach_seal" },
      { text: "Recite the Warding Litany of Ioun to attempt to stabilize the tremors.", nextNode: "stabilize_ward" },
      { text: "Search the outpost ruins for supplies before descending.", nextNode: "search_outpost" }
    ]
  },

  search_outpost: {
    title: "Ransacked Outpost",
    act: 1,
    text: "You rummage through overturned crates and frost-encrusted saddlebags. Most have been raided — by whom or what, you dare not guess. But wedged beneath a collapsed bunk frame you find a sealed healing kit, and pinned to the wall by a black-iron dagger is a note in Elvish script: *'The Seal of Zal'thrix was forged in -892 DR by the high mages of Myth Drannor. It must not open. —Coranthil, Last Warden.'* The dagger glows faintly with residual ward-magic.",
    visualType: "hearth",
    loot: { id: "kit_1", name: "Field Healing Kit", desc: "Consumable. Restores 12 HP and removes one status effect.", type: "potion", value: 12 },
    choices: [
      { text: "Pocket the kit and take the warden's dagger. Approach the runestones.", nextNode: "approach_seal" },
      { text: "The note is alarming. Try to recite the Warding Litany first.", nextNode: "stabilize_ward" }
    ]
  },

  approach_seal: {
    title: "The Bleeding Runes",
    act: 1,
    text: "As you step near the portal arch, runic inscriptions flare with blinding lavender fire — the unmistakable signature of Myth Drannoran high magic corrupted at its root. The scent of hot ozone and sulfur fills your lungs. A violent fracture splits the stone portal with a sound like a thundercrack. Through the dense cloud of stone dust and eldritch sparks, you hear mechanical grinding — the ancient gear-lock mechanism failing — followed by a menacing, many-throated growl rising from below.",
    visualType: "arcane",
    choices: [
      { text: "[DEXTERITY DC 12] Vault backward over the crumbling masonry before the portal collapses on you!", check: { stat: "dexterity", difficulty: 12, successNode: "vault_success", failNode: "vault_fail" } },
      { text: "[STRENGTH DC 13] Plant your shield arm and endure the kinetic shockwave!", check: { stat: "strength", difficulty: 13, successNode: "shield_success", failNode: "shield_fail" } },
      { text: "Stand your ground and wait. Let the collapse finish before moving.", nextNode: "wait_collapse" }
    ]
  },

  wait_collapse: {
    title: "The Dust Settles",
    act: 1,
    text: "You press yourself flat against the cavern wall as tonnes of ancient masonry thunder down. The portal arch collapses into rubble, but a secondary passage — previously hidden — is now revealed: a narrow stairwell hewn directly into the living rock, sealed with a chain-linked iron gate. The gate swings open on its own, as though bidding you entry. From below, the growling has multiplied.",
    visualType: "hearth",
    choices: [
      { text: "Descend the stairwell into the darkness below.", nextNode: "act1_descent" }
    ]
  },

  stabilize_ward: {
    title: "Aether Restabilization",
    act: 1,
    text: "Focusing your spiritual reserves, you sketch geometric arcane lines in the frigid air with two fingers. The raw bleeding magic of the runestones begins to feed on your spellwork — it recognizes the harmonic structure of your warding but the seals are centuries too degraded. The vibrations slow, then stutter. You buy yourself precious seconds, but the gate still opens with a grinding moan, revealing a dark stone staircase and the smell of ancient death drifting upward.",
    visualType: "arcane",
    choices: [
      { text: "[INTELLIGENCE DC 13] Decode the glowing runic equations and lock the inner threshold completely.", check: { stat: "intelligence", difficulty: 13, successNode: "lock_success", failNode: "lock_fail" } },
      { text: "Light a torch and cautiously descend the revealed staircase.", nextNode: "act1_descent" }
    ]
  },

  vault_success: {
    title: "Lightfoot Acrobatics",
    act: 1,
    text: "With a clean backward leap, you propel yourself clear. Heavy monolithic slabs crash exactly where you stood, throwing shards of carved granite in all directions. The dust hangs thick in the torchlight. When it clears, you spot a narrow side passage carved behind the collapsed arch — old Elven script runs along its lintel: *'Those who flee wisely shall find the path that remains.'*",
    visualType: "hearth",
    choices: [
      { text: "Enter the hidden side passage.", nextNode: "act1_descent" }
    ]
  },

  vault_fail: {
    title: "Trapped in the Debris",
    act: 1,
    text: "You stumble over a loose slate tile and pitch forward. A heavy shard of ancient masonry clips your shoulder with crushing force, pinning your traveling coat. You wrench yourself free with a grunt of pain — the impact has bruised your shoulder and dented your pauldron, but you live. The passage is now open before you.",
    visualType: "hearth",
    damage: 7,
    choices: [
      { text: "Recover and limp forward into the open passage.", nextNode: "act1_descent" }
    ]
  },

  shield_success: {
    title: "Immovable Bastion",
    act: 1,
    text: "You dig your heels into the stone floor and raise your guard. The kinetic blast tears through the chamber, creating brilliant arcs of eldritch energy but leaving you completely unharmed. You look up — the passage into the crypt lies clear before you. In the settling glow, you notice something glinting in a shallow alcove: a small vial of radiant liquid.",
    visualType: "hearth",
    loot: { id: "potion_s1", name: "Philter of Fortitude", desc: "Consumable. Restores 10 HP and grants temporary +1 CON.", type: "potion", value: 10 },
    choices: [
      { text: "Claim the vial and march forward through the broken threshold.", nextNode: "act1_descent" }
    ]
  },

  shield_fail: {
    title: "Crushed Defenses",
    act: 1,
    text: "The sheer kinetic energy is immense — the blast hammers your shield arm backward into your chest, cracking the guard entirely. You are thrown onto the wet cavern floor with the breath knocked from your lungs. Your shield arm rings with pain, but the way down is open. Behind you, the cave entrance collapses completely. There is no retreat now.",
    visualType: "hearth",
    damage: 9,
    choices: [
      { text: "Stagger to your feet and descend into the dark.", nextNode: "act1_descent" }
    ]
  },

  lock_success: {
    title: "The Threshold Sealed",
    act: 1,
    text: "Your fingers trace the ancient glyphs with precise, practiced movements, altering their core resonance parameters. The bleeding runes flicker — then crystallize into stable, golden radiance. You have not stopped the opening, but you have slowed and tempered it significantly. As the magic settles, a hidden compartment pops open in the wall: a warding charm and a full healing potion, left by the Last Warden for whoever might follow.",
    visualType: "arcane",
    loot: { id: "potion_2", name: "Warden's Healing Draught", desc: "Consumable. Restores 20 HP and removes poison effects.", type: "potion", value: 20 },
    choices: [
      { text: "Pocket the reward and descend the now-stabilized stairs.", nextNode: "act1_descent" }
    ]
  },

  lock_fail: {
    title: "Arcane Backlash",
    act: 1,
    text: "A sharp, rising hum fills the chamber, and then a shocking blue bolt of arcane lightning erupts from the wall rune. The magical discharge tears through your body, burning away spell-prepared energy and leaving every nerve screaming. The walls begin to buckle and crack as the backlash cascades through the stonework. You must flee downward now.",
    visualType: "arcane",
    damage: 10,
    choices: [
      { text: "Flee down the stairs to escape the collapsing chamber.", nextNode: "act1_descent" }
    ]
  },

  // ACT I — Interior: The First Descent
  act1_descent: {
    title: "The First Descent",
    act: 1,
    text: "The stone staircase spirals down for what feels like a quarter mile, the air growing warmer and thick with the scent of volcanic sulfur and old incense. The walls are carved with intricate Elvish murals — towering figures in ceremonial robes holding a glowing orb aloft, while below them writhe endless tentacled shapes being pushed back into a void. At the base of the stairs, the passage opens into a vast antechamber lit by still-functioning Continual Flame torches mounted in iron sconces. Two passages branch before you.",
    visualType: "dungeon",
    choices: [
      { text: "Study the murals more closely — they may contain clues about what awaits below.", nextNode: "act1_murals" },
      { text: "Take the left passage, which is larger and shows signs of recent footprints.", nextNode: "act1_left_passage" },
      { text: "Take the right passage, which is narrower but has a faint light emanating from its depths.", nextNode: "act1_right_passage" }
    ]
  },

  act1_murals: {
    title: "Myths Carved in Stone",
    act: 1,
    text: "You hold your torch close and study the carvings. Your knowledge of ancient history pieces together the story: In -892 DR, the high mages of Myth Drannor descended to this mountain after tracking a *Dreaming One* — an aboleth-lich of immense power — that had been seeding mental parasites into the populace of the Moonsea region. They fought it here for forty days, and when they could not destroy it, they sealed it in the deepest vault using a Mythal-fragment as the anchor. The final panel shows the lead mage, Coranthil Dawnveil, sacrificing her own lifeforce to complete the seal. The seal has now broken. You understand what is waking below.",
    visualType: "arcane",
    loot: { id: "lorebook_1", name: "Warden's Carved History", desc: "Lore Item. Details the sealing of Zal'thrix in -892 DR by Coranthil Dawnveil.", type: "tool", equipped: false },
    choices: [
      { text: "This knowledge is vital. Take the left passage (recent footprints).", nextNode: "act1_left_passage" },
      { text: "The right passage emits light — that could be arcane or it could be a trap.", nextNode: "act1_right_passage" }
    ]
  },

  act1_left_passage: {
    title: "The Hound's Territory",
    act: 1,
    text: "The left passage leads into a broad guardroom, its floor strewn with shattered bones and scraps of black leather armour. The footprints end here — they belong to someone who never made it back. Claw marks three inches deep rake the walls, and the smell of void-energy is overwhelming. Suddenly, the shadows in the far corner begin to coagulate, drawing inward. Twin points of purple fire ignite in the darkness. A Shadow-Hound — a beast formed of condensed void-energy and predatory instinct — steps into the torchlight and fixes you with its burning gaze.",
    visualType: "battle",
    choices: [
      { text: "Draw your weapon and charge — meet the beast head on!", combatStart: true, enemyGroup: "lone_shadow_hound", nextNode: "act1_hound_victory" },
      { text: "[CHARISMA DC 14] Command it with supernatural authority — bellow a Banishment phrase in Elvish!", check: { stat: "charisma", difficulty: 14, successNode: "act1_intimidate_success", failNode: "act1_intimidate_fail" } },
      { text: "[WISDOM DC 14] Read the hound's movements. Project pure calm empathy and attempt to pacify it.", check: { stat: "wisdom", difficulty: 14, successNode: "act1_pacify_success", failNode: "act1_intimidate_fail" } }
    ]
  },

  act1_right_passage: {
    title: "The Warden's Side Room",
    act: 1,
    text: "The narrow right passage ends in a small circular chamber that must have served as a meditation or prayer room — a stone altar stands in the center beneath a permanently-cast *Moonbeam* spell that has been sustaining itself on ambient magic for centuries. On the altar sits a bowl of preserved spell components, a sealed letter, and a short sword with a blade of pure pale silver.",
    visualType: "arcane",
    loot: { id: "sword_silver", name: "Coranthil's Warding Blade", desc: "Silvered shortsword. +2 to STR Checks when equipped. Deals bonus damage to undead and shadow creatures.", statBonus: { strength: 2 }, type: "weapon", equipped: false },
    choices: [
      { text: "Read the sealed letter before proceeding.", nextNode: "act1_sealed_letter" },
      { text: "Take the blade and push forward through the left passage.", nextNode: "act1_left_passage" }
    ]
  },

  act1_sealed_letter: {
    title: "Last Words of the Warden",
    act: 1,
    text: "The letter is brittle with age but the ink has been preserved by a mild Prestidigitation spell. It reads: *'To whatever wanderer finds this: The Dreaming One sleeps yet, but not for long. The Seal of Mythal cannot be repaired — only the Eye of the Void, the artifact used to anchor the original Mythal-fragment, can reestablish the binding. It lies in the deepest vault. Coranthil's bloodline alone may wield it. I pray that bloodline has survived. Do not let the Herald reach the surface. —Thaelon, Second Warden, 341 DR'*. Three thousand years of preparation. Now it falls to you.",
    visualType: "arcane",
    choices: [
      { text: "With the stakes clear, enter the left passage to confront what stalks there.", nextNode: "act1_left_passage" }
    ]
  },

  act1_intimidate_success: {
    title: "The Beast Cowed",
    act: 1,
    text: "Your voice booms with supernatural authority, resonating off the ancient stone in a perfect harmonic pattern that triggers the Elvish banishment phrase. The Shadow-Hound staggers, its burning eyes flickering from predatory focus to sudden, primal terror. It releases a high, pained keen — and then dissolves into harmless dark ash that settles on the floor. Where it stood, a glowing amulet remains: the hound's void-crystal core, ejected by the banishment. It pulses with condensed charismatic power.",
    visualType: "arcane",
    loot: { id: "amulet_command", name: "Void-Crystal Command Amulet", desc: "Adds +2 to Charisma Checks when equipped. Glows faintly in the presence of shadow creatures.", type: "weapon", statBonus: { charisma: 2 }, equipped: true },
    choices: [
      { text: "Claim the amulet. Rest briefly at the camp site before going deeper.", nextNode: "act1_camp" },
      { text: "Claim the amulet and press forward without rest.", nextNode: "act1_vault_entrance" }
    ]
  },

  act1_pacify_success: {
    title: "Shadow Bonded",
    act: 1,
    text: "You hold absolutely still, projecting a field of calm empathy that overrides the hound's predatory programming. Its burning eyes soften from violet rage to a flickering, confused blue. It moves toward you hesitantly, sniffs at your outstretched hand, and then dissolves into a warm silver mist that winds around your wrist and crystallizes into a ring of dark metal. The ring carries the creature's emotional signature — a strange, deep bond with the shadows themselves.",
    visualType: "arcane",
    loot: { id: "ring_empathy", name: "Ring of Shadow Empathy", desc: "Adds +2 to Wisdom Checks when equipped. Shadow creatures are less likely to attack you first.", type: "weapon", statBonus: { wisdom: 2 }, equipped: true },
    choices: [
      { text: "Wear the ring. Rest briefly before going deeper.", nextNode: "act1_camp" },
      { text: "Wear the ring and press forward immediately.", nextNode: "act1_vault_entrance" }
    ]
  },

  act1_intimidate_fail: {
    title: "Feral Fury",
    act: 1,
    text: "The Shadow-Hound snarls, completely unfazed by your attempt — if anything, the sound has excited its predatory instincts further. It lunges with terrifying speed, claws raking across your exposed side before you can fully react. The touch of its void-cold claws sends ice through your veins.",
    visualType: "battle",
    damage: 5,
    choices: [
      { text: "Draw your weapon and fight!", combatStart: true, enemyGroup: "lone_shadow_hound", nextNode: "act1_hound_victory" }
    ]
  },

  act1_hound_victory: {
    title: "The Hound Dissolved",
    act: 1,
    text: "With a final decisive blow, the Shadow-Hound dissipates into a cloud of dark ash and bitter cold air. The void-energy that animated it spirals briefly, then collapses inward — a small shockwave of released power that rattles the torch sconces. On the floor where it fell, you find a clawed pendant of black obsidian: the creature's void-crystal core. The guardroom is quiet now. Only the distant sound of something large moving deeper in the vault reaches you.",
    visualType: "arcane",
    loot: { id: "pendant_void", name: "Void-Crystal Pendant", desc: "Adds +1 to Constitution Checks when worn. Faintly warm to the touch.", type: "weapon", statBonus: { constitution: 1 }, equipped: false },
    choices: [
      { text: "Rest for a moment to tend wounds before pressing on.", nextNode: "act1_camp" },
      { text: "The noise from deeper inside grows louder — press forward now.", nextNode: "act1_vault_entrance" }
    ]
  },

  act1_camp: {
    title: "Respite in the Dark",
    act: 1,
    text: "You find a defensible corner of the antechamber and make a brief camp — no bedroll, just your back against the wall and a shielded torch. The silence of the deep mountain presses in around you. You eat a strip of salted provisions, tend your wounds with practiced efficiency, and spend a few minutes studying the passages ahead. Your companions circle the area, keeping watch. The rest is brief but restorative. The sounds from below have quieted for now. Whatever stirs in the vault has either retreated or is waiting.",
    visualType: "camp",
    heal: 8,
    choices: [
      { text: "Recharged. Move forward to the Vault entrance.", nextNode: "act1_vault_entrance" }
    ]
  },

  act1_vault_entrance: {
    title: "Gates of the Sunken Vault",
    act: 1,
    text: "The antechamber ends at a massive iron gate, twenty feet tall, worked with relief sculptures of dragons and serpents devouring one another in an endless cycle. The gate bears a plaque in ancient Common: *'VAULT OF THE SUNKEN EMPIRE — HOUSE EMBERVANE — THE DEAD KEEP THEIR OATHS.'* The gate stands ajar — already forced open from within. Beyond it, a grand staircase descends into what appears to be an underground city. Ghostly lights drift between distant towers of black stone. You have reached the edge of the ancient under-empire.",
    visualType: "dungeon",
    choices: [
      { text: "Descend the grand staircase into the Sunken Vault.", nextNode: "act2_arrival" }
    ]
  },

  // ═══════════════════════════════════════════
  // ACT II — THE SUNKEN VAULT: CRYPT OF MALVETH
  // ═══════════════════════════════════════════

  act2_arrival: {
    title: "The City That Sleeps",
    act: 2,
    actLabel: "ACT II — THE SUNKEN VAULT",
    text: "You emerge on a wide stone promenade overlooking an underground city that has slumbered for three millennia. Impossible architecture of black stone and pale marble rises in tiers — palaces, temples, markets, and barracks all silent and still under the light of crystal lamps that never die. A cold river of luminescent silver liquid — raw Mythal-energy bleeding from the broken seal — winds through the valley floor. This was once the seat of the under-empire of House Embervane, an offshoot of the ancient elven courts who retreated underground when the Crown Wars shattered the surface world. Now it is a crypt. Three distinct areas lie within easy reach.",
    visualType: "dungeon",
    choices: [
      { text: "Head toward the massive temple structure — its doors stand open and light flickers within.", nextNode: "act2_temple" },
      { text: "Explore the market district — perhaps supplies or useful tools remain.", nextNode: "act2_market" },
      { text: "Follow the silver river — it likely leads toward the vault's center.", nextNode: "act2_silver_river" }
    ]
  },

  act2_market: {
    title: "The Eternal Market",
    act: 2,
    text: "The market stalls stand exactly as they were the day the city was sealed — goods arranged for sale, price tablets intact, even the dust disturbed only by your footsteps. Most of the goods have long since decayed, but preserved by the ambient Mythal-energy, some remain perfectly intact. You find a rack of alchemical supplies, still potent. A soft sound — the shuffle of bone on stone — makes you freeze. Something moves between the stalls.",
    visualType: "dungeon",
    choices: [
      { text: "[DEXTERITY DC 11] Duck behind a stall and observe quietly — don't spook whatever it is.", check: { stat: "dexterity", difficulty: 11, successNode: "act2_market_sneak", failNode: "act2_market_spotted" } },
      { text: "Call out in Elvish — perhaps it is a survivor or a bound guardian who can be reasoned with.", nextNode: "act2_market_call" },
      { text: "Draw your weapon and investigate the sound.", nextNode: "act2_market_encounter" }
    ]
  },

  act2_market_sneak: {
    title: "The Bone Walker",
    act: 2,
    text: "You slip silently behind an overturned stone counter. Between the stalls, a skeletal figure in tattered ceremonial robes shuffles along a fixed patrol path, muttering to itself in an ancient dialect of Elvish. It is following a route it has walked for three thousand years — loyal even in undeath. It does not see you. As it passes, you spot a locked strongbox beneath the counter you are hiding behind.",
    visualType: "dungeon",
    loot: { id: "scroll_warding", name: "Scroll of Warding Glyphs", desc: "Grants a one-time +3 bonus to AC for one combat encounter when used.", type: "tool", equipped: false },
    choices: [
      { text: "Pocket the strongbox contents and sneak onward toward the temple.", nextNode: "act2_temple" },
      { text: "Follow the skeleton quietly — it may lead you somewhere useful.", nextNode: "act2_market_follow" }
    ]
  },

  act2_market_spotted: {
    title: "Alerted!",
    act: 2,
    text: "Your boot scrapes on a shard of broken pottery. The skeletal guardian snaps its head toward the sound, empty eye sockets blazing with pale violet light. It releases a hollow screech — an alarm-call — and lunges toward you with a corroded bronze blade!",
    visualType: "battle",
    choices: [
      { text: "Fight the skeleton guardian!", combatStart: true, enemyGroup: "crypt_guardians", nextNode: "act2_skeleton_victory" }
    ]
  },

  act2_market_call: {
    title: "The Loyal Dead",
    act: 2,
    text: "You call out in Elvish — the ancient tongue of House Embervane. The skeletal guardian freezes mid-stride. Slowly, it turns to face you. The violet light in its eye sockets dims to a soft, questioning blue. It speaks in a voice like dry leaves: *'Visitor... you wear the old tongue like a mantle. What business do you have in the city of the Sealed House? The vault is not yet ready to receive guests.'* It is not immediately hostile — a bound guardian still following its last standing orders.",
    visualType: "arcane",
    choices: [
      { text: "[CHARISMA DC 13] Convince it that you are an envoy sent to reinspect the Seal.", check: { stat: "charisma", difficulty: 13, successNode: "act2_guardian_convinced", failNode: "act2_market_encounter" } },
      { text: "[INTELLIGENCE DC 14] Invoke the Name of Coranthil Dawnveil — the original Warden — as your authority.", check: { stat: "intelligence", difficulty: 14, successNode: "act2_guardian_convinced", failNode: "act2_market_encounter" } }
    ]
  },

  act2_market_follow: {
    title: "The Patrol Route",
    act: 2,
    text: "You shadow the skeleton for ten minutes as it completes its circuit. Its route ends at a small shrine room you would not have found otherwise. Inside: offerings still arranged on a altar, and — remarkably — a sealed vial of *Potion of Greater Healing* placed there by a living person as recently as fifty years ago. Someone else has been here before you. More recently than the sealing.",
    visualType: "dungeon",
    loot: { id: "potion_greater", name: "Potion of Greater Healing", desc: "Consumable. Restores 25 HP.", type: "potion", value: 25 },
    choices: [
      { text: "Take the potion and head to the temple.", nextNode: "act2_temple" }
    ]
  },

  act2_market_encounter: {
    title: "Guardian Awakened",
    act: 2,
    text: "The skeletal guardian, triggered by your presence, activates its full battle protocol. The corroded blade snaps to a guard position, and the violet light blazes back to full strength. From deeper in the market, two more skeleton warriors begin marching toward your position — they must have been dormant in alcoves, waiting.",
    visualType: "battle",
    choices: [
      { text: "Stand and fight the crypt guardians!", combatStart: true, enemyGroup: "crypt_guardians", nextNode: "act2_skeleton_victory" }
    ]
  },

  act2_guardian_convinced: {
    title: "Ancient Deference",
    act: 2,
    text: "The skeleton bows with cracking formality. *'The name of the First Warden carries weight in this house still. You may pass without challenge. But be warned — the inner sanctum is held by Malveth, and Malveth answers to none but the Dreaming One now. The Captain has... changed.'* The guardian steps aside. It presses a brass key into your palm — a key to the inner library vault.",
    visualType: "arcane",
    loot: { id: "key_library", name: "Brass Library Key", desc: "Opens the inner library of the Sunken Vault. A key item.", type: "tool", equipped: false },
    choices: [
      { text: "Head to the inner library with the key.", nextNode: "act2_library" },
      { text: "Go directly to the main temple.", nextNode: "act2_temple" }
    ]
  },

  act2_silver_river: {
    title: "The Mythal Bleed",
    act: 2,
    text: "You follow the silver river to its source — a massive crack in the vault floor that glows with the raw Mythal-energy once sealed inside the Eye of the Void. The energy is slowly draining away, meaning the anchor's binding on the Dreaming One grows weaker with every minute. You crouch by the riverbank and study the flow. You might be able to partially re-channel it, buying more time — but the effort would tax your magical reserves.",
    visualType: "arcane",
    choices: [
      { text: "[INTELLIGENCE DC 15] Attempt to partially re-channel the Mythal flow back into the crack.", check: { stat: "intelligence", difficulty: 15, successNode: "act2_river_success", failNode: "act2_river_fail" } },
      { text: "[WISDOM DC 14] Read the flow's direction — it may reveal where the Eye of the Void is located.", check: { stat: "wisdom", difficulty: 14, successNode: "act2_river_trace", failNode: "act2_temple" } },
      { text: "The river is too dangerous to interact with. Follow it to the temple instead.", nextNode: "act2_temple" }
    ]
  },

  act2_river_success: {
    title: "Channeled Brilliance",
    act: 2,
    text: "Your hands plunge into the silver flow and you reshape its momentum with practiced geometric precision — a minor Mythal-working, but effective. The crack seals slightly; the drain slows by perhaps a quarter. The Dreaming One's awakening has been delayed. The effort leaves you drained but enlightened. The silver residue clinging to your hands has hardened into a faint protective aura.",
    visualType: "arcane",
    heal: 5,
    choices: [
      { text: "Proceed to the temple, hopefully with more time to work.", nextNode: "act2_temple" }
    ]
  },

  act2_river_fail: {
    title: "Mythal Rejection",
    act: 2,
    text: "The raw Mythal-energy resists your intervention, surging upward and throwing you back from the river with a sharp arcane discharge. The silver fire burns your hands and forearms, leaving scorch marks that throb with every heartbeat. The flow continues unabated.",
    visualType: "arcane",
    damage: 8,
    choices: [
      { text: "Recover and head to the temple.", nextNode: "act2_temple" }
    ]
  },

  act2_river_trace: {
    title: "Following the Source",
    act: 2,
    text: "You read the flow with a careful, meditative focus. The Mythal-energy originates from a deep chamber directly beneath the temple — this confirms the Eye of the Void is in the vault's deepest sanctum. More importantly, you sense two presences down there: something ancient and immense that is still mostly asleep, and something smaller, corrupted, and very much awake. The Crypt Lord Malveth awaits.",
    visualType: "arcane",
    choices: [
      { text: "Armed with this knowledge, head to the temple.", nextNode: "act2_temple" }
    ]
  },

  act2_skeleton_victory: {
    title: "Bones to Dust",
    act: 2,
    text: "The skeleton guardians clatter to the ground, their binding magic shattered by your assault. The violet light dies from their eyes. In the sudden silence, you can hear the faint sound of chanting coming from the temple complex ahead — multiple voices, rhythmic and low. They are not skeleton voices. There are living cultists in this vault.",
    visualType: "arcane",
    choices: [
      { text: "Investigate the temple and the source of the chanting.", nextNode: "act2_temple" }
    ]
  },

  act2_temple: {
    title: "The Temple of the Sealed House",
    act: 2,
    text: "The temple's vaulted interior soars to a hundred-foot ceiling, lit by pale blue fire in iron braziers. At the far end, a massive obsidian throne dominates the dais — and upon it sits a figure in black armour, helm carved into the likeness of a skull, fingers drumming slowly on the armrests. This is the Crypt Lord Malveth, former Captain of the Embervane Guard, now bound in undeath to serve the Dreaming One. Flanking the throne, a dozen skeleton soldiers stand at attention. Malveth's helm swivels as you enter. *'Another living fool descends into my house,'* the ancient voice intones. *'Tell me why I should not simply destroy you where you stand.'*",
    visualType: "dungeon",
    choices: [
      { text: "[CHARISMA DC 15] Assert yourself. Demand to parley — you come as an emissary, not an enemy.", check: { stat: "charisma", difficulty: 15, successNode: "act2_malveth_parley", failNode: "act2_malveth_fight" } },
      { text: "[INTELLIGENCE DC 15] Invoke the ancient Law of Hospitality of House Embervane — Malveth is still bound by it.", check: { stat: "intelligence", difficulty: 15, successNode: "act2_malveth_parley", failNode: "act2_malveth_fight" } },
      { text: "Skip diplomacy. Draw your weapon and charge the throne!", combatStart: true, enemyGroup: "crypt_lord", nextNode: "act2_malveth_victory" },
      { text: "Head to the inner library first to gather information.", nextNode: "act2_library" }
    ]
  },

  act2_library: {
    title: "The Inner Library",
    act: 2,
    text: "The library of the Sunken Vault is a cathedral of knowledge — shelves of preserved stone-etched tablets rising thirty feet, connected by iron catwalks. Remarkably intact. You spend precious minutes scanning the contents. The history of House Embervane is here in full — their flight underground, the War of Binding, and — critically — extensive notes on the nature of the Dreaming One, Zal'thrix. One entry reads: *'The Herald is the anchor's opposite — where the Eye of the Void binds Zal'thrix, the Herald is designed to unbind it. The Herald must not be allowed to complete the Calling Ritual.'*",
    visualType: "dungeon",
    loot: { id: "tome_embervane", name: "Chronicles of House Embervane", desc: "Lore Item. Contains detailed history of the under-empire and the nature of the Dreaming One.", type: "tool", equipped: false },
    choices: [
      { text: "Armed with this knowledge, go confront Malveth in the temple.", nextNode: "act2_temple" }
    ]
  },

  act2_malveth_parley: {
    title: "The Crypt Lord Listens",
    act: 2,
    text: "Malveth raises one gauntleted hand and the skeleton soldiers stand down. *'...You invoke old law. Very well. Speak your purpose, living one.'* In the tense silence that follows, you lay out what you know — the broken seal, the Mythal bleed, the Herald. Malveth is still for a long moment, then removes his helm. Beneath it is the desiccated but recognizable face of an elf lord — the last Embervane captain. His voice, when it comes again, carries grief. *'I know. I have been fighting the Dreaming One's influence on my own binding for three centuries. My soldiers are already mostly gone — claimed by the Void-whispers. I cannot accompany you further, but I can give you what you need.'*",
    visualType: "arcane",
    choices: [
      { text: "Ask Malveth what gift he can offer.", nextNode: "act2_malveth_gift" }
    ]
  },

  act2_malveth_gift: {
    title: "The Captain's Legacy",
    act: 2,
    text: "Malveth rises from the throne with the slow dignity of a king. He crosses to a sealed chest beside the dais and opens it. Inside: a crystal vial filled with concentrated Mythal-light, and a rolled map of the under-empire's lower levels, annotated in ancient Elvish. *'The Mythal-vial will let you interface with the Eye of the Void when you find it. The map shows you the route through the Void Rift to the deepest vault. And this—'* he presses a final item into your hands: a signet ring, *'—is the seal of House Embervane. The old wards still respond to it. Use it wisely.'*",
    visualType: "arcane",
    loot: { id: "vial_mythal", name: "Vial of Mythal-Light", desc: "Key Item. Required to interface with the Eye of the Void. Pulses with ancient elven magic.", type: "tool", equipped: false },
    choices: [
      { text: "Thank Malveth and proceed through the passage he has opened to the Void Rift.", nextNode: "act3_arrival" }
    ]
  },

  act2_malveth_fight: {
    title: "The Throne Room Erupts",
    act: 2,
    text: "Malveth's patience runs out. *'Impudence!'* The skeleton soldiers slam their spear-butts on the stone floor in unison. Malveth rises from the obsidian throne — impossibly tall in his full armour — and draws a massive black-iron greatsword from behind the throne's back. *'Then you shall join my guard!'*",
    visualType: "battle",
    choices: [
      { text: "Fight the Crypt Lord Malveth!", combatStart: true, enemyGroup: "crypt_lord", nextNode: "act2_malveth_victory" }
    ]
  },

  act2_malveth_victory: {
    title: "The Captain Falls",
    act: 2,
    text: "Malveth crashes to one knee, the black-iron greatsword clattering from his grip. His form flickers like a dying candle. *'...Thank you,'* he says, startlingly, his voice stripped of the void-corruption and unexpectedly sincere. *'Three centuries is too long for this hollow existence. Rest... finally...'* He collapses and dissolves into silver light. His armour remains, and within it — sealed in the chest-plate — the Mythal-vial he would have given willingly. You take it from the dissipating remains, along with his annotated map.",
    visualType: "arcane",
    loot: { id: "vial_mythal", name: "Vial of Mythal-Light", desc: "Key Item. Required to interface with the Eye of the Void. Pulses with ancient elven magic.", type: "tool", equipped: false },
    choices: [
      { text: "Take the map and vial. Find the passage deeper into the vault.", nextNode: "act2_deep_camp" }
    ]
  },

  act2_deep_camp: {
    title: "Rest Among the Ruins",
    act: 2,
    text: "The temple is yours now — silent, ancient, and strangely peaceful with the skeleton guardians gone. You make camp in the apse behind the dais, a naturally defensible position. Lyra tends to wounds while Kael scouts the surrounding corridors. Vorn sharpens his axe with methodical calm. By the time you've slept and eaten what meagre provisions remain, the silence of the under-empire feels less oppressive and more sacred — a memorial to those who gave everything to contain what sleeps below.",
    visualType: "camp",
    heal: 12,
    choices: [
      { text: "Rested and prepared. Descend toward the Void Rift.", nextNode: "act3_arrival" }
    ]
  },

  // ═══════════════════════════════════════════
  // ACT III — THE VOID RIFT: CULTISTS OF ZAL'THRIX
  // ═══════════════════════════════════════════

  act3_arrival: {
    title: "The Edge of the Rift",
    act: 3,
    actLabel: "ACT III — THE VOID RIFT",
    text: "The passage descends through geology itself — from dressed stone to raw rock to something that doesn't look like rock at all. The walls shift to a crystalline material of midnight blue, shot through with veins of pulsing violet light. The air pressure changes; sounds become muffled and distant. You can feel the Void now — not just as a concept but as a physical force pressing against your mind, testing the edges of your thoughts. Ahead, the passage opens onto a vast natural cavern dominated by a tear in reality itself: the Void Rift, thirty feet tall and crackling with eldritch energy. Around it, small fires burn in organized patterns — and figures in dark robes move between them, performing rituals.",
    visualType: "void",
    choices: [
      { text: "Observe the cultists from concealment. Study their ritual before acting.", nextNode: "act3_observe" },
      { text: "[DEXTERITY DC 12] Attempt to infiltrate the camp undetected and sabotage the ritual.", check: { stat: "dexterity", difficulty: 12, successNode: "act3_infiltrate", failNode: "act3_detected" } },
      { text: "Charge into the camp and disrupt the ritual by force!", combatStart: true, enemyGroup: "void_cultists", nextNode: "act3_cultist_victory" }
    ]
  },

  act3_observe: {
    title: "Watching the Ritual",
    act: 3,
    text: "From the shadows of a crystal column, you observe. The cultists are chanting in Deep Speech — the language of aberrations and Far Realm entities. Their ritual is systematic: three circles of power, each feeding into the Rift. The outermost circle seems to be a protective ward; the middle one is a channeling conduit; the innermost is where their hierophant stands, arms raised toward the Rift. You also notice: two cultists are guarding a prisoner — someone tied to a post near the inner circle. Alive, from the looks of it.",
    visualType: "void",
    choices: [
      { text: "[INTELLIGENCE DC 14] Identify the ritual structure and find the keystone — destroy it to collapse all three circles.", check: { stat: "intelligence", difficulty: 14, successNode: "act3_keystone_found", failNode: "act3_observe_fail" } },
      { text: "The prisoner! Sneak to free them first — they may be an ally.", nextNode: "act3_rescue_attempt" },
      { text: "You've seen enough. Storm the ritual camp!", combatStart: true, enemyGroup: "void_cultists", nextNode: "act3_cultist_victory" }
    ]
  },

  act3_keystone_found: {
    title: "The Ritual Keystone",
    act: 3,
    text: "Your training in arcane theory pays off. The keystone is the hierophant's staff — without it, the three circles cannot maintain coherence. If you can destroy it, the ritual collapses. If the ritual collapses while the Rift is open, there will be a violent arcane discharge — but it will buy time. You'll need to get the staff away from the hierophant.",
    visualType: "void",
    choices: [
      { text: "[DEXTERITY DC 14] Strike from concealment, targeting the staff specifically.", check: { stat: "dexterity", difficulty: 14, successNode: "act3_staff_destroyed", failNode: "act3_detected" } },
      { text: "Fight your way to the hierophant and take the staff!", combatStart: true, enemyGroup: "void_cultists", nextNode: "act3_cultist_victory" }
    ]
  },

  act3_staff_destroyed: {
    title: "The Ritual Breaks",
    act: 3,
    text: "Your strike is precise and devastating — the staff shatters. For a moment, the rift blazes bright as a sun. Then the three ritual circles collapse inward in sequence, releasing a thunderclap of reversed void-energy. Cultists are thrown off their feet. The hierophant screams in agony as backlash consumes them. When the light clears, the immediate ritual is stopped — the Rift remains, but no longer growing. The surviving cultists scramble in confusion.",
    visualType: "void",
    choices: [
      { text: "Free the prisoner before the cultists regroup.", nextNode: "act3_prisoner_freed" },
      { text: "The Rift is momentarily destabilized — approach it now!", nextNode: "act3_rift_approach" }
    ]
  },

  act3_observe_fail: {
    title: "Partial Understanding",
    act: 3,
    text: "You can't fully parse the ritual's structure — Deep Speech theory was never your strongest discipline. But you gather enough to know: the hierophant is the critical element. Take them down and the ritual stalls. You'll have to do this the direct way.",
    visualType: "void",
    choices: [
      { text: "Fight the cultists!", combatStart: true, enemyGroup: "void_cultists", nextNode: "act3_cultist_victory" }
    ]
  },

  act3_infiltrate: {
    title: "Ghost in the Dark",
    act: 3,
    text: "You ghost between the shadows cast by the ritual fires, moving counter-clockwise around the camp's outer perimeter. The ward circle doesn't react — it's designed to keep things from coming through the Rift, not from approaching from behind. You slip inside the camp's cordon and find yourself directly behind the hierophant. From here, you could end this ritual instantly.",
    visualType: "void",
    choices: [
      { text: "Strike the hierophant from behind — try to end the ritual in one blow!", combatStart: true, enemyGroup: "void_cultists", nextNode: "act3_cultist_victory" },
      { text: "First, free the prisoner tied to the post.", nextNode: "act3_rescue_attempt" }
    ]
  },

  act3_detected: {
    title: "Ambushed!",
    act: 3,
    text: "A cultist patrol you didn't see rounds the crystal column. *'INTRUDERS! The Dreaming One commands — DESTROY THEM!'* The entire camp erupts into violent motion.",
    visualType: "battle",
    damage: 4,
    choices: [
      { text: "Fight the void cultists!", combatStart: true, enemyGroup: "void_cultists", nextNode: "act3_cultist_victory" }
    ]
  },

  act3_rescue_attempt: {
    title: "The Prisoner",
    act: 3,
    text: "You reach the prisoner — a young woman in torn scholar's robes, half-conscious. Her forearms bear burn marks from void-energy exposure. As you cut her bonds she gasps and grabs your arm: *'Don't let them complete the Calling! The Herald is already through — it's been here for three days — it's in the lower vault preparing the final ritual! You have to stop it before the next moon hour!'* She tells you her name: Mira Aldric, a historian from Silverymoon who came to study the vault and was captured.",
    visualType: "dungeon",
    choices: [
      { text: "Get Mira to safety and then fight through the cultists.", combatStart: true, enemyGroup: "void_cultists", nextNode: "act3_cultist_victory_mira" },
      { text: "Ask Mira if she knows anything else before moving.", nextNode: "act3_mira_info" }
    ]
  },

  act3_mira_info: {
    title: "Scholar's Intelligence",
    act: 3,
    text: "Mira, despite her ordeal, thinks quickly. *'The Herald — they call it Seraphax — is not fully physical. It partially exists in the Void. Normal weapons do reduced damage to it. But—'* she reaches into her torn robe and produces a small crystalline spike, *'—I extracted this from the ritual focus. It's a Void-Anchor shard. Plunge it into Seraphax's core-form and it will force full materialization. Then you can destroy it properly.'* The Void-Anchor Shard could be a decisive advantage.",
    visualType: "arcane",
    loot: { id: "shard_void", name: "Void-Anchor Shard", desc: "Key Item. Forces a Void-creature to fully materialize when struck. One use. Critical against the Herald.", type: "tool", equipped: false },
    choices: [
      { text: "Armed with this intel, fight through the cultists and press deeper!", combatStart: true, enemyGroup: "void_cultists", nextNode: "act3_cultist_victory_mira" }
    ]
  },

  act3_cultist_victory: {
    title: "The Ritual Disrupted",
    act: 3,
    text: "The last cultist falls, the hierophant's staff shattering beneath your final blow. The three ritual circles collapse, releasing a thundering reversal of void-energy that shakes the entire cavern. The Rift still stands, but without the ritual focusing it, it ceases to grow. The howling of the Far Realm dims to a murmur. In the aftermath, you find the hierophant's notebook — in it, the complete layout of the lower vault and the Herald Seraphax's ritual timetable. You have hours, not days.",
    visualType: "arcane",
    loot: { id: "notebook_cultist", name: "Hierophant's Ritual Notes", desc: "Lore Item. Contains the lower vault layout and Seraphax's ritual timetable.", type: "tool", equipped: false },
    choices: [
      { text: "Rest briefly at the edge of the Rift before descending further.", nextNode: "act3_camp" },
      { text: "No time to rest. Find the passage to the lower vault.", nextNode: "act3_rift_approach" }
    ]
  },

  act3_cultist_victory_mira: {
    title: "Cultists Routed, Scholar Freed",
    act: 3,
    text: "The last cultist falls. Mira Aldric stands among the ruins of the ritual camp, binding her wrist with strips of torn robe. *'Thank you. I don't know how to fight, but I know these ruins better than anyone alive. Let me help you navigate the lower vault.'* She produces a detailed hand-drawn map of the passages below — her own work, compiled over weeks of captive observation. With Mira's expertise added to your growing knowledge, you feel significantly better prepared for what awaits.",
    visualType: "arcane",
    loot: { id: "map_lower", name: "Mira's Survey Map", desc: "Lore Item. Detailed map of the lower vault and passages to the Dreaming One's chamber.", type: "tool", equipped: false },
    choices: [
      { text: "Rest briefly — Mira needs the recovery time before going deeper.", nextNode: "act3_camp" },
      { text: "Press through the Rift passage now while the ritual is disrupted.", nextNode: "act3_rift_approach" }
    ]
  },

  act3_prisoner_freed: {
    title: "An Unexpected Ally",
    act: 3,
    text: "You reach the prisoner and cut her free — Mira Aldric, a scholar of ancient history from Silverymoon. Despite her wounds, her first words are tactical: *'The Herald is already below. Its ritual timetable runs by moon hours. You have limited time. Here—'* She presses a crystalline spike into your hands: a Void-Anchor Shard she extracted from the ritual focus. *'Force Seraphax to fully materialize with this. It's the only way to kill it completely.'*",
    visualType: "arcane",
    loot: { id: "shard_void", name: "Void-Anchor Shard", desc: "Key Item. Forces a Void-creature to fully materialize when struck. One use. Critical against the Herald.", type: "tool", equipped: false },
    choices: [
      { text: "Approach the destabilized Rift and pass through.", nextNode: "act3_rift_approach" }
    ]
  },

  act3_camp: {
    title: "Vigil at the Rift",
    act: 3,
    text: "You make a brief camp at the edge of the cavern, far enough from the Rift that its influence is manageable but close enough to maintain situational awareness. The void-light from the Rift casts everything in shifting shades of indigo and silver. Lyra leads a short prayer to Lathander; the warm morning-gold glow of her holy symbol seems defiant against the surrounding dark. Kael keeps watch while Vorn eats in complete silence. When you rise, you feel steadied — physically and mentally — against what awaits.",
    visualType: "camp",
    heal: 10,
    choices: [
      { text: "Step through the Rift passage and descend to the Under-Empire.", nextNode: "act3_rift_approach" }
    ]
  },

  act3_rift_approach: {
    title: "Through the Rift's Shadow",
    act: 3,
    text: "The passage through the Rift's shadow is not physical — it is a fold in space, anchored by the Void-energy bleeding from the broken seal. You step through and experience three seconds of absolute sensory silence — no sight, sound, touch, or thought — and then the world rushes back, different. You stand in a cavern of immense black stone, perfectly square, carved with mathematical precision. The Dwarven Under-Empire. The smell of ancient forges and millennia of stone dust fills your lungs. Below, something vast and old shifts in its sleep. The Dreaming One stirs.",
    visualType: "void",
    choices: [
      { text: "Descend deeper into the Dwarven Under-Empire.", nextNode: "act4_arrival" }
    ]
  },

  // ═══════════════════════════════════════════
  // ACT IV — THE DWARVEN UNDER-EMPIRE
  // ═══════════════════════════════════════════

  act4_arrival: {
    title: "The Forges of the Fallen Empire",
    act: 4,
    actLabel: "ACT IV — THE DWARVEN UNDER-EMPIRE",
    text: "The Dwarven under-empire built by Clan Kheldrak in the Second Sundering period is immediately recognizable from their characteristic square tunnels with ceiling channels designed for pipe-work and ventilation. The engineering is extraordinary even in ruin. Massive forge-halls, automated water systems now dry, smelting chambers, and residential warrens extend for miles in all directions. The empire died eight hundred years ago — not by war, but by the Dreaming One's corruption seeping upward through the stone, driving the population mad over generations until there was no one left.",
    visualType: "dungeon",
    choices: [
      { text: "Investigate the nearest forge-hall — perhaps still-functional equipment could help.", nextNode: "act4_forge_hall" },
      { text: "Head toward the residential warrens — survivors or clues may be there.", nextNode: "act4_warrens" },
      { text: "Push straight down the central processional — the fastest route to the lower vault.", nextNode: "act4_processional" }
    ]
  },

  act4_forge_hall: {
    title: "The Ancient Forge",
    act: 4,
    text: "The forge hall is massive — the central smelting furnace alone is the size of a small building. Incredibly, the furnace is still hot, fed by a geothermal tap that the Dwarves engineered to run indefinitely. Scattered across the workbenches are tools and raw materials that have sat untouched for eight centuries. And in the corner, still engaged in mindless labor, a Forge-Golem — corrupted by the Void's influence — methodically hammers an already-pulverized ingot of ore with mechanical repetition. It hasn't noticed you yet.",
    visualType: "dungeon",
    choices: [
      { text: "[INTELLIGENCE DC 14] Attempt to access the Golem's command protocols and issue a new directive.", check: { stat: "intelligence", difficulty: 14, successNode: "act4_golem_reprogrammed", failNode: "act4_golem_alert" } },
      { text: "[STRENGTH DC 15] Smash the Golem's head-unit before it registers your presence as a threat.", check: { stat: "strength", difficulty: 15, successNode: "act4_golem_disabled", failNode: "act4_golem_alert" } },
      { text: "Use the forge materials to quickly forge a weapon enhancement.", nextNode: "act4_forge_craft" },
      { text: "The Golem looks dangerous. Back out of the forge hall.", nextNode: "act4_arrival" }
    ]
  },

  act4_golem_reprogrammed: {
    title: "New Standing Orders",
    act: 4,
    text: "Your understanding of ancient Dwarven Runic-Script allows you to access the Golem's core logic matrix through the control panel on its back. You issue a new standing order: *'Guard this hall against void-creatures. Protect designated ally: bearer of this touchstone.'* The Golem straightens from its pointless hammering, scans you, and nods — a stiff, mechanical nod. It hands you a small metal disc: the touchstone. The Golem turns and takes up position at the forge hall entrance. You now have a temporary guardian.",
    visualType: "dungeon",
    loot: { id: "touchstone_golem", name: "Forge-Golem Touchstone", desc: "Commands the reprogrammed Golem. Grants a temporary ally in the next combat encounter.", type: "tool", equipped: false },
    choices: [
      { text: "Continue toward the central processional.", nextNode: "act4_processional" }
    ]
  },

  act4_golem_disabled: {
    title: "Disabled Construct",
    act: 4,
    text: "Your strike lands on the Golem's head-unit with devastating force — the runic control crystal shatters and the construct freezes mid-swing, then slowly topples with a tremendous crash. In the quiet aftermath, you scavenge the Golem's chassis and find a dozen still-functional Dwarven rune-stamps used for weapon enhancement. Kael immediately pockets them with professional interest.",
    visualType: "dungeon",
    loot: { id: "runes_dwarven", name: "Dwarven Rune-Stamps", desc: "Grants +2 to attack rolls for the next three combat encounters when applied to a weapon.", type: "tool", equipped: false },
    choices: [
      { text: "Take the rune-stamps and push forward.", nextNode: "act4_processional" }
    ]
  },

  act4_golem_alert: {
    title: "Construct Activated",
    act: 4,
    text: "The Golem's head swivels, void-corrupted sensors locking onto you. Its core flares with the same sickly violet light as the shadow hounds — the Dreaming One's corruption runs deep in this machine. It raises a hammer-fist the size of a tree trunk.",
    visualType: "battle",
    choices: [
      { text: "Fight the Corrupted Forge-Golem!", combatStart: true, enemyGroup: "corrupted_constructs", nextNode: "act4_processional" }
    ]
  },

  act4_forge_craft: {
    title: "The Old Art",
    act: 4,
    text: "Vorn knows Dwarven forge-craft. He takes your primary weapon and — working with focused intensity for ten minutes over the still-hot furnace — applies a cold-iron tempering and a set of Dwarven rune-stamps that enhance both balance and edge retention. The enhanced weapon glows faintly with forge-heat. It will perform measurably better in the battles to come.",
    visualType: "dungeon",
    loot: { id: "weapon_enhanced", name: "Runic-Tempered Weapon Enhancement", desc: "Applied to your primary weapon. Grants +2 to all attack rolls for this session.", type: "weapon", statBonus: { strength: 2 }, equipped: true },
    choices: [
      { text: "Enhanced and equipped. Continue to the processional.", nextNode: "act4_processional" }
    ]
  },

  act4_warrens: {
    title: "The Silent Residential Warrens",
    act: 4,
    text: "The residential warrens are a labyrinth of small apartments carved directly into the rock — each with a door-frame bearing the family's runic identifier, each room still containing the possessions of Dwarves who simply stopped existing. It is deeply unsettling. As you navigate deeper, you find evidence that one section of the warrens has been recently disturbed — dust swept aside, torches recently burned. Someone has been living here. A trail of breadcrumbs — literally — leads to a barricaded door.",
    visualType: "dungeon",
    choices: [
      { text: "Knock on the barricaded door and announce yourself as friendly.", nextNode: "act4_hermit_meet" },
      { text: "[DEXTERITY DC 11] Pick the lock and peer inside without announcing yourself.", check: { stat: "dexterity", difficulty: 11, successNode: "act4_hermit_observe", failNode: "act4_hermit_startled" } }
    ]
  },

  act4_hermit_meet: {
    title: "Old Bram of the Deep",
    act: 4,
    text: "A long silence, then a scratchy voice: *'Who's there? State your business or I'll collapse the tunnel!'* You announce yourself — adventurers, here to stop the Dreaming One's awakening. Another pause. The barricade shifts. The door opens. Inside: an elderly human man, lean as wire and deep-eyed, surrounded by crates of preserved food, dozens of candles, and walls covered in maps and astronomical charts. *'Old Bram,'* he says. *'I've been down here twelve years. Waiting for someone to come stop it. I know every tunnel in this empire.'*",
    visualType: "dungeon",
    choices: [
      { text: "Listen to everything Bram knows about the lower vault and the Herald.", nextNode: "act4_bram_intel" }
    ]
  },

  act4_hermit_observe: {
    title: "The Scholar in the Dark",
    act: 4,
    text: "You peer through the cracked door before announcing yourself. Inside: an elderly human surrounded by maps and notes, talking quietly to himself about orbital mechanics and void-energy cycles. He is clearly not a threat — he is a scholar who has been down here for years, studying from the inside. You knock gently to avoid startling him.",
    visualType: "dungeon",
    choices: [
      { text: "Introduce yourself and ask what he knows.", nextNode: "act4_hermit_meet" }
    ]
  },

  act4_hermit_startled: {
    title: "Caught Prying",
    act: 4,
    text: "The lock resists and clicks loudly. From inside, a yell: *'INTRUDERS!'* — then the sound of something very heavy being dragged toward the door from the inside as a barricade reinforcement. After thirty seconds of panicked barricade-building, a small slot opens at eye level and a suspicious, wrinkled eye peers through.",
    visualType: "dungeon",
    choices: [
      { text: "Explain yourself quickly and calmly. You are not a threat.", nextNode: "act4_hermit_meet" }
    ]
  },

  act4_bram_intel: {
    title: "Twelve Years of Knowledge",
    act: 4,
    text: "Bram is a font of information. He confirms: Seraphax the Herald has been performing a preparatory ritual in the deepest chamber — the Eye Chamber — for three days. The ritual requires a specific Moon Hour alignment to complete; you have approximately four hours. He has mapped three routes to the Eye Chamber: a direct processional (guarded), a sewer maintenance tunnel (unguarded but flooded), and a collapsed administrative wing (structurally unstable but direct). He also provides a critical piece of information: *'Seraphax isn't fully solid. Use something from the Void itself against it — force it all the way into our reality. Then it can be killed.'*",
    visualType: "dungeon",
    loot: { id: "map_bram", name: "Bram's Route Maps", desc: "Detailed maps of three routes to the Eye Chamber. Reduces the chance of random encounters.", type: "tool", equipped: false },
    choices: [
      { text: "Take the direct processional route — fastest but guarded.", nextNode: "act4_processional" },
      { text: "Take the sewer maintenance tunnel — unguarded but flooded.", nextNode: "act4_sewer" }
    ]
  },

  act4_processional: {
    title: "The Grand Processional",
    act: 4,
    text: "The central processional is a broad boulevard of black stone paved with iron ingots — a symbol of Dwarven wealth and power. Statues of legendary Clan Kheldrak warriors line both sides, eight feet tall, expressions frozen in permanent vigilance. About halfway down the processional, your path is blocked. A patrol of Ratfolk — scavengers who have colonized the upper levels of the under-empire — has set up a checkpoint. They are armed and nervous-looking, and they have clearly been rattled by something from below.",
    visualType: "dungeon",
    choices: [
      { text: "[CHARISMA DC 12] Negotiate passage — offer them something valuable in exchange.", check: { stat: "charisma", difficulty: 12, successNode: "act4_ratfolk_negotiate", failNode: "act4_ratfolk_fight" } },
      { text: "[DEXTERITY DC 13] Attempt to sneak past their checkpoint using the statues as cover.", check: { stat: "dexterity", difficulty: 13, successNode: "act4_ratfolk_sneak", failNode: "act4_ratfolk_fight" } },
      { text: "Fight through the Ratfolk checkpoint.", combatStart: true, enemyGroup: "ratfolk_ambush", nextNode: "act4_lower_vault_entry" }
    ]
  },

  act4_ratfolk_negotiate: {
    title: "Ratfolk Bargain",
    act: 4,
    text: "The Ratfolk leader — a stocky specimen in a patchwork coat of leather and bone — eyes you with sharp, mercantile intelligence. After brief but intense negotiation involving a spare potion and a handful of coins, a deal is struck. *'You go down, fine. You kill the big eye-thing, fine. You not come back up here making trouble, very fine.'* He waves you through with unexpected dignity. As you pass, he adds quietly: *'The big eye-creature sends voices through the stone. Three of ours went mad two days past. You kill it fast.'*",
    visualType: "dungeon",
    choices: [
      { text: "Continue down the processional to the lower vault.", nextNode: "act4_lower_vault_entry" }
    ]
  },

  act4_ratfolk_sneak: {
    title: "Through the Statues",
    act: 4,
    text: "You move from statue base to statue base with practiced precision, timing your moves to the Ratfolk patrol's gaps. The checkpoint passes above you and behind you without a single alarm. Clear on the other side, you find the processional's end: a massive iron door, twelve feet tall, marked with the Clan Kheldrak sigil and the warning: *'BEYOND THIS DOOR LIES THE EYE CHAMBER. NONE SHALL PASS SAVE THE WORTHY.'*",
    visualType: "dungeon",
    choices: [
      { text: "Push open the iron door and descend to the lower vault.", nextNode: "act4_lower_vault_entry" }
    ]
  },

  act4_ratfolk_fight: {
    title: "The Checkpoint Brawl",
    act: 4,
    text: "The Ratfolk aren't willing to negotiate or be deceived — fear of what's below makes them desperate, and desperate creatures fight hard. Their Shaman begins gesturing with void-tainted power as the scrappers fan out around you.",
    visualType: "battle",
    choices: [
      { text: "Fight through the Ratfolk ambush!", combatStart: true, enemyGroup: "ratfolk_ambush", nextNode: "act4_lower_vault_entry" }
    ]
  },

  act4_sewer: {
    title: "The Flooded Maintenance Tunnels",
    act: 4,
    text: "The sewer tunnels are knee-deep in ancient water that has long since turned murky and cold. The going is slow and the footing treacherous on the slimy stone floor. But there are no guards — only the sound of dripping water and the distant thrumming of the Dreaming One's influence on the stone. You find evidence of earlier passage: a waterproofed satchel hanging from a pipe hook, left by Bram years ago. Inside: emergency supplies and a hand-sketched tunnel map showing the connection to the Eye Chamber's antechamber.",
    visualType: "dungeon",
    loot: { id: "satchel_bram", name: "Bram's Emergency Cache", desc: "Contains a Potion of Healing (15 HP) and a fire-starter kit.", type: "potion", value: 15 },
    choices: [
      { text: "Push through the flooded tunnels to the Eye Chamber antechamber.", nextNode: "act4_lower_vault_entry" }
    ]
  },

  act4_lower_vault_entry: {
    title: "The Antechamber of the Eye",
    act: 4,
    text: "The antechamber is a perfect sphere of carved black stone, thirty feet in diameter. At its center, a pedestal holds the Eye of the Void — a sphere of pure crystallized Mythal-energy the size of a human skull, pulsing with golden light. But the Eye is enclosed in a cage of void-metal, slowly being dismantled by Seraphax the Herald, who turns to face you as you enter. It is a tall, half-material entity — part solid, part void-shadow — with a singular blazing eye and arms that end in writhing void-tendrils. *'The living have come at last,'* it says, voice resonating from everywhere at once. *'You are too late. The Calling is nearly complete.'*",
    visualType: "void",
    choices: [
      { text: "Rest before confronting the Herald — make camp in the antechamber approach.", nextNode: "act4_final_camp" },
      { text: "Challenge Seraphax immediately. Demand it halt the ritual.", nextNode: "act5_herald_confrontation" }
    ]
  },

  act4_final_camp: {
    title: "The Last Camp",
    act: 4,
    text: "You withdraw slightly from the antechamber entrance and make your final camp in the last defensible position before the Eye Chamber. Lyra uses the last of her healing prayers on the worst of your wounds. Kael checks his blades with silent focus. Vorn closes his eyes and breathes deeply, centering his rage. You eat the last of your provisions in silence, each person understanding that what comes next will determine the fate of every living soul on the surface. When you rise, everyone is ready. Completely, irrevocably ready.",
    visualType: "camp",
    heal: 15,
    choices: [
      { text: "Stand. Walk into the Eye Chamber and face Seraphax.", nextNode: "act5_herald_confrontation" }
    ]
  },

  // ═══════════════════════════════════════════
  // ACT V — THE DREAMING ONE: FINAL CONFRONTATION
  // ═══════════════════════════════════════════

  act5_herald_confrontation: {
    title: "Face to Face with the Herald",
    act: 5,
    actLabel: "ACT V — THE DREAMING ONE",
    text: "Seraphax regards you with its singular blazing eye. The void-tendrils at the end of its arms continue to work at the Eye of the Void's cage even as it speaks to you. *'Do you know what you are attempting to prevent? The Dreaming One offers not destruction — it offers communion. Totality. The end of the isolated agony of individual existence.'* The Eye of the Void pulses behind it, three cage-bars already removed. Two remain.",
    visualType: "void",
    choices: [
      { text: "[CHARISMA DC 16] Argue against the Herald's philosophy — demonstrate why individual existence has value.", check: { stat: "charisma", difficulty: 16, successNode: "act5_seraphax_stalled", failNode: "act5_seraphax_fight" } },
      { text: "Reveal the Void-Anchor Shard — plunge it into Seraphax to force full materialization!", nextNode: "act5_shard_use" },
      { text: "No more words. Fight Seraphax now!", combatStart: true, enemyGroup: "void_herald", nextNode: "act5_herald_victory" }
    ]
  },

  act5_seraphax_stalled: {
    title: "A Moment of Doubt",
    act: 5,
    text: "Your words land with unexpected force. Seraphax pauses — the tendrils stilling for the first time. *'You... argue from experience. Not philosophy.'* Its eye dims slightly. *'The Dreaming One showed me what it is to be free of pain. But it did not show me... this.'* The hesitation lasts three seconds. Then its eye blazes back to full intensity. *'No. I serve the One. But I will make your death clean, at least.'* It turns and charges — but that three-second delay was enough for you to position perfectly for a counter.",
    visualType: "void",
    choices: [
      { text: "Use the Void-Anchor Shard now, while it's off-balance!", nextNode: "act5_shard_use" },
      { text: "Engage in combat with the positional advantage!", combatStart: true, enemyGroup: "void_herald", nextNode: "act5_herald_victory" }
    ]
  },

  act5_shard_use: {
    title: "The Void-Anchor Strikes",
    act: 5,
    text: "You drive the crystalline Void-Anchor Shard directly into Seraphax's semi-material torso. The effect is immediate and spectacular — the shard acts as a reality-anchor, pulling the Herald's void-essence fully into the physical plane with a sound like a thunderclap. Seraphax screams with sudden, terrible awareness of its own physical vulnerability. It is now completely solid. Completely mortal. Completely killable.",
    visualType: "void",
    choices: [
      { text: "ATTACK! Destroy the fully-materialized Herald!", combatStart: true, enemyGroup: "void_herald", nextNode: "act5_herald_victory" }
    ]
  },

  act5_seraphax_fight: {
    title: "Persuasion Fails",
    act: 5,
    text: "Seraphax's eye blazes with contempt. *'Sentiment. Weakness. You are exactly what the Dreaming One hungers for.'* A void-tendril lashes out, striking you across the chest and sending you stumbling backward. The fight is inevitable.",
    visualType: "battle",
    damage: 6,
    choices: [
      { text: "Fight Seraphax the Herald!", combatStart: true, enemyGroup: "void_herald", nextNode: "act5_herald_victory" }
    ]
  },

  act5_herald_victory: {
    title: "The Herald Falls",
    act: 5,
    text: "Seraphax collapses — its form tearing apart in strips of void-energy that dissolve into the air with a high, fading keen. The void-tendrils release the Eye of the Void's cage. The chamber shudders as the Dreaming One, deep below, registers the loss of its Herald and issues a subterranean roar of rage that trembles every stone in the under-empire. The Eye of the Void blazes bright — it recognizes the Mythal-vial in your possession. The cage falls away. The Eye is within reach. But from directly below the chamber floor, the stone begins to crack. Something immense is pushing upward.",
    visualType: "void",
    choices: [
      { text: "Grab the Eye of the Void immediately and attempt to use the Mythal-vial to re-seal it!", nextNode: "act5_seal_attempt" },
      { text: "Stand ready — whatever is coming through the floor, meet it head on!", nextNode: "act5_dreaming_one_emerges" }
    ]
  },

  act5_seal_attempt: {
    title: "The Binding Ritual",
    act: 5,
    text: "You seize the Eye of the Void. It is heavier than it looks, and warm — uncomfortably warm, like holding a living heart. The Mythal-vial in your pack begins to resonate immediately, the golden light reaching toward the Eye. Lyra understands what needs to happen before you do — she steps forward and clasps the vial in both hands, directing its Mythal-energy into the Eye while you hold it steady. The binding ritual begins. It requires complete concentration. And from below, the floor is cracking faster.",
    visualType: "void",
    choices: [
      { text: "[CONSTITUTION DC 17] Hold the Eye steady against the Dreaming One's mental assault while Lyra completes the binding.", check: { stat: "constitution", difficulty: 17, successNode: "act5_seal_success", failNode: "act5_seal_partial" } },
      { text: "[WISDOM DC 17] Open your mind to the Eye of the Void and guide the Mythal-flow with pure will.", check: { stat: "wisdom", difficulty: 17, successNode: "act5_seal_success", failNode: "act5_seal_partial" } }
    ]
  },

  act5_seal_success: {
    title: "The Seal Restored",
    act: 5,
    text: "You hold. The Dreaming One batters at your mind with images of dissolution, communion, and beautiful terrible void — and you hold. Lyra completes the binding. The Eye of the Void blazes with golden-white Mythal-light that floods the chamber, the antechamber, the under-empire, the rift, all the way up through the High Pass to the frozen surface above. The crack in the floor seals. The roaring below cuts off with terrible finality. In the silence that follows, the Eye cools in your hands to room temperature, and the Mythal-light fades to a soft, steady glow. The Dreaming One sleeps. For now.",
    visualType: "arcane",
    choices: [
      { text: "Breathe. Decide what to do next — take the Eye to the surface or leave it here.", nextNode: "act5_epilogue_choice" }
    ]
  },

  act5_seal_partial: {
    title: "The Dreaming One Surfaces",
    act: 5,
    text: "The mental assault is too powerful — you lose your grip on the Eye's Mythal-interface for a critical second. The binding falters. Lyra screams as the backlash tears through her connection. The floor erupts. A massive tentacled form — ancient, immense, radiating psychic terror — rises from the fissure. Zal'thrix, the Dreaming One, partially awake and absolutely furious. The binding must wait. The battle cannot.",
    visualType: "void",
    choices: [
      { text: "FIGHT! Engage Zal'thrix before it fully awakes!", combatStart: true, enemyGroup: "the_dreaming_one", nextNode: "act5_dreaming_one_victory" }
    ]
  },

  act5_dreaming_one_emerges: {
    title: "Zal'thrix Rises",
    act: 5,
    text: "The floor of the Eye Chamber shatters upward. From the depths emerges a being of impossible scale and alien geometry — part aboleth, part lich, part living void. Eight massive tentacles spread from a central body the size of a barn, trailing void-energy and fragments of three-thousand-year-old dreams. Three blazing eyes the color of deep space fix upon your party with ancient, contemptuous intelligence. *'Small things,'* it says, in a voice that bypasses ears entirely and speaks directly into your minds, *'you have made a remarkable effort. It changes nothing.'*",
    visualType: "void",
    choices: [
      { text: "Fight the Dreaming One! All or nothing!", combatStart: true, enemyGroup: "the_dreaming_one", nextNode: "act5_dreaming_one_victory" }
    ]
  },

  act5_dreaming_one_victory: {
    title: "The Ancient One Stilled",
    act: 5,
    text: "Zal'thrix crashes back into its fissure with a final shuddering groan that sends cracks racing up the Eye Chamber walls. It is not dead — an aboleth-lich of this age cannot die in a single combat — but it has been beaten back, critically weakened, its focus broken. The Eye of the Void blazes in the sudden silence. With the Dreaming One staggered, the binding is possible again. Lyra is already in position. Vorn and Kael hold the crumbling perimeter. This is the moment.",
    visualType: "arcane",
    choices: [
      { text: "Use the Mythal-vial and the Eye to complete the binding now — seal it before it recovers!", nextNode: "act5_final_binding" }
    ]
  },

  act5_final_binding: {
    title: "The Binding Renewed",
    act: 5,
    text: "With the Dreaming One weakened and your companions holding the perimeter, you press the Mythal-vial to the Eye of the Void. The binding ritual flows more easily this time — the Eye itself seems to want to be sealed, as though the Mythal-energy inside has been waiting three thousand years for this moment. Lyra coordinates the ritual flow; you provide the anchor; the Eye does the rest. The golden-white light builds and builds and builds. Your companions shield their eyes. From far below, Zal'thrix releases one final, distant wail of fury — and then silence. Perfect. Complete. The binding holds.",
    visualType: "arcane",
    choices: [
      { text: "The crisis is over. Stand in the silence and decide what comes next.", nextNode: "act5_epilogue_choice" }
    ]
  },

  act5_epilogue_choice: {
    title: "In the Aftermath of Giants",
    act: 5,
    text: "The Eye of the Void rests in your hands, sealed and stable. The Dreaming One sleeps. The under-empire is silent. Your companions breathe hard in the aftermath, each processing the enormity of what has just happened. Lyra's hands are shaking but she is smiling — the relieved, bone-deep smile of someone who just did the impossible. Kael is inspecting a new cut on his arm with professional detachment. Vorn sits down heavily on a piece of collapsed architecture and stares at the ceiling. Outside, the High Pass waits. The surface world waits. What you do next will shape how history remembers this night.",
    visualType: "arcane",
    choices: [
      { text: "Take the Eye of the Void to the surface — bring it to the scholars of Silverymoon for safekeeping.", nextNode: "ending_scholar" },
      { text: "Leave the Eye here, in the Vault, sealed and hidden — let it be forgotten again.", nextNode: "ending_guardian" },
      { text: "Destroy the Eye entirely — the only true safety is in the artifact's elimination.", nextNode: "ending_sacrifice" }
    ]
  },

  ending_scholar: {
    title: "The Scholars' Choice",
    act: 5,
    text: "The journey back to the surface is long and cold but blessedly uneventful — as though the mountain itself has exhaled. You emerge from the High Pass at dawn, the Eye of the Void wrapped in your cloak, its steady golden light warm against your chest. Three weeks later, after careful escort by Lyra's contacts in the Church of Lathander and a consultation with the Conclave of Silverymoon, the Eye is installed in a warded chamber at the Vault of the Sages — attended by scholars who understand what it is and what it binds. Mira Aldric publishes the complete history of House Embervane. The world does not learn of Zal'thrix — not fully — but the people who need to know, know. The vigil continues. You have ensured it can.",
    visualType: "hearth",
    choices: []
  },

  ending_guardian: {
    title: "The Warden's Path",
    act: 5,
    text: "You set the Eye of the Void back on its pedestal in the Eye Chamber, close the cage, and seal it with the last of the Mythal-energy from the vial. You etch new wardings into the antechamber walls — imperfect, but functional. Then you make a decision that surprises even yourself: you stay. Not forever — but long enough to establish new wardings, recruit a small team of trusted scholars, and formalize what the Last Warden, Thaelon, envisioned: a renewed guardianship. The Dreaming One must be watched. House Embervane is gone. But its duty is not. Someone has to carry it forward. You have chosen that someone to be you.",
    visualType: "arcane",
    choices: []
  },

  ending_sacrifice: {
    title: "The Final Choice",
    act: 5,
    text: "The Eye of the Void cannot be destroyed by ordinary means — its Mythal-core is too powerful. But you found the answer in the Chronicles of House Embervane: it can be unmade if the bearer willingly channels their own life-force into it as a final catalyst. You explain this to your companions. Lyra immediately volunteers to do it herself — *'My faith, my choice'* — but you take the Eye from her hands. What follows happens in complete silence. A blaze of golden-white light that the Ratfolk in the levels above later describe as 'a sun, lit briefly underground.' When it dims, the Eye of the Void is gone. And Zal'thrix, stripped of its anchor and exposed to the full weight of three thousand years of bound time, crumbles to dust in the dark below. The Dreaming One dreams no more. The cost was high. The result is absolute.",
    visualType: "arcane",
    choices: []
  }
};

export default STORY_NODES;
