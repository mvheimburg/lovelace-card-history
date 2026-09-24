import { nothing, svg } from "lit";
/** Room left and right of the bands, so edge time labels are not clipped. */
const SIDE = 22, TOP = 4, LABEL = 18, BAND = 24, GAP = 12, AXIS = 24;
function every(hours, narrow) {
    if (hours <= 6)
        return narrow ? 2 : 1;
    if (hours <= 24)
        return narrow ? 6 : 4;
    return narrow ? 48 : 24;
}
/**
 * One lane per entity with a colored band per state, from `start` to `end`.
 * A silent (unavailable) spell is hatched; time before any record is empty.
 */
export function timeline(lanes, start, end, hover, text, W = 600) {
    const RIGHT = W - SIDE;
    const H = TOP +
        lanes.length * (LABEL + BAND) +
        Math.max(0, lanes.length - 1) * GAP +
        AXIS;
    const bottom = H - AXIS;
    const x = (t) => SIDE +
        ((Math.min(Math.max(t, start), end) - start) / (end - start)) *
            (RIGHT - SIDE);
    const step = every((end - start) / 3600000, W < 480);
    const ticks = [];
    const hour = new Date(start);
    hour.setMinutes(0, 0, 0);
    let midnights = 0;
    for (let t = hour.getTime(); t <= end; t += 3600000) {
        if (t < start)
            continue;
        const h = new Date(t).getHours();
        if (step >= 24 ? h === 0 && midnights++ % (step / 24) === 0 : h % step === 0)
            ticks.push(t);
    }
    const top = (i) => TOP + i * (LABEL + BAND + GAP);
    return svg `<svg class="timeline" viewBox="0 0 ${W} ${H}" role="img" aria-label=${text.label}>
    <title>${text.label}</title>
    <defs>
      <pattern id="history-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect class="hatch-bg" width="6" height="6"></rect>
        <line class="hatch" x1="0" y1="0" x2="0" y2="6"></line>
      </pattern>
    </defs>
    ${ticks.map((t) => svg `<line class="grid" x1=${x(t)} x2=${x(t)} y1=${TOP} y2=${bottom}></line><text class="axis" x=${x(t)} y=${bottom + 17} text-anchor="middle">${text.time(t, step >= 24)}</text>`)}
    ${lanes.map((lane, i) => {
        const y = top(i) + LABEL;
        return svg `<g class="band-lane" data-lane=${text.laneId?.(lane) ?? lane.kind}>
        <text class="lane-label" x=${SIDE} y=${top(i) + 13}>${text.lane(lane)}</text>
        <rect class="track" x=${SIDE} y=${y} width=${RIGHT - SIDE} height=${BAND} rx="4"></rect>
        ${lane.marks.map(([t, state], j) => {
            const from = x(t), to = x(lane.marks[j + 1]?.[0] ?? end);
            if (to - from <= 0)
                return nothing;
            const tone = state === undefined ? "gap" : text.tone(lane, state);
            const color = state === undefined ? undefined : text.color?.(lane, state);
            const label = text.stateLabel?.(lane, state);
            return svg `<rect class=${`band b-${tone}`} data-state=${state ?? ""} style=${color ? `--band: ${color}` : ""} x=${from} y=${y} width=${to - from} height=${BAND}>${label ? svg `<title>${text.lane(lane)}: ${label}</title>` : nothing}</rect>${label && to - from > label.length * 7 + 16 ? svg `<text class=${`band-label b-${tone}`} x=${from + 8} y=${y + 16}>${label}</text>` : nothing}`;
        })}
      </g>`;
    })}
    ${hover === undefined ? nothing : svg `<line class="cursor" x1=${x(hover)} x2=${x(hover)} y1=${TOP} y2=${bottom}></line>`}
  </svg>`;
}
/** The time under a pointer over a timeline. */
export function timelineTimeAt(event, element, start, end) {
    const box = element.getBoundingClientRect();
    const W = element.viewBox?.baseVal?.width || box.width;
    const px = ((event.clientX - box.left) / box.width) * W;
    const ratio = (px - SIDE) / (W - 2 * SIDE);
    return start + Math.min(1, Math.max(0, ratio)) * (end - start);
}
