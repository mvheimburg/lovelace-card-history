/** Round-number ticks covering [min, max], about `count` of them. */
export function ticks(min: number, max: number, count = 4): number[] {
  const raw = (max - min) / count || 1;
  const power = 10 ** Math.floor(Math.log10(raw));
  const step =
    [1, 2, 2.5, 5, 10].map((m) => m * power).find((s) => s >= raw) ??
    10 * power;
  const out: number[] = [];
  // From the step at or below min up to the first step at or above max.
  for (let v = Math.floor(min / step) * step; ; v += step) {
    out.push(Number(v.toFixed(6)));
    if (v >= max - 1e-9) break;
  }
  return out;
}
