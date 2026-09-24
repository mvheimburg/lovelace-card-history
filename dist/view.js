import { html, nothing } from "lit";
import { RANGES } from "./data";
/**
 * The body of a history view, shared by a card's dialog and the history card:
 * range buttons, the chart with a pointer readout, the time read, and a legend
 * whose entries open each entity's more-info.
 */
export function historyView(ctl, o) {
    const { data, window: range, hover, error } = ctl;
    const long = ctl.range > 48;
    const legend = data !== undefined && range ? o.legend(data, hover) : [];
    return html `<div
      class="history-ranges"
      role="group"
      aria-label=${o.strings.ranges}
    >
      ${(o.ranges ?? RANGES).map((hours) => html `<button
            class="history-range"
            type="button"
            data-range=${hours}
            aria-pressed=${String(ctl.range === hours)}
            @click=${() => void ctl.reload(hours, o.strings.failed)}
          >
            ${o.format.span(hours)}
          </button>`)}
    </div>
    <div
      class="history-plot"
      aria-busy=${String(ctl.loading)}
      @pointermove=${(e) => {
        const svg = e.currentTarget.querySelector("svg");
        if (!svg || !range || data === undefined)
            return;
        ctl.setHover(o.timeAt(e, svg, range, data));
    }}
      @pointerleave=${() => ctl.setHover(undefined)}
    >
      ${error
        ? html `<div class="history-note failed" role="alert">
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
            ? html `<p class="history-note" role="status">
                ${o.strings.loading}
              </p>`
            : o.isEmpty(data)
                ? html `<p class="history-note">${o.strings.empty}</p>`
                : o.chart(data, range, hover, Math.max(280, ctl.width))}
    </div>
    <p class="history-when" aria-live="polite">
      ${hover === undefined ? o.strings.now : long ? o.format.moment(hover) : o.format.time(hover)}
    </p>
    <div class="history-legend">
      ${legend.map((entry) => html `<button
            class=${`history-item series-${entry.color}${entry.kind ? ` kind-${entry.kind}` : ""}`}
            type="button"
            data-series=${entry.entityId}
            title=${entry.title ?? nothing}
            @click=${(e) => o.select(entry.entityId, e)}
          >
            <span class="swatch" aria-hidden="true"></span>
            <span class="label">${entry.name}</span>
            <strong>${entry.value}</strong>
          </button>`)}
    </div>`;
}
/** Close a dialog when its backdrop, outside the box, is clicked. */
function backdrop(e) {
    if (e.target !== e.currentTarget)
        return;
    const dialog = e.currentTarget;
    const r = dialog.getBoundingClientRect();
    if (e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom)
        dialog.close();
}
/**
 * A card's history dialog (`<dialog id="history">`). Open it with
 * `openHistoryDialog`, which also starts loading.
 */
export function historyDialog(ctl, o) {
    const close = (e) => e.currentTarget
        .closest("dialog")
        ?.close();
    return html `<dialog
    id="history"
    class="history-dialog"
    aria-labelledby="history-title"
    @click=${backdrop}
    @close=${(e) => {
        ctl.cancel();
        // Back to what opened the history, for keyboard and screen reader users.
        e.currentTarget.trigger?.focus?.();
        o.closed?.();
    }}
  >
    <div class="history-top">
      <h2 class="history-title" id="history-title">
        ${o.strings.history}${o.subtitle ? html ` <span class="history-subtitle">${o.subtitle}</span>` : nothing}
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
export async function openHistoryDialog(ctl, root, host, failed, trigger) {
    ctl.reset();
    await host.updateComplete;
    const dialog = root?.querySelector("dialog#history");
    if (dialog)
        dialog.trigger = trigger ?? undefined;
    if (dialog && !dialog.open)
        dialog.showModal();
    ctl.observe(root?.querySelector(".history-plot"));
    await ctl.reload(ctl.range, failed);
}
