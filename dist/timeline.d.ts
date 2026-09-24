import type { Lane } from "./data";
export interface TimelineText {
    time: (ms: number, withDay: boolean) => string;
    /** A lane's heading. */
    lane: (lane: Lane) => string;
    /** The timeline's accessible name. */
    label: string;
    /**
     * A state's tone, which names its band class (`b-<tone>`). A silent spell
     * (`undefined` state) is always the hatched `gap`.
     */
    tone: (lane: Lane, state: string) => string;
    /** Optional state labels, shown within a band when they fit. */
    stateLabel?: (lane: Lane, state: string | undefined) => string;
    /** Stable lane identity when multiple entities have the same kind. */
    laneId?: (lane: Lane) => string;
    /** A band's color when it should not come from its tone class, e.g. HA state colors. */
    color?: (lane: Lane, state: string) => string | undefined;
}
/**
 * One lane per entity with a colored band per state, from `start` to `end`.
 * A silent (unavailable) spell is hatched; time before any record is empty.
 */
export declare function timeline(lanes: Lane[], start: number, end: number, hover: number | undefined, text: TimelineText, W?: number): import("lit-html").TemplateResult<2>;
/** The time under a pointer over a timeline. */
export declare function timelineTimeAt(event: {
    clientX: number;
}, element: Element, start: number, end: number): number;
//# sourceMappingURL=timeline.d.ts.map