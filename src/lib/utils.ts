/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
export function shuffle<A extends unknown[]>(a: A): A {
  let x, i;
  for (i = a.length; i > 0;) {
    const j = Math.floor(Math.random() * i);
    i--;
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

export function cell_is(cell: Set<number>, id) {
  return cell.has(id) && cell.size === 1;
}
