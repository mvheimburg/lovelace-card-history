import { html, nothing, type TemplateResult } from "lit";
import type { HistoryController } from "./controller";
import { RANGES, type Range } from "./data";
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
  chart: (
    data: T,
    window: [number, number],
    hover: number | undefined,
    width: number,
  ) => TemplateResult;
  /** Whether what was loaded has anything to draw. */
  isEmpty: (data: T) => boolean;
  /** The time under the pointer on the drawn chart. */
  timeAt: (
    event: PointerEvent,
    svg: SVGSVGElement,
    window: [number, number],
    data: T,
  ) => number;
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
export function historyView<T>(
  ctl: HistoryController<T>,
  o: HistoryViewOptions<T>,
): TemplateResult {
  const { data, window: range, hover, error } = ctl;
  const long = ctl.range > 48;
  const legend = data !== undefined && range ? o.legend(data, hover) : [];
  return html`<div
      class="history-ranges"
      role="group"
      aria-label=${o.strings.ranges}
    >
      ${(o.ranges ?? RANGES).map(
        (hours) =>
          html`<button
            class="history-range"
            type="button"
            data-range=${hours}
            aria-pressed=${String(ctl.range === hours)}
            @click=${() => void ctl.reload(hours, o.strings.failed)}
          >
            ${o.format.span(hours)}
          </button>`,
      )}
    </div>
    <div
      class="history-plot"
      aria-busy=${String(ctl.loading)}
      @pointermove=${(e: PointerEvent) => {
        const svg = (e.currentTarget as HTMLElement).querySelector("svg");
        if (!svg || !range || data === undefined) return;
        ctl.setHover(o.timeAt(e, svg, range, data));
      }}
      @pointerleave=${() => ctl.setHover(undefined)}
    >
      ${
        error
          ? html`<div class="history-note failed" role="alert">
              <span>${error}</span>
              <button
                class="history-range"
                type="button"
                data-retry
                @click=${() => void ctl.reload(ctl.range, o.strings.failed)}
              >
                ${o.strings.retry}
              </button>
            </div>`
          : data === undefined || !range
            ? html`<p class="history-note" role="status">
                ${o.strings.loading}
              </p>`
            : o.isEmpty(data)
              ? html`<p class="history-note">${o.strings.empty}</p>`
              : o.chart(data, range, hover, Math.max(280, ctl.width))
      }
    </div>
    <p class="history-when" aria-live="polite">
      ${hover === undefined ? o.strings.now : long ? o.format.moment(hover) : o.format.time(hover)}
    </p>
    <div class="history-legend">
      ${legend.map(
        (entry) =>
          html`<button
            class=${`history-item series-${entry.color}${entry.kind ? ` kind-${entry.kind}` : ""}`}
            type="button"
            data-series=${entry.entityId}
            title=${entry.title ?? nothing}
            @click=${(e: Event) => o.select(entry.entityId, e)}
          >
            <span class="swatch" aria-hidden="true"></span>
            <span class="label">${entry.name}</span>
            <strong>${entry.value}</strong>
          </button>`,
      )}
    </div>`;
}

export interface HistoryDialogOptions<T> extends HistoryViewOptions<T> {
  /** What the history is of: the card's or appliance's name. */
  subtitle?: string;
  /** Called when the dialog closes (by button, Escape or backdrop). */
  closed?: () => void;
}

/** Close a dialog when its backdrop, outside the box, is clicked. */
function backdrop(e: MouseEvent) {
  if (e.target !== e.currentTarget) return;
  const dialog = e.currentTarget as HTMLDialogElement;
  const r = dialog.getBoundingClientRect();
  if (
    e.clientX < r.left ||
    e.clientX > r.right ||
    e.clientY < r.top ||
    e.clientY > r.bottom
  )
    dialog.close();
}

/**
 * A card's history dialog (`<dialog id="history">`). Open it with
 * `openHistoryDialog`, which also starts loading.
 */
export function historyDialog<T>(
  ctl: HistoryController<T>,
  o: HistoryDialogOptions<T>,
): TemplateResult {
  const close = (e: Event) =>
    (e.currentTarget as HTMLElement)
      .closest<HTMLDialogElement>("dialog")
      ?.close();
  return html`<dialog
    id="history"
    class="history-dialog"
    aria-labelledby="history-title"
    @click=${backdrop}
    @close=${(e: Event) => {
      ctl.cancel();
      // Back to what opened the history, for keyboard and screen reader users.
      (
        e.currentTarget as HTMLDialogElement & { trigger?: HTMLElement }
      ).trigger?.focus?.();
      o.closed?.();
    }}
  >
    <div class="history-top">
      <h2 class="history-title" id="history-title">
        ${o.strings.history}${o.subtitle ? html` <span class="history-subtitle">${o.subtitle}</span>` : nothing}
      </h2>
      <button
        class="history-close"
        type="button"
        data-close-history
        aria-label=${o.strings.closeHistory}
        title=${o.strings.closeHistory}
        @click=${close}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18 6 6 18M6 6l12 12"></path>
        </svg>
      </button>
    </div>
    ${historyView(ctl, {
      ...o,
      // Home Assistant's more-info opens over the page: close the history first.
      select: (id, e) => {
        close(e);
        o.select(id, e);
      },
    })}
  </dialog>`;
}

/**
 * Open the history dialog in `root` and load its data. Focus returns to
 * `trigger` (the tapped reading) when the dialog closes.
 */
export async function openHistoryDialog<T>(
  ctl: HistoryController<T>,
  root: ParentNode | null | undefined,
  host: { updateComplete: Promise<unknown> },
  failed: string,
  trigger?: HTMLElement | null,
) {
  ctl.reset();
  await host.updateComplete;
  const dialog = root?.querySelector<
    HTMLDialogElement & { trigger?: HTMLElement }
  >("dialog#history");
  if (dialog) dialog.trigger = trigger ?? undefined;
  if (dialog && !dialog.open) dialog.showModal();
  ctl.observe(root?.querySelector(".history-plot"));
  await ctl.reload(ctl.range, failed);
}
