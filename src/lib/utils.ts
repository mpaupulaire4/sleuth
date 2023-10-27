/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
export function shuffle<A extends unknown[]>(a: A): A {
  let x, i;
  for (i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

export function swap<A extends [unknown, unknown, ...unknown[]]>(a: A): A {
  if (Math.random() < 0.5) {
    const x = a[a.length - 1];
    a[a.length - 1] = a[0];
    a[0] = x;
  }
  return a;
}
