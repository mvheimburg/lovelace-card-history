import { LitElement, html } from "lit";
import { afterEach, expect, it, vi } from "vitest";
import { HistoryController } from "../src/controller";
import type { Range } from "../src/data";
import { historyFormat } from "../src/format";
import {
  HISTORY_MODES,
  historyMode,
  historyModeOptions,
  historyPanelPath,
  openHomeAssistantHistory,
} from "../src/open";
import { historyStrings } from "../src/strings";
import { historyStyles } from "../src/styles";
import { historyDialog, openHistoryDialog } from "../src/view";

afterEach(() => document.body.replaceChildren());

type Data = { value: number };
class Host extends LitElement {
  static styles = historyStyles;
  language = "en";
  load = vi.fn(async (range: Range) => ({ value: range }) as Data);
  ctl = new HistoryController<Data>(this, (range) => this.load(range));
  picked: string[] = [];
  render() {
    const hass = { language: this.language };
    return html`<button id="open">Open</button>${historyDialog(this.ctl, {
        strings: historyStrings(hass),
        format: historyFormat(hass),
        subtitle: "Kitchen",
        isEmpty: (d) => d.value === 0,
        chart: (d) =>
          html`<svg class="history-chart" viewBox="0 0 600 200">
            <text>${d.value}</text>
          </svg>`,
        timeAt: () => 42,
        legend: (d, at) => [
          {
            entityId: "sensor.a",
            name: "A",
            value: `${d.value}${at ? "@" : ""}`,
            color: 0,
          },
        ],
        select: (id) => this.picked.push(id),
      })}`;
  }
}
customElements.define("history-test-host", Host);

async function mount(language = "en") {
  const el = document.createElement("history-test-host") as Host;
  el.language = language;
  document.body.append(el);
  await el.updateComplete;
  const root = el.shadowRoot!;
  const trigger = root.querySelector<HTMLButtonElement>("#open")!;
  trigger.focus();
  await openHistoryDialog(
    el.ctl,
    root,
    el,
    historyStrings({ language }).failed,
    trigger,
  );
  await el.updateComplete;
  return { el, root, trigger };
}
const text = (root: ParentNode, sel: string) =>
  root.querySelector(sel)?.textContent?.replace(/\s+/g, " ").trim();

it("opens, loads, changes range and drops a late reply", async () => {
  const { el, root } = await mount();
  expect(root.querySelector<HTMLDialogElement>("#history")!.open).toBe(true);
  expect(text(root, "#history-title")).toBe("History Kitchen");
  expect(text(root, ".history-legend")).toBe("A 24");
  expect(
    [...root.querySelectorAll("[data-range]")].map((b) =>
      b.textContent!.trim(),
    ),
  ).toEqual(["6 hr", "24 hr", "7 days"]);
  let release!: (d: Data) => void;
  el.load.mockImplementationOnce(() => new Promise((r) => (release = r)));
  root.querySelector<HTMLButtonElement>('[data-range="6"]')!.click();
  await el.updateComplete;
  expect(
    root.querySelector('[data-range="6"]')!.getAttribute("aria-pressed"),
  ).toBe("true");
  root.querySelector<HTMLButtonElement>('[data-range="168"]')!.click();
  await vi.waitFor(() => expect(text(root, ".history-legend")).toBe("A 168"));
  release({ value: 6 });
  await el.updateComplete;
  expect(text(root, ".history-legend")).toBe("A 168");
});

it("reads the pointer, opens a legend entry after closing, and returns focus", async () => {
  const { el, root, trigger } = await mount();
  root
    .querySelector(".history-plot")!
    .dispatchEvent(new PointerEvent("pointermove", { clientX: 10 }));
  await el.updateComplete;
  expect(el.ctl.hover).toBe(42);
  expect(text(root, ".history-when")).not.toBe("Now");
  expect(text(root, ".history-legend")).toBe("A 24@");
  root.querySelector<HTMLButtonElement>('[data-series="sensor.a"]')!.click();
  expect(el.picked).toEqual(["sensor.a"]);
  expect(root.querySelector<HTMLDialogElement>("#history")!.open).toBe(false);
  expect(root.activeElement).toBe(trigger);
});

it("explains a failure in Bokmål and retries", async () => {
  const el = document.createElement("history-test-host") as Host;
  el.language = "nb";
  el.load.mockRejectedValueOnce(new Error("Recorder is off"));
  document.body.append(el);
  await el.updateComplete;
  const root = el.shadowRoot!;
  await openHistoryDialog(
    el.ctl,
    root,
    el,
    historyStrings({ language: "nb" }).failed,
  );
  await el.updateComplete;
  expect(text(root, "[role=alert] span")).toBe(
    "Kunne ikke hente historikk: Recorder is off",
  );
  expect(text(root, "[data-retry]")).toBe("Prøv igjen");
  expect(
    root.querySelector("[data-close-history]")!.getAttribute("aria-label"),
  ).toBe("Lukk historikk");
  root.querySelector<HTMLButtonElement>("[data-retry]")!.click();
  await vi.waitFor(() => expect(text(root, ".history-legend")).toBe("A 24"));
  expect(
    [...root.querySelectorAll("[data-range]")].map((b) =>
      b.textContent!.trim(),
    ),
  ).toEqual(["6 t", "24 t", "7 d"]);
});

it("offers Home Assistant's own history instead, when a card is set to", () => {
  expect(HISTORY_MODES).toEqual(["card", "more-info", "panel"]);
  expect(historyMode("panel")).toBe("panel");
  expect(historyMode("nonsense")).toBe("card");
  expect(historyModeOptions({ language: "nb" }).map((o) => o.label)).toEqual([
    "I kortet",
    "Home Assistants detaljer",
    "Home Assistants historikkside",
  ]);
  const now = Date.UTC(2026, 8, 24, 12);
  expect(historyPanelPath(["sensor.a", "sensor.b"], 6, now)).toBe(
    `/history?entity_id=sensor.a%2Csensor.b&start_date=${encodeURIComponent(new Date(now - 6 * 3_600_000).toISOString())}`,
  );
  const el = document.createElement("div");
  document.body.append(el);
  const info: string[] = [];
  document.body.addEventListener("hass-more-info", (e) =>
    info.push((e as CustomEvent).detail.entityId),
  );
  expect(openHomeAssistantHistory(el, "card", ["sensor.a"])).toBe(false);
  expect(
    openHomeAssistantHistory(el, "more-info", ["sensor.a", "sensor.b"]),
  ).toBe(true);
  expect(info).toEqual(["sensor.a"]);
  const moves: string[] = [];
  const listener = () => moves.push(location.pathname + location.search);
  window.addEventListener("location-changed", listener);
  const before = location.href;
  expect(openHomeAssistantHistory(el, "panel", ["sensor.a"], 24)).toBe(true);
  expect(moves[0]).toMatch(/^\/history\?entity_id=sensor\.a&start_date=/);
  window.removeEventListener("location-changed", listener);
  history.replaceState(null, "", before);
});
