import type { ReactiveController, ReactiveControllerHost } from "lit";
import type { Range } from "./data";

/**
 * The state of one history view: its range, what it loaded for which window,
 * the time under the pointer, loading and failure, and the plot's width.
 *
 * A reply that arrives after the range changed, the view was reset or the host
 * left the page is dropped, so a slow request never overwrites a newer one.
 */
export class HistoryController<T> implements ReactiveController {
  range: Range;
  data?: T;
  /** The loaded window, [start, end] in ms. */
  window?: [number, number];
  hover?: number;
  loading = false;
  error = "";
  /** The plot's width in px, following its element (see `observe`). */
  width = 600;
  private ticket = 0;
  private resize?: ResizeObserver;
  private observed?: Element;

  constructor(
    private readonly host: ReactiveControllerHost,
    private readonly load: (range: Range, end: number) => Promise<T>,
    options: { range?: Range } = {},
  ) {
    this.range = options.range ?? 24;
    host.addController(this);
  }

  hostDisconnected() {
    this.ticket++;
    this.loading = false;
    this.resize?.disconnect();
    this.resize = this.observed = undefined;
  }

  /** Load `range` (the current one by default). The failure text is prefixed with `failed`. */
  async reload(range: Range = this.range, failed = "") {
    const ticket = ++this.ticket;
    this.range = range;
    this.loading = true;
    this.error = "";
    this.hover = undefined;
    this.host.requestUpdate();
    const end = Date.now();
    try {
      const data = await this.load(range, end);
      if (ticket !== this.ticket) return;
      this.data = data;
      this.window = [end - range * 3_600_000, end];
    } catch (error) {
      if (ticket !== this.ticket) return;
      this.data = this.window = undefined;
      const message =
        error instanceof Error
          ? error.message
          : typeof error === "object" && error && "message" in error
            ? String((error as { message: unknown }).message)
            : String(error);
      this.error = failed ? `${failed}: ${message}` : message;
    }
    this.loading = false;
    this.host.requestUpdate();
  }

  /** Forget what was loaded and ignore replies still on their way. */
  reset() {
    this.ticket++;
    this.data = this.window = this.hover = undefined;
    this.loading = false;
    this.error = "";
    this.host.requestUpdate();
  }

  /** Stop listening for a reply without forgetting what is shown (a closed dialog). */
  cancel() {
    this.ticket++;
    this.loading = false;
    this.hover = undefined;
  }

  setHover(time: number | undefined) {
    if (time === this.hover) return;
    this.hover = time;
    this.host.requestUpdate();
  }

  /** Follow an element's width, so the chart is drawn at its real size. */
  observe(element: Element | null | undefined) {
    if (!element || element === this.observed) return;
    this.resize?.disconnect();
    this.observed = element;
    this.resize = new ResizeObserver(([entry]) => {
      const width = Math.round(entry.contentRect.width);
      // Redraw next frame, outside the observer's own layout pass.
      if (width > 0 && Math.abs(width - this.width) > 4)
        requestAnimationFrame(() => {
          this.width = width;
          this.host.requestUpdate();
        });
    });
    this.resize.observe(element);
  }
}
