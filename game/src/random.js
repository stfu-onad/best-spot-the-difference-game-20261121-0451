// Taman Senja: a tiny seeded random generator, so every scene is the same on
// every run and every screenshot, while each level still gets its own seed.
/** Mulberry32: a small, fast, deterministic PRNG. */
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A random float in [min, max). */
export function range(rng, min, max) {
  return min + rng() * (max - min);
}

/** A random integer in [min, max]. */
export function int(rng, min, max) {
  return Math.floor(range(rng, min, max + 1));
}

/** One element of `items`, picked by the generator. */
export function pick(rng, items) {
  return items[Math.floor(rng() * items.length)];
}
