import { afterEach, expect, it, vi } from "vitest";
import { HistoryCard, kindOf } from "../src/card/history-card";
import type { HistoryCardEditor } from "../src/card/editor";

afterEach(() => document.body.replaceChildren());

const HOUR = 3_600_000;
const measured = (name: string, state: string, unit: string) => ({
  state,
  attributes: {
    friendly_name: name,
    unit_of_measurement: unit,
    state_class: "measurement",
  },
});

function hass(language = "en", fail = false) {
  const now = Date.now();
  const s = (ms: number) => ms / 1000;
  const rows: Record<string, unknown[]> = {
    "sensor.outdoor": [
      { s: "5", lu: s(now - 20 * HOUR) },
      { s: "unavailable", lu: s(now - 12 * HOUR) },
      { s: "8", lu: s(now - 8 * HOUR) },
    ],
    "sensor.humidity": [{ s: "70", lu: s(now - 20 * HOUR) }],
    "binary_sensor.window": [
      { s: "off", lu: s(now - 20 * HOUR) },
      { s: "on", lu: s(now - 6 * HOUR) },
    ],
    "sensor.air": [
      { s: "good", lu: s(now - 20 * HOUR) },
      { s: "poor", lu: s(now - 3 * HOUR) },
    ],
  };
  const send = vi.fn(async (m: Record<string, unknown>) => {
    if (fail) throw new Error("Recorder is off");
    return Object.fromEntries(
      (m.entity_ids as string[]).map((id) => [id, rows[id] ?? []]),
    );
  });
  const states = {
    "sensor.outdoor": measured("Outdoor", "9.9", "°C"),
    "sensor.indoor": measured("Indoor", "21.4", "°C"),
    "sensor.humidity": measured("Humidity", "43", "%"),
    "sensor.co2": measured("CO2", "650", "ppm"),
    "binary_sensor.window": {
      state: "off",
      attributes: { friendly_name: "Window", device_class: "window" },
    },
    "sensor.air": {
      state: "good",
      attributes: { friendly_name: "Air quality", device_class: "enum" },
    },
  };
  return {
    hass: {
      language,
      states: Object.fromEntries(
        Object.entries(states).map(([id, v]) => [id, { entity_id: id, ...v }]),
      ),
      callWS: send,
    },
    send,
  };
}

async function mount(config: Record<string, unknown>, h = hass()) {
  const card = document.createElement("lovelace-card-history") as HistoryCard;
  card.setConfig({ type: "custom:lovelace-card-history", ...config } as never);
  card.hass = h.hass as never;
  document.body.append(card);
  await vi.waitFor(() =>
    expect(
      card.shadowRoot!.querySelector(".history-legend button"),
    ).not.toBeNull(),
  );
  await card.updateComplete;
  return { card, root: card.shadowRoot!, send: h.send };
}
const legend = (root: ShadowRoot) =>
  [...root.querySelectorAll(".history-item")].map((i) =>
    i.textContent!.replace(/\s+/g, " ").trim(),
  );

it("draws measurements on two scales, on/off entities as lanes and other states as a timeline", async () => {
  const { root, send } = await mount({
    title: "Climate",
    entities: [
      "sensor.outdoor",
      { entity: "sensor.humidity", name: "Humidity inside" },
      "binary_sensor.window",
      "sensor.air",
    ],
  });
  expect(root.querySelector(".title")!.textContent).toBe("Climate");
  expect(send.mock.calls[0][0]).toMatchObject({
    type: "history/history_during_period",
  });
  const svg = root.querySelector("svg.history-chart")!;
  expect([...svg.querySelectorAll(".unit")].map((u) => u.textContent)).toEqual([
    "°C",
    "%",
  ]);
  expect(
    svg
      .querySelector('.line[data-entity="sensor.outdoor"]')!
      .getAttribute("d")!
      .match(/M/g),
  ).toHaveLength(2);
  expect(svg.querySelectorAll(".area").length).toBeGreaterThan(0);
  expect(
    svg.querySelector('.lane[data-entity="binary_sensor.window"]'),
  ).not.toBeNull();
  expect(root.querySelector('svg.timeline [data-lane="text"]')).not.toBeNull();
  expect(legend(root)).toEqual([
    "Outdoor 9.9 °C",
    "Humidity inside 43 %",
    "Window Off",
    "Air quality good",
  ]);
  // The current values of the first two measurements, large.
  expect(
    [...root.querySelectorAll(".now")].map((n) =>
      n.textContent!.replace(/\s+/g, ""),
    ),
  ).toEqual(["9.9°C", "43%"]);
});

it("leaves a third unit out of the chart and says so, and opens more-info from the legend", async () => {
  const { card, root } = await mount({
    entities: [
      "sensor.outdoor",
      "sensor.indoor",
      "sensor.humidity",
      "sensor.co2",
    ],
  });
  expect(root.querySelector('.line[data-entity="sensor.co2"]')).toBeNull();
  const co2 = root.querySelector('[data-series="sensor.co2"]')!;
  expect(co2.getAttribute("title")).toBe(
    "Not drawn: the chart has room for two units",
  );
  const info: string[] = [];
  card.addEventListener("hass-more-info", (e) =>
    info.push((e as CustomEvent).detail.entityId),
  );
  root
    .querySelector<HTMLButtonElement>('[data-series="sensor.indoor"]')!
    .click();
  root.querySelector<HTMLButtonElement>(".now")!.click();
  expect(info).toEqual(["sensor.indoor", "sensor.outdoor"]);
});

it("starts on the configured range, switches range and speaks Bokmål", async () => {
  const { root, send } = await mount(
    { entities: ["sensor.outdoor"], hours: 6, fill: false, smooth: true },
    hass("nb-NO"),
  );
  expect(
    root.querySelector('[data-range="6"]')!.getAttribute("aria-pressed"),
  ).toBe("true");
  expect(root.querySelector(".title")!.textContent).toBe("Historikk");
  expect(root.querySelector(".area")).toBeNull();
  expect(legend(root)[0]).toBe("Outdoor 9,9 °C");
  root.querySelector<HTMLButtonElement>('[data-range="24"]')!.click();
  await vi.waitFor(() => expect(send).toHaveBeenCalledTimes(2));
});

it("explains a failed request", async () => {
  const card = document.createElement("lovelace-card-history") as HistoryCard;
  card.setConfig({
    type: "custom:lovelace-card-history",
    entities: ["sensor.outdoor"],
  });
  card.hass = hass("en", true).hass as never;
  document.body.append(card);
  await vi.waitFor(() =>
    expect(
      card.shadowRoot!.querySelector("[role=alert] span")?.textContent,
    ).toBe("Could not load history: Recorder is off"),
  );
});

it("needs entities, and sorts entities into lines, lanes and timelines", () => {
  const card = new HistoryCard();
  expect(() => card.setConfig({ type: "x", entities: [] })).toThrow(
    "Add at least one entity",
  );
  expect(
    kindOf("sensor.t", {
      state: "4",
      attributes: { unit_of_measurement: "°C" },
    }),
  ).toBe("line");
  expect(kindOf("lock.front", { state: "locked", attributes: {} })).toBe(
    "lane",
  );
  expect(kindOf("sensor.mode", { state: "eco", attributes: {} })).toBe("text");
});

it("edits the card in Bokmål and keeps names given in YAML", async () => {
  const editor = HistoryCard.getConfigElement() as HistoryCardEditor;
  editor.hass = { language: "nb", states: {} };
  editor.setConfig({
    type: "custom:lovelace-card-history",
    entities: [{ entity: "sensor.a", name: "Ute" }, "sensor.b"],
    hours: 168,
  });
  document.body.append(editor);
  await editor.updateComplete;
  const form = editor.shadowRoot!.querySelector("ha-form") as HTMLElement & {
    computeLabel(s: { name: string }): string;
    data: Record<string, unknown>;
  };
  expect(form.computeLabel({ name: "entities" })).toBe("Entiteter");
  expect(form.computeLabel({ name: "fill" })).toBe(
    "Gjennomsiktig fyll under linjene",
  );
  expect(form.data).toMatchObject({
    entities: ["sensor.a", "sensor.b"],
    hours: "168",
    fill: true,
  });
  const changed = vi.fn();
  editor.addEventListener("config-changed", changed);
  form.dispatchEvent(
    new CustomEvent("value-changed", {
      detail: {
        value: { ...form.data, entities: ["sensor.a", "sensor.c"], hours: "6" },
      },
    }),
  );
  expect(changed.mock.calls[0][0].detail.config).toMatchObject({
    entities: [{ entity: "sensor.a", name: "Ute" }, "sensor.c"],
    hours: 6,
  });
});
