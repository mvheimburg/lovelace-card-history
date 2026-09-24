import { render } from "lit";
import { afterEach, expect, it } from "vitest";
import type { Series } from "../src/data";
import { lineChart, lineChartTimeAt, units } from "../src/line-chart";
import { timeline, timelineTimeAt } from "../src/timeline";
import { stateColor } from "../src/state-colors";

const HOUR = 3_600_000;
const END = Date.UTC(2026, 8, 24, 12);
const START = END - 24 * HOUR;
const text = {
  number: (v: number, d: number) => v.toFixed(d),
  time: () => "t",
  label: "History: test",
};

afterEach(() => document.body.replaceChildren());
function draw(template: unknown) {
  const host = document.createElement("div");
  document.body.append(host);
  render(template, host);
  return host;
}
const series = (
  entityId: string,
  unit: string,
  values: Array<number | undefined>,
  extra: Partial<Series> = {},
): Series => ({
  entityId,
  color: 0,
  unit,
  points: values.map((v, i) => [START + i * 6 * HOUR, v]),
  states: [],
  ...extra,
});

it("draws two scales, gaps, a translucent fill and a dashed setpoint step", () => {
  const all = [
    series("sensor.out", "°C", [5, 6, undefined, 8, 9]),
    series("number.target", "°C", [7, 7, 8, 8, 8], { kind: "step", color: 0 }),
    series("sensor.hum", "%", [60, 62, 64, 66, 70], { color: 1 }),
  ];
  expect(units(all)).toEqual(["°C", "%"]);
  const host = draw(lineChart(all, START, END, START + 12 * HOUR, text));
  const svg = host.querySelector("svg.history-chart")!;
  expect(svg.getAttribute("aria-label")).toBe("History: test");
  expect([...svg.querySelectorAll(".unit")].map((u) => u.textContent)).toEqual([
    "°C",
    "%",
  ]);
  const out = svg.querySelector('.line[data-entity="sensor.out"]')!;
  // The unavailable spell splits the line in two, and each part gets a fill.
  expect(out.getAttribute("d")!.match(/M/g)).toHaveLength(2);
  expect(svg.querySelectorAll(".area.series-0")).toHaveLength(2);
  const target = svg.querySelector('.line[data-entity="number.target"]')!;
  expect(target.classList.contains("dashed")).toBe(true);
  expect(target.getAttribute("d")).toMatch(/H[\d.]+ V/);
  expect(svg.querySelector(".cursor")).not.toBeNull();
  // The fill follows the series colour through CSS: one gradient per palette slot.
  expect(svg.querySelectorAll("linearGradient")).toHaveLength(5);
});

it("puts a chosen unit left, smooths without fill on request, and draws on/off lanes", () => {
  const all = [
    series("sensor.hum", "%", [60, 62, 64, 66, 70], { color: 1 }),
    series("sensor.out", "°C", [5, 6, 7, 8, 9]),
    series("binary_sensor.door", "", [0, 1, 0, 0, 1], {
      kind: "lane",
      color: 2,
    }),
  ];
  expect(units(all, "%")).toEqual(["%", "°C"]);
  const host = draw(
    lineChart(all, START, END, undefined, text, {
      leftUnit: "%",
      fill: false,
      smooth: true,
    }),
  );
  const svg = host.querySelector("svg")!;
  expect([...svg.querySelectorAll(".unit")].map((u) => u.textContent)).toEqual([
    "%",
    "°C",
  ]);
  expect(svg.querySelector(".area")).toBeNull();
  expect(
    svg.querySelector('.line[data-entity="sensor.out"]')!.getAttribute("d"),
  ).toContain("C");
  const lane = svg.querySelector('.history-lane[data-entity="binary_sensor.door"]')!;
  expect(lane.querySelectorAll(".lane-track")).toHaveLength(5);
  expect(lane.querySelectorAll(".lane-on")).toHaveLength(2);
  expect(
    svg.querySelector('path[data-entity="binary_sensor.door"]'),
  ).toBeNull();
});

it("maps the pointer to a time on either chart", () => {
  const host = draw(
    lineChart(
      [series("sensor.out", "°C", [5, 6])],
      START,
      END,
      undefined,
      text,
    ),
  );
  const svg = host.querySelector<SVGSVGElement>("svg")!;
  const box = svg.getBoundingClientRect();
  const width = svg.viewBox.baseVal.width;
  const at = lineChartTimeAt(
    { clientX: box.left + ((44 + (width - 56) / 2) / width) * box.width },
    svg,
    START,
    END,
    false,
  );
  expect(Math.abs(at - (START + 12 * HOUR))).toBeLessThan(HOUR / 10);

  const lanes = [
    {
      kind: "lock",
      entityId: "lock.front",
      marks: [
        [START, "locked"],
        [START + 6 * HOUR, undefined],
        [START + 8 * HOUR, "unlocked"],
      ] as Array<[number, string | undefined]>,
    },
  ];
  const t = draw(
    timeline(lanes, START, END, undefined, {
      time: () => "t",
      label: "Front door",
      lane: () => "Lock",
      tone: (_l, state) => (state === "locked" ? "ok" : "attention"),
      color: (_l, state) => (state === "unlocked" ? "rgb(1, 2, 3)" : undefined),
    }),
  );
  const bands = [...t.querySelectorAll(".band")];
  expect(bands.map((b) => b.getAttribute("class"))).toEqual([
    "band b-ok",
    "band b-gap",
    "band b-attention",
  ]);
  expect(bands[2].getAttribute("style")).toBe("--band: rgb(1, 2, 3)");
  expect(t.querySelector(".lane-label")!.textContent).toBe("Lock");
  const tl = t.querySelector<SVGSVGElement>("svg")!;
  const tb = tl.getBoundingClientRect();
  expect(timelineTimeAt({ clientX: tb.left - 50 }, tl, START, END)).toBe(START);
});

it("resolves Home Assistant state colours from the most specific theme variable", () => {
  const states = {
    "cover.gate": { state: "closed", attributes: { device_class: "gate" } },
  };
  expect(stateColor(states, "cover.gate", "closed", "red")).toBe(
    "var(--state-cover-gate-closed-color, var(--state-cover-closed-color, var(--state-cover-inactive-color, var(--state-inactive-color, red))))",
  );
  expect(stateColor(states, "lock.front", "unavailable", "grey")).toBe(
    "var(--state-unavailable-color, grey)",
  );
});
