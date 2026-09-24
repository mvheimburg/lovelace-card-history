import { nothing, svg } from "lit";
import { isTemperature } from "./data";
import { ticks } from "./ticks";
const LEFT = 44;
const TOP = 24;
const PLOT_BOTTOM = 196;
/** Room right of the plot for each additional scale. */
const GUTTER = 44;
/** One lane below the plot, and the gap above the first. */
const LANE = 14;
const LANE_GAP = 6;
/** The left and right units of a chart; lanes have no scale. */
export function units(all, leftUnit) {
    const series = all.filter((s) => s.kind !== "lane");
    const left = leftUnit ??
        series.find((s) => isTemperature(s.unit))?.unit ??
        series[0]?.unit ??
        "";
    return [left, series.find((s) => s.unit !== left)?.unit];
}
/** Units rendered, in axis order. Pass the length to lineChartTimeAt. */
export function chartUnits(all, leftUnit, maxUnits = 2) {
    const [left] = units(all, leftUnit);
    return [
        ...new Set([
            left,
            ...all.filter((s) => s.kind !== "lane").map((s) => s.unit),
        ]),
    ].slice(0, maxUnits);
}
function rightMargin(count) {
    return count <= 1 ? 12 : GUTTER * (count - 1);
}
/**
 * Unbroken spells of a series. A step holds its value until the next change, so
 * its spell runs on to the moment it became unavailable.
 */
function runs(points, hold) {
    const out = [];
    let current = [];
    for (const [t, v] of points) {
        if (v === undefined) {
            if (current.length) {
                if (hold)
                    current.push([t, current[current.length - 1][1]]);
                out.push(current);
            }
            current = [];
        }
        else
            current.push([t, v]);
    }
    if (current.length)
        out.push(current);
    return out;
}
function scale(series, pad, domain) {
    if (domain &&
        Number.isFinite(domain[0]) &&
        Number.isFinite(domain[1]) &&
        domain[1] > domain[0]) {
        const [min, max] = domain;
        return {
            min,
            max,
            marks: [min, ...ticks(min, max).filter((v) => v > min && v < max), max],
        };
    }
    const values = series.flatMap((s) => s.points.flatMap(([, v]) => (v === undefined ? [] : [v])));
    if (!values.length)
        return undefined;
    const marks = ticks(Math.min(...values) - pad, Math.max(...values) + pad);
    return { marks, min: marks[0], max: marks[marks.length - 1] };
}
/** Monotone cubic through the points: smooth, never overshooting a reading. */
function smoothPath(pts) {
    const n = pts.length;
    if (n < 3)
        return pts
            .map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`)
            .join(" ");
    const d = [];
    for (let i = 0; i < n - 1; i++)
        d.push((pts[i + 1][1] - pts[i][1]) / (pts[i + 1][0] - pts[i][0] || 1));
    const m = [d[0]];
    for (let i = 1; i < n - 1; i++)
        m.push(d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2);
    m.push(d[n - 2]);
    let path = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
    for (let i = 0; i < n - 1; i++) {
        const [x0, y0] = pts[i], [x1, y1] = pts[i + 1], h = (x1 - x0) / 3;
        path += ` C${(x0 + h).toFixed(1)},${(y0 + m[i] * h).toFixed(1)} ${(x1 - h).toFixed(1)},${(y1 - m[i + 1] * h).toFixed(1)} ${x1.toFixed(1)},${y1.toFixed(1)}`;
    }
    return path;
}
/** Hours between x-axis ticks, fewer on a narrow chart. */
function tickEvery(hours, narrow) {
    if (hours <= 6)
        return narrow ? 2 : 1;
    if (hours <= 24)
        return narrow ? 6 : 4;
    return narrow ? 48 : 24;
}
/**
 * One chart of related readings: the left scale in the main unit, a right-hand
 * scale for a reading in another unit, dashed steps for setpoints and a lane per
 * on/off state below the plot. Unavailable spells are gaps.
 */
export function lineChart(all, start, end, hover, text, options = {}) {
    const W = options.width ?? 600;
    const fill = options.fill ?? true;
    const series = all.filter((s) => s.kind !== "lane");
    const lanes = all.filter((s) => s.kind === "lane");
    // Without readings the chart is just its lanes.
    const BOTTOM = series.length ? PLOT_BOTTOM : TOP - LANE_GAP;
    const END = BOTTOM + (lanes.length ? LANE_GAP + lanes.length * LANE : 0);
    const H = END + 34;
    const axisUnits = chartUnits(series, options.leftUnit, options.maxUnits);
    const RIGHT = W - rightMargin(axisUnits.length);
    const pad = (list, unit) => isTemperature(unit) ||
        list.some((s) => s.points.some(([, v]) => v !== undefined && Math.abs(v) >= 10))
        ? 1
        : 0.1;
    const axes = axisUnits.map((unit) => {
        const list = series.filter((s) => s.unit === unit);
        return {
            unit,
            list,
            scale: scale(list, pad(list, unit), options.domains?.[unit]),
        };
    });
    const x = (t) => LEFT +
        ((Math.min(Math.max(t, start), end) - start) / (end - start)) *
            (RIGHT - LEFT);
    const y = (v, s) => BOTTOM - ((v - s.min) / (s.max - s.min || 1)) * (BOTTOM - TOP);
    const every = tickEvery((end - start) / 3600000, W < 480);
    const xTicks = [];
    const hour = new Date(start);
    hour.setMinutes(0, 0, 0);
    let midnights = 0;
    for (let t = hour.getTime(); t <= end; t += 3600000) {
        if (t < start)
            continue;
        const h = new Date(t).getHours();
        if (every >= 24
            ? h === 0 && midnights++ % (every / 24) === 0
            : h % every === 0)
            xTicks.push(t);
    }
    // Leave room for localized clock labels, including a 12-hour AM/PM suffix.
    let previousLabelRight = -Infinity;
    const labeledTicks = xTicks.filter((t) => {
        const half = text.time(t, every >= 24).length * 3.5;
        if (x(t) - half < previousLabelRight + 10)
            return false;
        previousLabelRight = x(t) + half;
        return true;
    });
    const paths = (s, sc) => runs(s.points, s.kind === "step").map((run) => {
        const pts = run.map(([t, v]) => [x(t), y(v, sc)]);
        const line = pts.length === 1
            ? `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)} h0.01`
            : s.kind === "step"
                ? pts
                    .map(([px, py], i) => i
                    ? `H${px.toFixed(1)} V${py.toFixed(1)}`
                    : `M${px.toFixed(1)},${py.toFixed(1)}`)
                    .join(" ")
                : options.smooth
                    ? smoothPath(pts)
                    : pts
                        .map(([px, py], i) => `${i ? "L" : "M"}${px.toFixed(1)},${py.toFixed(1)}`)
                        .join(" ");
        const area = fill && s.kind !== "step" && pts.length > 1
            ? `${line} L${pts[pts.length - 1][0].toFixed(1)},${BOTTOM} L${pts[0][0].toFixed(1)},${BOTTOM} Z`
            : "";
        return { line, area };
    });
    // As many decimals as the tick steps need (2.5 steps show 57.5, not 58).
    const digits = (sc) => Math.min(2, Math.max(...sc.marks.map((v) => String(v).split(".")[1]?.length ?? 0)));
    const draw = (s, sc) => {
        const parts = paths(s, sc);
        const cls = `series-${s.color}`;
        return svg `${parts.map((p) => (p.area ? svg `<path class=${`area ${cls}`} d=${p.area}></path>` : nothing))}<path class=${`line ${cls}${s.kind === "step" ? " dashed" : ""}`} data-entity=${s.entityId} d=${parts.map((p) => p.line).join(" ")}></path>`;
    };
    const lane = (s, i) => {
        const top = BOTTOM + LANE_GAP + i * LANE;
        const spells = s.points
            .map(([t, v], j) => ({
            from: t,
            to: Math.min(end, s.points[j + 1]?.[0] ?? end),
            value: v,
        }))
            .filter((p) => p.value !== undefined);
        const rect = (p, cls) => svg `<rect class=${cls} x=${x(p.from).toFixed(1)} y=${top} width=${Math.max(1, x(p.to) - x(p.from)).toFixed(1)} height=${LANE - 4} rx="2"></rect>`;
        return svg `<g class=${`history-lane series-${s.color}`} data-entity=${s.entityId}>${spells.map((p) => rect(p, "lane-track"))}${spells.filter((p) => p.value === 1).map((p) => rect(p, "lane-on"))}</g>`;
    };
    const grid = axes.find((a) => a.scale)?.scale;
    return svg `<svg class="history-chart" viewBox="0 0 ${W} ${H}" role="img" aria-label=${text.label}>
    <title>${text.label}</title>
    <defs>${[0, 1, 2, 3, 4].map((c) => svg `<linearGradient id=${`history-fill-${c}`} class=${`series-${c}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="fill-top"></stop><stop offset="1" class="fill-bottom"></stop></linearGradient>`)}</defs>
    ${grid?.marks.map((v) => svg `<line class="grid" x1=${LEFT} x2=${RIGHT} y1=${y(v, grid)} y2=${y(v, grid)}></line>`)}
    ${axes.map(({ unit, scale: sc }, i) => sc
        ? svg `
      ${sc.marks.map((v) => svg `<text class="axis" x=${i === 0 ? LEFT - 6 : RIGHT + 6 + (i - 1) * GUTTER} y=${y(v, sc) + 4} text-anchor=${i === 0 ? "end" : "start"}>${text.number(v, digits(sc))}</text>`)}
      ${unit ? svg `<text class="axis unit" x=${i === 0 ? 4 : RIGHT + (i - 1) * GUTTER + 4} y="12">${unit}</text>` : nothing}`
        : nothing)}
    ${labeledTicks.map((t) => svg `<line class="grid" x1=${x(t)} x2=${x(t)} y1=${TOP} y2=${END}></line><text class="axis" x=${x(t)} y=${END + 18} text-anchor="middle">${text.time(t, every >= 24)}</text>`)}
    ${axes.map(({ list, scale: sc }) => (sc ? list.map((s) => draw(s, sc)) : nothing))}
    ${lanes.map(lane)}
    ${hover === undefined ? nothing : svg `<line class="cursor" x1=${x(hover)} x2=${x(hover)} y1=${TOP} y2=${END}></line>`}
  </svg>`;
}
/** The time under a pointer over a line chart. */
export function lineChartTimeAt(event, element, start, end, twoScales) {
    const box = element.getBoundingClientRect();
    const W = element.viewBox?.baseVal?.width || box.width;
    const px = ((event.clientX - box.left) / box.width) * W;
    const count = typeof twoScales === "number" ? twoScales : twoScales ? 2 : 1;
    const ratio = (px - LEFT) / (W - rightMargin(count) - LEFT);
    return start + Math.min(1, Math.max(0, ratio)) * (end - start);
}
