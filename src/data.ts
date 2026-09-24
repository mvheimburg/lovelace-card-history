/** Loading recorder history for charts and timelines. */

/** The part of Home Assistant's websocket connection this package uses. */
export interface HistoryConnection {
  sendMessagePromise<T>(message: Record<string, unknown>): Promise<T>;
}
/** The part of `hass` a history request can go through. */
export interface HistoryHass {
  callWS?<T>(message: Record<string, unknown>): Promise<T>;
  connection?: HistoryConnection;
}
/**
 * A connection for history requests: `hass.callWS` when Home Assistant offers
 * it, else its websocket connection.
 */
export function historyConnection(hass: HistoryHass): HistoryConnection {
  return {
    sendMessagePromise: <T>(message: Record<string, unknown>) => {
      if (hass.callWS) return hass.callWS<T>(message);
      if (hass.connection)
        return hass.connection.sendMessagePromise<T>(message);
      return Promise.reject(new Error("No connection to Home Assistant"));
    },
  };
}
/** An entity state as Home Assistant keeps it in `hass.states`. */
export interface HistoryEntity {
  entity_id?: string;
  state: string;
  attributes: Record<string, unknown>;
}
export type HistoryStates = Record<string, HistoryEntity | undefined>;

/** Time (ms) and value; `undefined` breaks the line (unavailable). */
export type Point = [number, number | undefined];
/** Time (ms) and the state from then on; `undefined` while unreported. */
export type Mark = [number, string | undefined];

/** The ranges every history view offers, in hours. */
export const RANGES = [6, 24, 168] as const;
export type Range = (typeof RANGES)[number];
/** Palette slots: `.series-0` … `.series-4` in the styles. */
export const PALETTE = 5;

/** What a line chart draws for one entity. */
export interface Source {
  entityId: string;
  /** Palette slot; related series (a reading and its setpoint) share one. */
  color: number;
  /**
   * `line` (default) joins readings; `step` holds each value until it changes and
   * is drawn dashed (a setpoint); `lane` is an on/off state drawn as a band under
   * the plot, filled while `on` (a door).
   */
  kind?: "line" | "step" | "lane";
  /** Card-specific tag carried through to the loaded series (e.g. a zone). */
  tag?: string;
  /** Read this attribute instead of the state (a climate entity's current_temperature). */
  attribute?: string;
  /** The unit, when the entity does not say (an attribute) or says it differently. */
  unit?: string;
}
export interface Series extends Source {
  unit: string;
  /** For a lane: 1 while on, 0 while off. */
  points: Point[];
  /** The entity's own states at the same times, for a lane's readout. */
  states: Mark[];
}

/** Home Assistant's compressed, minimal history row. */
interface Row {
  s: string;
  a?: Record<string, unknown>;
  lu?: number;
  lc?: number;
}
/** One row of `recorder/statistics_during_period`. */
interface StatisticsRow {
  start: number | string;
  mean?: number | null;
  state?: number | null;
}

const SILENT = new Set(["unavailable", "unknown", ""]);

/** A reading as a number; `undefined` while unavailable or not a number. */
export function numeric(state: string | undefined): number | undefined {
  if (state === undefined || SILENT.has(state)) return undefined;
  const value = Number(state);
  return Number.isFinite(value) ? value : undefined;
}

/** States that mean on/open for a lane; anything else reported means off. */
const ON = ["on", "open", "opening", "ajar", "unlocked", "true"];
/** 1 while on/open, 0 while off, `undefined` while unreported. */
export function onOff(state: string | undefined): number | undefined {
  if (state === undefined || SILENT.has(state)) return undefined;
  return ON.includes(state.toLowerCase()) ? 1 : 0;
}

export const isTemperature = (unit: string) => ["°C", "°F", "K"].includes(unit);

/** The unit of an entity's readings. */
export const unitOf = (state?: HistoryEntity) =>
  String(state?.attributes.unit_of_measurement ?? "");

/**
 * Whether a reading is worth a history line: a numeric sensor measurement, not a
 * timestamp, duration, enum, text or a controllable setting.
 */
export function isMeasurement(state: HistoryEntity | undefined): boolean {
  if (!state) return false;
  const a = state.attributes;
  if (
    ["duration", "timestamp", "date", "enum"].includes(String(a.device_class))
  )
    return false;
  if (!a.unit_of_measurement && !a.state_class) return false;
  return SILENT.has(state.state) || numeric(state.state) !== undefined;
}

export interface LoadOptions {
  /** The end of the window; now by default. */
  now?: number;
  /**
   * From this many hours on, readings with a `state_class` come from the
   * recorder's hourly long-term statistics (means) instead of every raw state
   * change, which keeps a week of a chatty sensor small. 0 turns it off.
   */
  statisticsFrom?: number;
}

/**
 * Raw history of `ids` since `start`, one request. With `attributes`, each row
 * carries its attributes (needed to read one), which costs a larger reply.
 */
async function rawRows(
  connection: HistoryConnection,
  ids: string[],
  start: number,
  attributes = false,
): Promise<Record<string, Row[]>> {
  if (!ids.length) return {};
  return (
    (await connection.sendMessagePromise<Record<string, Row[]>>({
      type: "history/history_during_period",
      start_time: new Date(start).toISOString(),
      entity_ids: ids,
      minimal_response: !attributes,
      no_attributes: !attributes,
      significant_changes_only: false,
    })) ?? {}
  );
}

/** Raw state history of `ids` since `start`, as marks. */
async function rawHistory(
  connection: HistoryConnection,
  ids: string[],
  start: number,
): Promise<Record<string, Mark[]>> {
  const reply = await rawRows(connection, ids, start);
  return Object.fromEntries(
    ids.map((id) => [
      id,
      (reply?.[id] ?? []).map((row): Mark => [
        Math.max(start, (row.lu ?? row.lc ?? 0) * 1000),
        row.s,
      ]),
    ]),
  );
}

/**
 * Hourly means of `ids` since `start`. An hour without a statistic is a gap: the
 * mark after the last row of a run says the sensor went quiet.
 */
async function hourlyMeans(
  connection: HistoryConnection,
  ids: string[],
  start: number,
  end: number,
): Promise<Record<string, Mark[]>> {
  if (!ids.length) return {};
  const reply = await connection.sendMessagePromise<
    Record<string, StatisticsRow[]>
  >({
    type: "recorder/statistics_during_period",
    start_time: new Date(start).toISOString(),
    end_time: new Date(end).toISOString(),
    statistic_ids: ids,
    period: "hour",
    types: ["mean", "state"],
  });
  const HOUR = 3_600_000;
  return Object.fromEntries(
    ids.map((id) => {
      const marks: Mark[] = [];
      let last: number | undefined;
      for (const row of reply?.[id] ?? []) {
        const t =
          typeof row.start === "number" ? row.start : Date.parse(row.start);
        const value = row.mean ?? row.state;
        if (!Number.isFinite(t) || value === null || value === undefined)
          continue;
        if (last !== undefined && t - last > HOUR * 1.5)
          marks.push([last + HOUR, undefined]);
        marks.push([Math.max(start, t), String(value)]);
        last = t;
      }
      return [id, marks];
    }),
  );
}

/**
 * The history of each source over the last `hours`, ending with the entity's
 * current state. Lanes are loaded as on/off, lines and steps as numbers.
 */
export async function loadSeries(
  connection: HistoryConnection,
  sources: Source[],
  states: HistoryStates,
  hours: number,
  options: LoadOptions = {},
): Promise<Series[]> {
  const now = options.now ?? Date.now();
  const start = now - hours * 3_600_000;
  const statisticsFrom = options.statisticsFrom ?? 168;
  const ids = [
    ...new Set(sources.filter((s) => !s.attribute).map((s) => s.entityId)),
  ];
  const withAttributes = [
    ...new Set(sources.filter((s) => s.attribute).map((s) => s.entityId)),
  ];
  const fromStatistics = new Set(
    statisticsFrom > 0 && hours >= statisticsFrom
      ? sources
          .filter(
            (s) =>
              s.kind !== "lane" &&
              s.kind !== "step" &&
              !s.attribute &&
              states[s.entityId]?.attributes.state_class,
          )
          .map((s) => s.entityId)
      : [],
  );
  const [raw, means, full] = await Promise.all([
    rawHistory(
      connection,
      ids.filter((id) => !fromStatistics.has(id)),
      start,
    ),
    hourlyMeans(connection, [...fromStatistics], start, now),
    rawRows(connection, withAttributes, start, true),
  ]);
  return sources.map((source) => {
    const current = states[source.entityId];
    const read = (state: string | undefined, a?: Record<string, unknown>) =>
      source.attribute
        ? SILENT.has(state ?? "") || a?.[source.attribute] == null
          ? undefined
          : String(a[source.attribute])
        : state;
    // Full rows repeat the last attributes: a row may omit unchanged ones.
    let attrs: Record<string, unknown> | undefined;
    const marks: Mark[] = source.attribute
      ? (full[source.entityId] ?? []).map((row): Mark => {
          attrs = row.a ?? attrs;
          return [
            Math.max(start, (row.lu ?? row.lc ?? 0) * 1000),
            read(row.s, attrs),
          ];
        })
      : [...(raw[source.entityId] ?? means[source.entityId] ?? [])];
    if (current) marks.push([now, read(current.state, current.attributes)]);
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

/** One lane of a state timeline: an entity's states over time. */
export interface Lane {
  /** What the lane is (the card decides: lock, contact, gate …). */
  kind: string;
  entityId: string;
  marks: Mark[];
}

/** The state history of each entity as timeline lanes, ending with its current state. */
export async function loadLanes(
  connection: HistoryConnection,
  lanes: Array<Pick<Lane, "kind" | "entityId">>,
  states: HistoryStates,
  hours: number,
  options: Pick<LoadOptions, "now"> = {},
): Promise<Lane[]> {
  const now = options.now ?? Date.now();
  const start = now - hours * 3_600_000;
  const raw = await rawHistory(
    connection,
    [...new Set(lanes.map((l) => l.entityId))],
    start,
  );
  return lanes.map((lane) => {
    const marks: Mark[] = [...(raw[lane.entityId] ?? [])];
    const current = states[lane.entityId];
    if (current) marks.push([now, current.state]);
    // A silent spell is a gap, whatever the entity called it.
    return {
      ...lane,
      marks: marks.map(([t, s]): Mark => [
        t,
        s === undefined || SILENT.has(s) ? undefined : s,
      ]),
    };
  });
}

/** The value in force at `time`: the last point at or before it. */
export function valueAt(series: Pick<Series, "points">, time: number) {
  let value: number | undefined;
  for (const [t, v] of series.points) {
    if (t > time) break;
    value = v;
  }
  return value;
}

/** The state in force at `time` in a series or lane. */
export function stateAt(
  item: { states?: Mark[]; marks?: Mark[] },
  time: number,
): string | undefined {
  let value: string | undefined;
  for (const [t, v] of item.states ?? item.marks ?? []) {
    if (t > time) break;
    value = v;
  }
  return value;
}
