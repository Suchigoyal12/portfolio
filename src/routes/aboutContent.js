/* Data for the About page, lifted out of legacy/about.html unchanged.
 *
 * Kept separate from the component so the copy and the cue timings are
 * editable without reading through the timeline machinery.
 */

/* ---------- Photo marquee config — DESIGN_SYSTEM.md §4.7 ----------
   Swap PHOTOS for 4–10 entries; all geometry below re-derives. No logic edits needed. */
// 4–10 entries. Sources are pre-normalised to a common 600px height; w/h below are the
// real intrinsic pixels and are emitted as width/height attributes so the browser knows
// each slot's aspect ratio BEFORE the image loads. Without them the slots measure zero
// width on first layout and the seamless-loop maths (phMeasure) would be wrong.
export const PHOTOS = [
  { src: "/assets/about/1.webp", w: 700, h: 400 },
  { src: "/assets/about/2.webp", w: 562, h: 400 },
  { src: "/assets/about/3.webp", w: 674, h: 400 },
  { src: "/assets/about/4.webp", w: 352, h: 400 },
  { src: "/assets/about/5.webp", w: 594, h: 400 },
  { src: "/assets/about/6.webp", w: 266, h: 400 },
  { src: "/assets/about/7.webp", w: 616, h: 400 },
];

export const PH_GAP = 12;          // px between slots
export const PH_PX_PER_SEC = 22;   // ambient speed constant — tune this, not duration

/* ---------- PERSON branch — voiceover-driven, Figma "about- person/*" ----------
   No audio exists yet. Every timed behaviour reads timeline.getTime() only. */

// Placeholder timings, weighted by paragraph length. Data-only — real cues replace these values.
export const CUES = [
  { t: 0,   para: 0 },
  { t: 2,   para: 1 },
  { t: 15,  para: 2 },
  { t: 24,  para: 3 },
  { t: 36,  para: 4 },
  { t: 49,  para: 5 },
  { t: 58,  para: 6 },
  { t: 74,  para: 7 },
  { t: 89,  para: 8 },
  { t: 109, para: 9 },
];

export const LYRICS = [
  "for who really am i?",
  "hm.. well i love dragonflies, they bring hope.\nhope of what? the hope of rain.\nyou see i love rain. didn’t say i hate sun.\nsun reminds me of gardens and beaches.\nwho doesn’t love that, right?",
  "but do they remind you of dancing? in the rain?\nor singing? whatever is your forte.\nwell i love both. didn’t say i am good at em, now did i?",
  "does it sound like i love whimsy yet?\nyep i do love rom-coms and dramas, but the idea of being a hopeless romantic, in this world? i’d leave that up to you.",
  "could you guess i am a morning person who loves late night parties?\nthat i can make you some amazing cocktails?\ni sound like tinder now alas.\nwell no, but i can be the monica of hosting house parties.",
  "i love pets, i have pets.\ni wish i could be them and cuddle up in tiny spaces to observe the world around.",
  "i am not good at poetry, that’s why this, yeah.\nbut i do love poetry.\nnot a fan of how ai is changing it all. don’t get me wrong, i do love the convenience we can create.\nbut, would you rather live in 2050s or the 1980s?",
  "i guess my friends value my opinion,\ni have friends, many, actually i am kinda extrovert.\ndid you create that yet? a vision? in the persona i mean.\nkinda contradicting isn’t it? being a people person for who loves getting lost.",
  "i love horses, food, everything organic (so much that i like to grow some of my own), travel, so much travel, adventure, photography & taking up opportunities (big time and any kind).\ni can swim; i can dance & i won district in martial arts for my school.",
  "at this point you know me more than you should, but does that create a relevant persona? or should i go into the deets of what all did i accomplish, which i didn’t think i could?\nagain, don’t get me wrong. i believe in myself more than anyone could.",
];

export const cueTimeFor = (i) => {
  const c = CUES.find((c) => c.para === i);
  return c ? c.t : 0;
};
