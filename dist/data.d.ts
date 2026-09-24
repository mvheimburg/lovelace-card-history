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
export declare function historyConnection(hass: HistoryHass): HistoryConnection;
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
export declare const RANGES: readonly [6, 24, 168];
/** A range in hours; cards may offer longer periods for daily statistics. */
export type Range = number;
/** Palette slots: `.series-0` … `.series-4` in the styles. */
export declare const PALETTE = 5;
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
/** A reading as a number; `undefined` while unavailable or not a number. */
export declare function numeric(state: string | undefined): number | undefined;
/** 1 while on/open, 0 while off, `undefined` while unreported. */
export declare function onOff(state: string | undefined): number | undefined;
export declare const isTemperature: (unit: string) => boolean;
/** The unit of an entity's readings. */
export declare const unitOf: (state?: HistoryEntity) => string;
/**
 * Whether a reading is worth a history line: a numeric sensor measurement, not a
 * timestamp, duration, enum, text or a controllable setting.
 */
export declare function isMeasurement(state: HistoryEntity | undefined): boolean;
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
 * The history of each source over the last `hours`, ending with the entity's
 * current state. Lanes are loaded as on/off, lines and steps as numbers.
 */
export declare function loadSeries(connection: HistoryConnection, sources: Source[], states: HistoryStates, hours: number, options?: LoadOptions): Promise<Series[]>;
/** One lane of a state timeline: an entity's states over time. */
export interface Lane {
    /** What the lane is (the card decides: lock, contact, gate …). */
    kind: string;
    entityId: string;
    marks: Mark[];
}
/** The state history of each entity as timeline lanes, ending with its current state. */
export declare function loadLanes(connection: HistoryConnection, lanes: Array<Pick<Lane, "kind" | "entityId">>, states: HistoryStates, hours: number, options?: Pick<LoadOptions, "now">): Promise<Lane[]>;
/** The value in force at `time`: the last point at or before it. */
export declare function valueAt(series: Pick<Series, "points">, time: number): number | undefined;
/** The state in force at `time` in a series or lane. */
export declare function stateAt(item: {
    states?: Mark[];
    marks?: Mark[];
}, time: number): string | undefined;
//# sourceMappingURL=data.d.ts.map