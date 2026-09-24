import { type TemplateResult } from "lit";
import type { HistoryController } from "./controller";
import { type Range } from "./data";
import type { HistoryFormat } from "./format";
import type { HistoryStrings } from "./strings";
/** One entry of a history legend. */
export interface LegendEntry {
    entityId: string;
    name: string;
    /** The value shown, already formatted (at the pointer, else now). */
    value: string;
    /** Palette slot. */
    color: number;
    /** How the swatch is drawn: a line, a dashed setpoint, or a filled lane. */
    kind?: "line" | "step" | "lane";
    title?: string;
}
export interface HistoryViewOptions<T> {
    strings: HistoryStrings;
    format: HistoryFormat;
    /** The chart for what was loaded; `width` is the plot's width in px. */
    chart: (data: T, window: [number, number], hover: number | undefined, width: number) => TemplateResult;
    /** Whether what was loaded has anything to draw. */
    isEmpty: (data: T) => boolean;
    /** The time under the pointer on the drawn chart. */
    timeAt: (event: PointerEvent, svg: SVGSVGElement, window: [number, number], data: T) => number;
    /** The legend at `time` (now when undefined). */
    legend: (data: T, time: number | undefined) => LegendEntry[];
    /** A legend entry was chosen: open its more-info. */
    select: (entityId: string, event: Event) => void;
    /** Ranges offered; 6 h, 24 h and 7 d by default. */
    ranges?: readonly Range[];
}
/**
 * The body of a history view, shared by a card's dialog and the history card:
 * range buttons, the chart with a pointer readout, the time read, and a legend
 * whose entries open each entity's more-info.
 */
export declare function historyView<T>(ctl: HistoryController<T>, o: HistoryViewOptions<T>): TemplateResult;
export interface HistoryDialogOptions<T> extends HistoryViewOptions<T> {
    /** What the history is of: the card's or appliance's name. */
    subtitle?: string;
    /** Called when the dialog closes (by button, Escape or backdrop). */
    closed?: () => void;
}
/**
 * A card's history dialog (`<dialog id="history">`). Open it with
 * `openHistoryDialog`, which also starts loading.
 */
export declare function historyDialog<T>(ctl: HistoryController<T>, o: HistoryDialogOptions<T>): TemplateResult;
/**
 * Open the history dialog in `root` and load its data. Focus returns to
 * `trigger` (the tapped reading) when the dialog closes.
 */
export declare function openHistoryDialog<T>(ctl: HistoryController<T>, root: ParentNode | null | undefined, host: {
    updateComplete: Promise<unknown>;
}, failed: string, trigger?: HTMLElement | null): Promise<void>;
//# sourceMappingURL=view.d.ts.map