/** Loading recorder history for charts and timelines. */
/**
 * A connection for history requests: `hass.callWS` when Home Assistant offers
 * it, else its websocket connection.
 */
export function historyConnection(hass) {
    return {
        sendMessagePromise: (message) => {
            if (hass.callWS)
                return hass.callWS(message);
            if (hass.connection)
                return hass.connection.sendMessagePromise(message);
            return Promise.reject(new Error("No connection to Home Assistant"));
        },
    };
}
/** The ranges every history view offers, in hours. */
export const RANGES = [6, 24, 168];
/** Palette slots: `.series-0` … `.series-4` in the styles. */
export const PALETTE = 5;
const SILENT = new Set(["unavailable", "unknown", ""]);
/** A reading as a number; `undefined` while unavailable or not a number. */
export function numeric(state) {
    if (state === undefined || SILENT.has(state))
        return undefined;
    const value = Number(state);
    return Number.isFinite(value) ? value : undefined;
}
/** States that mean on/open for a lane; anything else reported means off. */
const ON = ["on", "open", "opening", "ajar", "unlocked", "true"];
/** 1 while on/open, 0 while off, `undefined` while unreported. */
export function onOff(state) {
    if (state === undefined || SILENT.has(state))
        return undefined;
    return ON.includes(state.toLowerCase()) ? 1 : 0;
}
export const isTemperature = (unit) => ["°C", "°F", "K"].includes(unit);
/** The unit of an entity's readings. */
export const unitOf = (state) => String(state?.attributes.unit_of_measurement ?? "");
/**
 * Whether a reading is worth a history line: a numeric sensor measurement, not a
 * timestamp, duration, enum, text or a controllable setting.
 */
export function isMeasurement(state) {
    if (!state)
        return false;
    const a = state.attributes;
    if (["duration", "timestamp", "date", "enum"].includes(String(a.device_class)))
        return false;
    if (!a.unit_of_measurement && !a.state_class)
        return false;
    return SILENT.has(state.state) || numeric(state.state) !== undefined;
}
/**
 * Raw history of `ids` since `start`, one request. With `attributes`, each row
 * carries its attributes (needed to read one), which costs a larger reply.
 */
async function rawRows(connection, ids, start, attributes = false) {
    if (!ids.length)
        return {};
    return ((await connection.sendMessagePromise({
        type: "history/history_during_period",
        start_time: new Date(start).toISOString(),
        entity_ids: ids,
        minimal_response: !attributes,
        no_attributes: !attributes,
        significant_changes_only: false,
    })) ?? {});
}
/** Raw state history of `ids` since `start`, as marks. */
async function rawHistory(connection, ids, start) {
    const reply = await rawRows(connection, ids, start);
    return Object.fromEntries(ids.map((id) => [
        id,
        (reply?.[id] ?? []).map((row) => [
            Math.max(start, (row.lu ?? row.lc ?? 0) * 1000),
            row.s,
        ]),
    ]));
}
/**
 * Hourly means of `ids` since `start`. An hour without a statistic is a gap: the
 * mark after the last row of a run says the sensor went quiet.
 */
async function hourlyMeans(connection, ids, start, end) {
    if (!ids.length)
        return {};
    const reply = await connection.sendMessagePromise({
        type: "recorder/statistics_during_period",
        start_time: new Date(start).toISOString(),
        end_time: new Date(end).toISOString(),
        statistic_ids: ids,
        period: "hour",
        types: ["mean", "state"],
    });
    const HOUR = 3600000;
    return Object.fromEntries(ids.map((id) => {
        const marks = [];
        let last;
        for (const row of reply?.[id] ?? []) {
            const t = typeof row.start === "number" ? row.start : Date.parse(row.start);
            const value = row.mean ?? row.state;
            if (!Number.isFinite(t) || value === null || value === undefined)
                continue;
            if (last !== undefined && t - last > HOUR * 1.5)
                marks.push([last + HOUR, undefined]);
            marks.push([Math.max(start, t), String(value)]);
            last = t;
        }
        return [id, marks];
    }));
}
/**
 * The history of each source over the last `hours`, ending with the entity's
 * current state. Lanes are loaded as on/off, lines and steps as numbers.
 */
export async function loadSeries(connection, sources, states, hours, options = {}) {
    const now = options.now ?? Date.now();
    const start = now - hours * 3600000;
    const statisticsFrom = options.statisticsFrom ?? 168;
    const ids = [
        ...new Set(sources.filter((s) => !s.attribute).map((s) => s.entityId)),
    ];
    const withAttributes = [
        ...new Set(sources.filter((s) => s.attribute).map((s) => s.entityId)),
    ];
    const fromStatistics = new Set(statisticsFrom > 0 && hours >= statisticsFrom
        ? sources
            .filter((s) => s.kind !== "lane" &&
            s.kind !== "step" &&
            !s.attribute &&
            states[s.entityId]?.attributes.state_class)
            .map((s) => s.entityId)
        : []);
    const [raw, means, full] = await Promise.all([
        rawHistory(connection, ids.filter((id) => !fromStatistics.has(id)), start),
        hourlyMeans(connection, [...fromStatistics], start, now),
        rawRows(connection, withAttributes, start, true),
    ]);
    return sources.map((source) => {
        const current = states[source.entityId];
        const read = (state, a) => source.attribute
            ? SILENT.has(state ?? "") || a?.[source.attribute] == null
                ? undefined
                : String(a[source.attribute])
            : state;
        // Full rows repeat the last attributes: a row may omit unchanged ones.
        let attrs;
        const marks = source.attribute
            ? (full[source.entityId] ?? []).map((row) => {
                attrs = row.a ?? attrs;
                return [
                    Math.max(start, (row.lu ?? row.lc ?? 0) * 1000),
                    read(row.s, attrs),
                ];
            })
            : [...(raw[source.entityId] ?? means[source.entityId] ?? [])];
        if (current)
            marks.push([now, read(current.state, current.attributes)]);
        const lane = source.kind === "lane";
        return {
            ...source,
            unit: source.unit ?? (lane ? "" : unitOf(current)),
            points: marks.map(([t, s]) => [t, lane ? onOff(s) : numeric(s)]),
            states: marks.map(([t, s]) => [
                t,
                s === undefined || SILENT.has(s) ? undefined : s,
            ]),
        };
    });
}
/** The state history of each entity as timeline lanes, ending with its current state. */
export async function loadLanes(connection, lanes, states, hours, options = {}) {
    const now = options.now ?? Date.now();
    const start = now - hours * 3600000;
    const raw = await rawHistory(connection, [...new Set(lanes.map((l) => l.entityId))], start);
    return lanes.map((lane) => {
        const marks = [...(raw[lane.entityId] ?? [])];
        const current = states[lane.entityId];
        if (current)
            marks.push([now, current.state]);
        // A silent spell is a gap, whatever the entity called it.
        return {
            ...lane,
            marks: marks.map(([t, s]) => [
                t,
                s === undefined || SILENT.has(s) ? undefined : s,
            ]),
        };
    });
}
/** The value in force at `time`: the last point at or before it. */
export function valueAt(series, time) {
    let value;
    for (const [t, v] of series.points) {
        if (t > time)
            break;
        value = v;
    }
    return value;
}
/** The state in force at `time` in a series or lane. */
export function stateAt(item, time) {
    let value;
    for (const [t, v] of item.states ?? item.marks ?? []) {
        if (t > time)
            break;
        value = v;
    }
    return value;
}
