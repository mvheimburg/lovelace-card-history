import { LitElement, css, html, nothing } from "lit";
import type { LanguageSource } from "../strings";
import { cardStrings } from "./strings";
import type { EntityConfig, HistoryCardConfig } from "./history-card";

/**
 * The History card's visual editor, on Home Assistant's own form. Names given
 * in YAML (`{entity, name}`) are kept when the entity list changes.
 */
export class HistoryCardEditor extends LitElement {
  static properties = { hass: { attribute: false }, config: { state: true } };
  hass?: LanguageSource & { states: Record<string, unknown> };
  config?: HistoryCardConfig;
  static styles = css`
    ha-form {
      display: block;
      padding: 8px 0;
    }
  `;

  setConfig(config: HistoryCardConfig) {
    this.config = config;
  }

  private schema() {
    const c = cardStrings(this.hass);
    return [
      { name: "title", selector: { text: {} } },
      {
        name: "entities",
        required: true,
        selector: { entity: { multiple: true } },
      },
      {
        name: "hours",
        selector: {
          select: {
            mode: "dropdown",
            options: [
              { value: "6", label: c.hours6 },
              { value: "24", label: c.hours24 },
              { value: "168", label: c.days7 },
            ],
          },
        },
      },
      { name: "show_current", selector: { boolean: {} } },
      { name: "fill", selector: { boolean: {} } },
      { name: "smooth", selector: { boolean: {} } },
      {
        name: "appearance",
        selector: {
          select: {
            options: [
              { value: "default", label: c.defaultAppearance },
              { value: "bubble", label: "Bubble" },
            ],
          },
        },
      },
    ];
  }

  private changed(e: CustomEvent) {
    e.stopPropagation();
    const value = e.detail.value as Record<string, unknown>;
    const named = new Map(
      (this.config?.entities ?? [])
        .filter((i): i is EntityConfig => typeof i !== "string" && !!i.name)
        .map((i) => [i.entity, i]),
    );
    const entities = ((value.entities as string[] | undefined) ?? []).map(
      (id) => named.get(id) ?? id,
    );
    const config = {
      ...this.config,
      ...value,
      entities,
      ...(value.hours !== undefined ? { hours: Number(value.hours) } : {}),
    } as HistoryCardConfig;
    this.config = config;
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    if (!this.hass || !this.config) return nothing;
    const c = cardStrings(this.hass);
    const labels: Record<string, string> = {
      title: c.cardTitle,
      entities: c.entities,
      hours: c.range,
      show_current: c.showCurrent,
      fill: c.fill,
      smooth: c.smooth,
      appearance: c.appearance,
    };
    const data = {
      fill: true,
      smooth: false,
      show_current: true,
      appearance: "default",
      ...this.config,
      hours: String(this.config.hours ?? 24),
      entities: this.config.entities.map((i) =>
        typeof i === "string" ? i : i.entity,
      ),
    };
    return html`<ha-form
      .hass=${this.hass}
      .data=${data}
      .schema=${this.schema()}
      .computeLabel=${(s: { name: string }) => labels[s.name] ?? s.name}
      @value-changed=${this.changed}
    ></ha-form>`;
  }
}

if (!customElements.get("lovelace-card-history-editor"))
  customElements.define("lovelace-card-history-editor", HistoryCardEditor);
