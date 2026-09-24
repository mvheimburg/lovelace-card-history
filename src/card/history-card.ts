import { LitElement, css, html, nothing } from "lit";
import { HistoryController } from "../controller";
import {
  RANGES,
  historyConnection,
  isMeasurement,
  loadLanes,
  loadSeries,
  numeric,
  stateAt,
  valueAt,
  type HistoryEntity,
  type Lane,
  type Range,
  type Series,
  type Source,
} from "../data";
import { historyFormat } from "../format";
import { lineChart, lineChartTimeAt, units } from "../line-chart";
import { historyStrings, type LanguageSource } from "../strings";
import { historyStyles } from "../styles";
import { timeline, timelineTimeAt } from "../timeline";
import { historyView, type LegendEntry } from "../view";
import { cardStrings } from "./strings";
import "./editor";

export interface EntityConfig {
  entity: string;
  name?: string;
}
export interface HistoryCardConfig {
  type: string;
  entities: Array<string | EntityConfig>;
  title?: string;
  /** The range shown first: 6, 24 or 168 hours. */
  hours?: Range;
  fill?: boolean;
  smooth?: boolean;
  show_current?: boolean;
  appearance?: "default" | "bubble";
}
interface Hass extends LanguageSource {
  states: Record<string, HistoryEntity>;
  callWS?<T>(message: Record<string, unknown>): Promise<T>;
  connection?: {
    sendMessagePromise<T>(message: Record<string, unknown>): Promise<T>;
  };
  formatEntityState?(state: HistoryEntity, value?: string): string;
}

/** Domains whose states are on or off: drawn as lanes under the chart. */
const ON_OFF = [
  "binary_sensor",
  "switch",
  "light",
  "fan",
  "input_boolean",
  "lock",
  "cover",
  "valve",
  "siren",
];

type Kind = "line" | "lane" | "text";
interface Loaded {
  series: Series[];
  lanes: Lane[];
}

/** How an entity is drawn: a line when it is a measurement, a lane when on/off, else a timeline. */
export function kindOf(
  entityId: string,
  state: HistoryEntity | undefined,
): Kind {
  const domain = entityId.split(".")[0];
  if (ON_OFF.includes(domain)) return "lane";
  if (
    isMeasurement(state) ||
    (state && numeric(state.state) !== undefined && domain === "sensor")
  )
    return "line";
  return "text";
}

/**
 * The History card: a chart of any entities, from Home Assistant's recorder.
 * Measurements are lines on up to two scales with a translucent fill; on/off
 * entities are lanes under them; other states are a timeline.
 */
export class HistoryCard extends LitElement {
  static properties = { hass: { attribute: false }, config: { state: true } };
  hass?: Hass;
  config?: HistoryCardConfig;
  private history = new HistoryController<Loaded>(this, (range, end) =>
    this.load(range, end),
  );
  private loadedFor = "";

  static styles = [
    historyStyles,
    css`
      :host {
        display: block;
        --history-series-0: var(--red-color, #e5484d);
        --history-series-1: var(--blue-color, #0b93d6);
        --history-series-2: var(--green-color, #2e9e5b);
        --history-series-3: var(--purple-color, #8e44ad);
        --history-series-4: var(--amber-color, #d99a06);
      }
      :host([data-appearance="bubble"]) {
        --history-surface: var(--bubble-main-background-color);
        --history-pill: var(--bubble-secondary-background-color);
        --history-tile: var(--bubble-sub-button-border-radius, 22px);
      }
      ha-card {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 16px;
        color: var(--history-text-color);
        background: var(--history-surface-color);
      }
      :host([data-appearance="bubble"]) ha-card {
        border: var(--bubble-border, none);
        border-radius: var(--bubble-border-radius, 32px);
      }
      .title {
        padding-left: 4px;
        font-size: 17px;
        font-weight: 700;
        color: var(--history-muted-color);
      }
      .current {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 8px 16px;
      }
      .now {
        display: flex;
        align-items: baseline;
        gap: 6px;
        padding: 2px 6px;
        border: 0;
        border-radius: 12px;
        font: inherit;
        color: var(--history-text-color);
        background: none;
        cursor: pointer;
      }
      .now:focus-visible {
        outline: 2px solid var(--history-accent-color);
      }
      .now .dot {
        align-self: center;
        width: 9px;
        height: 9px;
        border-radius: 50%;
        background: var(--series);
      }
      .now strong {
        font-size: 32px;
        font-weight: 600;
        letter-spacing: -0.02em;
        font-variant-numeric: tabular-nums;
      }
      .now small {
        font-size: 15px;
        color: var(--history-muted-color);
      }
      .timeline .b-s0 {
        --band: var(--history-series-0);
      }
      .timeline .b-s1 {
        --band: var(--history-series-1);
      }
      .timeline .b-s2 {
        --band: var(--history-series-2);
      }
      .timeline .b-s3 {
        --band: var(--history-series-3);
      }
      .timeline .b-s4 {
        --band: var(--history-series-4);
      }
      .timeline .band {
        fill-opacity: 0.75;
      }
      .missing {
        font-size: 14px;
        color: var(--history-muted-color);
      }
    `,
  ];

  setConfig(config: HistoryCardConfig) {
    if (!Array.isArray(config?.entities) || !config.entities.length)
      throw new Error(cardStrings().entitiesRequired);
    for (const item of config.entities) {
      const id = typeof item === "string" ? item : item?.entity;
      if (typeof id !== "string" || !id.includes("."))
        throw new Error(
          `${cardStrings().entitiesRequired}: ${JSON.stringify(item)}`,
        );
    }
    const hours = RANGES.includes(config.hours as Range) ? config.hours! : 24;
    this.config = {
      fill: true,
      smooth: false,
      show_current: true,
      appearance: "default",
      ...config,
      hours,
    };
    this.setAttribute(
      "data-appearance",
      this.config.appearance === "bubble" ? "bubble" : "default",
    );
    this.history.range = hours;
    this.loadedFor = "";
  }
  getCardSize() {
    return 6;
  }
  static getConfigElement() {
    return document.createElement("lovelace-card-history-editor");
  }
  static getStubConfig(hass?: Hass) {
    const entities = Object.keys(hass?.states ?? {})
      .filter(
        (id) =>
          id.startsWith("sensor.") &&
          hass!.states[id].attributes.device_class === "temperature",
      )
      .slice(0, 2);
    return {
      type: "custom:lovelace-card-history",
      entities: entities.length ? entities : ["sensor.temperature"],
    };
  }

  private get items(): EntityConfig[] {
    return (this.config?.entities ?? []).map((item) =>
      typeof item === "string" ? { entity: item } : item,
    );
  }
  private name(item: EntityConfig) {
    const friendly = this.hass?.states[item.entity]?.attributes.friendly_name;
    return (
      item.name ??
      (typeof friendly === "string" && friendly ? friendly : item.entity)
    );
  }

  /** Lines (on up to two scales) and lanes for the chart, text entities for the timeline. */
  private plan() {
    const states = this.hass?.states ?? {};
    const lines: Source[] = [];
    const lanes: Source[] = [];
    const texts: EntityConfig[] = [];
    let slot = 0;
    for (const item of this.items) {
      const kind = kindOf(item.entity, states[item.entity]);
      if (kind === "text") texts.push(item);
      else
        (kind === "line" ? lines : lanes).push({
          entityId: item.entity,
          color: slot++ % 5,
          kind,
        });
    }
    const unit = (s: Source) =>
      String(states[s.entityId]?.attributes.unit_of_measurement ?? "");
    const first = lines[0] ? unit(lines[0]) : "";
    const second = lines.map(unit).find((u) => u !== first);
    const drawn = lines.filter((s) => [first, second].includes(unit(s)));
    return {
      lines: drawn,
      hidden: lines.filter((s) => !drawn.includes(s)),
      lanes,
      texts,
      leftUnit: first,
    };
  }

  private async load(range: Range, end: number): Promise<Loaded> {
    const hass = this.hass!;
    const { lines, lanes, texts } = this.plan();
    const connection = historyConnection(hass);
    const [series, timelineLanes] = await Promise.all([
      loadSeries(connection, [...lines, ...lanes], hass.states, range, {
        now: end,
      }),
      texts.length
        ? loadLanes(
            connection,
            texts.map((t) => ({ kind: "text", entityId: t.entity })),
            hass.states,
            range,
            { now: end },
          )
        : Promise.resolve([]),
    ]);
    return { series, lanes: timelineLanes };
  }

  protected updated() {
    if (!this.hass || !this.config) return;
    const key = JSON.stringify(this.config.entities);
    if (key !== this.loadedFor) {
      this.loadedFor = key;
      this.history.reset();
      void this.history.reload(
        this.history.range,
        historyStrings(this.hass).failed,
      );
    }
    this.history.observe(this.shadowRoot?.querySelector(".history-plot"));
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.loadedFor = "";
  }
  connectedCallback() {
    super.connectedCallback();
    this.requestUpdate();
  }

  private moreInfo(entityId: string) {
    this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId },
        bubbles: true,
        composed: true,
      }),
    );
  }
  private stateLabel(entityId: string, value: string | undefined) {
    const t = historyStrings(this.hass);
    if (value === undefined) return "—";
    const state = this.hass?.states[entityId];
    const formatted = state
      ? this.hass?.formatEntityState?.(state, value)
      : undefined;
    if (formatted && formatted !== value) return formatted;
    if (value === "unavailable") return t.unavailable;
    if (value === "on" || value === "off") return t[value];
    return value;
  }

  render() {
    if (!this.config || !this.hass) return nothing;
    const t = historyStrings(this.hass);
    const c = cardStrings(this.hass);
    const f = historyFormat(this.hass);
    const plan = this.plan();
    const title = this.config.title ?? c.title;
    const missing = this.items.filter((i) => !this.hass!.states[i.entity]);
    const color = (id: string) =>
      [...plan.lines, ...plan.lanes].find((s) => s.entityId === id)?.color ?? 0;
    const textTone = (lane: Lane, state: string) => {
      const seen = [
        ...new Set(lane.marks.flatMap(([, s]) => (s === undefined ? [] : [s]))),
      ];
      return `s${Math.max(0, seen.indexOf(state)) % 5}`;
    };
    const current = this.config.show_current
      ? plan.lines.slice(0, 2).map((s) => {
          const state = this.hass!.states[s.entityId];
          const value = numeric(state?.state);
          const unit = String(state?.attributes.unit_of_measurement ?? "");
          return html`<button
            class="now series-${s.color}"
            type="button"
            title=${this.name({ entity: s.entityId })}
            @click=${() => this.moreInfo(s.entityId)}
          >
            <span class="dot"></span
            ><strong>${value === undefined ? "—" : f.reading(value)}</strong
            ><small>${unit}</small>
          </button>`;
        })
      : [];
    return html`<ha-card>
      ${title ? html`<div class="title">${title}</div>` : nothing}
      ${current.length ? html`<div class="current">${current}</div>` : nothing}
      ${historyView<Loaded>(this.history, {
        strings: t,
        format: f,
        isEmpty: (d) =>
          d.series.every((s) => s.points.every(([, v]) => v === undefined)) &&
          d.lanes.every((l) => l.marks.every(([, s]) => s === undefined)),
        chart: (d, [start, end], hover, width) => {
          const text = {
            number: f.number,
            time: f.time,
            label: `${t.history}: ${title}`,
          };
          return html`${
            d.series.length
              ? lineChart(d.series, start, end, hover, text, {
                  width,
                  leftUnit: plan.leftUnit || undefined,
                  fill: this.config!.fill,
                  smooth: this.config!.smooth,
                })
              : nothing
          }${
            d.lanes.length
              ? timeline(
                  d.lanes,
                  start,
                  end,
                  hover,
                  {
                    time: f.time,
                    label: `${t.history}: ${title}`,
                    lane: (lane) => this.name({ entity: lane.entityId }),
                    tone: textTone,
                  },
                  width,
                )
              : nothing
          }`;
        },
        timeAt: (e, svg, [start, end], d) =>
          svg.classList.contains("timeline")
            ? timelineTimeAt(e, svg, start, end)
            : lineChartTimeAt(
                e,
                svg,
                start,
                end,
                units(d.series, plan.leftUnit || undefined)[1] !== undefined,
              ),
        legend: (d, at) => {
          const entries: LegendEntry[] = d.series.map((s) => {
            const name = this.name(
              this.items.find((i) => i.entity === s.entityId) ?? {
                entity: s.entityId,
              },
            );
            if (s.kind === "lane") {
              const state =
                at === undefined
                  ? s.states[s.states.length - 1]?.[1]
                  : stateAt(s, at);
              return {
                entityId: s.entityId,
                name,
                color: s.color,
                kind: "lane",
                value: this.stateLabel(s.entityId, state),
              };
            }
            const value =
              at === undefined
                ? s.points[s.points.length - 1]?.[1]
                : valueAt(s, at);
            return {
              entityId: s.entityId,
              name,
              color: s.color,
              value: value === undefined ? "—" : f.reading(value, s.unit, 2),
            };
          });
          for (const lane of d.lanes) {
            const state =
              at === undefined
                ? lane.marks[lane.marks.length - 1]?.[1]
                : stateAt(lane, at);
            const item = this.items.find((i) => i.entity === lane.entityId) ?? {
              entity: lane.entityId,
            };
            entries.push({
              entityId: lane.entityId,
              name: this.name(item),
              color:
                state === undefined
                  ? 0
                  : Number(textTone(lane, state).slice(1)),
              kind: "lane",
              value: this.stateLabel(lane.entityId, state),
            });
          }
          for (const s of plan.hidden) {
            const state = this.hass!.states[s.entityId];
            entries.push({
              entityId: s.entityId,
              name: this.name({ entity: s.entityId }),
              color: color(s.entityId),
              value: state ? this.stateLabel(s.entityId, state.state) : "—",
              title: c.thirdUnit,
            });
          }
          return entries;
        },
        select: (id) => this.moreInfo(id),
      })}
      ${missing.length ? html`<p class="missing" role="status">${c.missing}: ${missing.map((m) => m.entity).join(", ")}</p>` : nothing}
    </ha-card>`;
  }
}

if (!customElements.get("lovelace-card-history"))
  customElements.define("lovelace-card-history", HistoryCard);

declare global {
  interface Window {
    customCards?: Array<{
      type: string;
      name: string;
      description: string;
      preview?: boolean;
    }>;
  }
}
window.customCards = window.customCards || [];
window.customCards.push({
  type: "lovelace-card-history",
  name: "History Card",
  description:
    "History of any sensors: translucent lines on two scales, on/off lanes and state timelines.",
  preview: true,
});
