import type { ReactiveController, ReactiveControllerHost } from "lit";
import type { Range } from "./data";
/**
 * The state of one history view: its range, what it loaded for which window,
 * the time under the pointer, loading and failure, and the plot's width.
 *
 * A reply that arrives after the range changed, the view was reset or the host
 * left the page is dropped, so a slow request never overwrites a newer one.
 */
export declare class HistoryController<T> implements ReactiveController {
    private readonly host;
    private readonly load;
    range: Range;
    data?: T;
    /** The loaded window, [start, end] in ms. */
    window?: [number, number];
    hover?: number;
    loading: boolean;
    error: string;
    /** The plot's width in px, following its element (see `observe`). */
    width: number;
    private ticket;
    private resize?;
    private observed?;
    constructor(host: ReactiveControllerHost, load: (range: Range, end: number) => Promise<T>, options?: {
        range?: Range;
    });
    hostDisconnected(): void;
    /** Load `range` (the current one by default). The failure text is prefixed with `failed`. */
    reload(range?: Range, failed?: string): Promise<void>;
    /** Forget what was loaded and ignore replies still on their way. */
    reset(): void;
    /** Stop listening for a reply without forgetting what is shown (a closed dialog). */
    cancel(): void;
    setHover(time: number | undefined): void;
    /** Follow an element's width, so the chart is drawn at its real size. */
    observe(element: Element | null | undefined): void;
}
//# sourceMappingURL=controller.d.ts.map