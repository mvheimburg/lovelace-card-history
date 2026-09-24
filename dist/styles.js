import { css } from "lit";
/**
 * Styles for the history view, chart, timeline and dialog. A card maps its own
 * tokens onto the `--history-*` variables (on its host or card); without them
 * the view follows the Home Assistant theme.
 *
 * Palette: `.series-0` … `.series-4` set `--series` from `--history-series-N`.
 * Timeline bands take `--band`, which a card sets per tone class (`.b-<tone>`)
 * or per band (Home Assistant state colors).
 */
export const historyStyles = css `
  :host {
    --history-text-color: var(
      --history-text,
      var(--primary-text-color, #1b1b1a)
    );
    --history-muted-color: var(
      --history-muted,
      var(--secondary-text-color, #5b5a55)
    );
    --history-surface-color: var(
      --history-surface,
      var(--ha-card-background, var(--card-background-color, #fff))
    );
    --history-pill-color: var(
      --history-pill,
      var(--secondary-background-color, #f1f2f3)
    );
    --history-accent-color: var(
      --history-accent,
      var(--primary-color, #03a9f4)
    );
    --history-error-color: var(--history-error, var(--error-color, #c62828));
  }
  .series-0 {
    --series: var(--history-series-0, var(--primary-color, #03a9f4));
  }
  .series-1 {
    --series: var(--history-series-1, var(--orange-color, #ff9800));
  }
  .series-2 {
    --series: var(--history-series-2, var(--green-color, #4caf50));
  }
  .series-3 {
    --series: var(--history-series-3, var(--purple-color, #9c27b0));
  }
  .series-4 {
    --series: var(--history-series-4, var(--red-color, #f44336));
  }
  .history-ranges {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .history-range {
    min-height: 44px;
    padding: 0 16px;
    border: 0;
    border-radius: 22px;
    font: inherit;
    font-size: 14px;
    font-weight: 600;
    color: var(--history-text-color);
    background: color-mix(in srgb, var(--history-text-color) 7%, transparent);
    cursor: pointer;
  }
  .history-range[aria-pressed="true"] {
    color: color-mix(
      in srgb,
      var(--history-accent-color) 65%,
      var(--history-text-color)
    );
    background: color-mix(
      in srgb,
      var(--history-accent-color) 24%,
      transparent
    );
    box-shadow: inset 0 0 0 1.5px
      color-mix(in srgb, var(--history-accent-color) 60%, transparent);
  }
  .history-range:focus-visible,
  .history-item:focus-visible,
  .history-action:focus-visible,
  .history-inspector input:focus-visible,
  .history-close:focus-visible {
    outline: 2px solid var(--history-accent-color);
    outline-offset: 2px;
  }
  .history-inspector {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    color: var(--history-muted-color);
    font-size: 12px;
  }
  .history-inspector input {
    flex: 1;
    width: auto;
    padding: 0;
    border: 0;
    background: transparent;
    min-width: 120px;
    min-height: 44px;
    accent-color: var(--history-accent-color);
  }
  .timeline .band-label {
    fill: var(--history-text-color);
    font-size: 11px;
    pointer-events: none;
  }
  .history-plot {
    min-height: 120px;
    touch-action: pan-y;
  }
  .history-chart,
  .timeline {
    display: block;
    width: 100%;
    height: auto;
  }
  .history-chart .grid,
  .timeline .grid {
    stroke: color-mix(in srgb, var(--history-muted-color) 22%, transparent);
  }
  .history-chart .axis,
  .timeline .axis,
  .timeline .lane-label {
    fill: var(--history-muted-color);
    font-size: 12px;
    font-variant-numeric: tabular-nums;
  }
  .timeline .lane-label {
    font-weight: 600;
  }
  .history-chart .line {
    fill: none;
    stroke: var(--series);
    stroke-width: 2;
    stroke-linejoin: round;
    stroke-linecap: round;
  }
  .history-chart .dashed {
    stroke-dasharray: 5 4;
  }
  .history-chart .area {
    stroke: none;
  }
  .history-chart .area.series-0 {
    fill: url(#history-fill-0);
  }
  .history-chart .area.series-1 {
    fill: url(#history-fill-1);
  }
  .history-chart .area.series-2 {
    fill: url(#history-fill-2);
  }
  .history-chart .area.series-3 {
    fill: url(#history-fill-3);
  }
  .history-chart .area.series-4 {
    fill: url(#history-fill-4);
  }
  .history-chart .fill-top {
    stop-color: var(--series);
    stop-opacity: var(--history-fill-opacity, 0.32);
  }
  .history-chart .fill-bottom {
    stop-color: var(--series);
    stop-opacity: 0;
  }
  .history-chart .lane-track {
    fill: color-mix(in srgb, var(--series) 16%, transparent);
  }
  .history-chart .lane-on {
    fill: var(--series);
  }
  .history-chart .cursor,
  .timeline .cursor {
    stroke: var(--history-muted-color);
    stroke-dasharray: 3 3;
  }
  .timeline .track {
    fill: color-mix(in srgb, var(--history-muted-color) 10%, transparent);
  }
  .timeline .band {
    fill: var(--band, var(--history-muted-color));
  }
  .timeline .band.b-gap {
    fill: url(#history-hatch);
  }
  .timeline .hatch-bg {
    fill: color-mix(in srgb, var(--history-muted-color) 12%, transparent);
  }
  .timeline .hatch {
    stroke: color-mix(in srgb, var(--history-muted-color) 45%, transparent);
    stroke-width: 2;
  }
  .history-note {
    margin: 40px 0;
    text-align: center;
    font-size: 14px;
    color: var(--history-muted-color);
  }
  .history-note.failed {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 10px 14px;
    margin: 24px 0;
    padding: 12px 14px;
    border-radius: var(--history-tile, 16px);
    color: var(--history-text-color);
    background: color-mix(
      in srgb,
      var(--history-error-color) 16%,
      var(--history-pill-color)
    );
  }
  .history-when {
    margin: -6px 8px 0;
    font-size: 12.5px;
    color: var(--history-muted-color);
    font-variant-numeric: tabular-nums;
  }
  .history-legend {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(150px, 100%), 1fr));
    gap: 6px;
  }
  .history-item {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    gap: 2px 10px;
    min-height: 44px;
    padding: 8px 14px;
    border: 0;
    border-radius: var(--history-tile, 16px);
    font: inherit;
    text-align: left;
    color: var(--history-text-color);
    background: var(--history-pill-color);
    cursor: pointer;
  }
  .history-item .swatch {
    grid-row: span 2;
    width: 16px;
    height: 0;
    border-top: 3px solid var(--series);
  }
  .history-item.kind-step .swatch {
    border-top-style: dashed;
  }
  .history-item.kind-lane .swatch {
    height: 10px;
    border-top: 0;
    border-radius: 2px;
    background: var(--series);
  }
  .history-item .label {
    font-size: 0.78rem;
    color: var(--history-muted-color);
    overflow-wrap: anywhere;
  }
  .history-item strong {
    font-size: 1rem;
    font-variant-numeric: tabular-nums;
    overflow-wrap: anywhere;
  }
  dialog.history-dialog {
    color: var(--history-text-color);
    background: var(--history-surface-color);
    border: 0;
    border-radius: var(--history-radius, 24px);
    padding: 16px;
    width: min(640px, calc(100vw - 24px));
    max-width: calc(100vw - 24px);
    max-height: calc(100dvh - 32px);
    overflow: auto;
    box-shadow: 0 16px 60px #0006;
  }
  dialog.history-dialog[open] {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  dialog.history-dialog::backdrop {
    background: #0008;
  }
  .history-top {
    display: flex;
    align-items: center;
    gap: 8px;
    padding-left: 8px;
  }
  .history-title {
    flex: 1;
    min-width: 0;
    margin: 0;
    font-size: 17px;
    font-weight: 700;
    color: var(--history-muted-color);
    overflow-wrap: anywhere;
  }
  .history-subtitle {
    display: block;
    font-size: 13px;
    font-weight: 500;
  }
  .history-action,
  .history-close {
    flex: 0 0 44px;
    width: 44px;
    height: 44px;
    padding: 0;
    display: grid;
    place-items: center;
    border: 0;
    border-radius: 50%;
    color: var(--history-muted-color);
    background: var(--history-pill-color);
    cursor: pointer;
  }
  .history-action svg,
  .history-close svg {
    width: 22px;
    height: 22px;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
  }
  @media (max-width: 400px) {
    dialog.history-dialog {
      padding: 12px;
    }
  }
`;
