import { expect, it, vi } from "vitest";
import {
  historyConnection,
  isMeasurement,
  loadLanes,
  loadSeries,
  onOff,
  stateAt,
  valueAt,
  type HistoryConnection,
} from "../src/data";
import { ticks } from "../src/ticks";

const HOUR = 3_600_000;
const NOW = Date.UTC(2026, 8, 24, 12);
const s = (ms: number) => ms / 1000;

function connection(reply: (m: Record<string, unknown>) => unknown) {
  const send = vi.fn(async (m: Record<string, unknown>) => reply(m));
  return {
    send,
    connection: { sendMessagePromise: send } as unknown as HistoryConnection,
  };
}
const temperature = (state: string, extra: Record<string, unknown> = {}) => ({
  state,
  attributes: {
    unit_of_measurement: "°C",
    state_class: "measurement",
    ...extra,
  },
});

it("loads lines with gaps and the current state, deduplicating entities", async () => {
  const { send, connection: c } = connection(() => ({
    "sensor.out": [
      { s: "5", lu: s(NOW - 30 * HOUR) },
      { s: "unavailable", lu: s(NOW - 12 * HOUR) },
      { s: "8", lu: s(NOW - 8 * HOUR) },
    ],
  }));
  const [series, again] = await loadSeries(
    c,
    [
      { entityId: "sensor.out", color: 0 },
      { entityId: "sensor.out", color: 1 },
    ],
    { "sensor.out": temperature("9.5") },
    24,
    { now: NOW },
  );
  expect(send).toHaveBeenCalledTimes(1);
  expect(send.mock.calls[0][0]).toMatchObject({
    type: "history/history_during_period",
    entity_ids: ["sensor.out"],
    minimal_response: true,
    no_attributes: true,
    significant_changes_only: false,
    start_time: new Date(NOW - 24 * HOUR).toISOString(),
  });
  // A row from before the window starts at the window.
  expect(series.points).toEqual([
    [NOW - 24 * HOUR, 5],
    [NOW - 12 * HOUR, undefined],
    [NOW - 8 * HOUR, 8],
    [NOW, 9.5],
  ]);
  expect(series.unit).toBe("°C");
  expect(again.color).toBe(1);
  expect(valueAt(series, NOW - 10 * HOUR)).toBeUndefined();
  expect(valueAt(series, NOW - 1 * HOUR)).toBe(8);
});

it("reads a week of a measurement from hourly statistics, and a gap where hours are missing", async () => {
  const { send, connection: c } = connection((m) =>
    m.type === "recorder/statistics_during_period"
      ? {
          "sensor.out": [
            { start: NOW - 100 * HOUR, mean: 4.25 },
            { start: NOW - 99 * HOUR, mean: 4.5 },
            { start: NOW - 90 * HOUR, mean: 6 },
          ],
        }
      : { "sensor.door": [{ s: "off", lu: s(NOW - 50 * HOUR) }] },
  );
  const [out, door] = await loadSeries(
    c,
    [
      { entityId: "sensor.out", color: 0 },
      { entityId: "sensor.door", color: 1, kind: "lane" },
    ],
    {
      "sensor.out": temperature("7"),
      "sensor.door": { state: "on", attributes: {} },
    },
    168,
    { now: NOW },
  );
  const types = send.mock.calls.map((call) => call[0].type);
  expect(types).toContain("recorder/statistics_during_period");
  expect(
    send.mock.calls.find(
      (c) => c[0].type === "recorder/statistics_during_period",
    )![0],
  ).toMatchObject({
    statistic_ids: ["sensor.out"],
    period: "hour",
  });
  expect(out.points).toEqual([
    [NOW - 100 * HOUR, 4.25],
    [NOW - 99 * HOUR, 4.5],
    [NOW - 98 * HOUR, undefined],
    [NOW - 90 * HOUR, 6],
    [NOW, 7],
  ]);
  // A lane always comes from its raw states, as on/off.
  expect(door.points).toEqual([
    [NOW - 50 * HOUR, 0],
    [NOW, 1],
  ]);
  expect(stateAt(door, NOW)).toBe("on");
});

it("reads an attribute's history, carrying attributes a row leaves out", async () => {
  const { send, connection: c } = connection(() => ({
    "climate.room": [
      { s: "heat", a: { current_temperature: 20.5 }, lu: s(NOW - 5 * HOUR) },
      { s: "heat", lu: s(NOW - 4 * HOUR) },
      { s: "unavailable", a: {}, lu: s(NOW - 3 * HOUR) },
    ],
  }));
  const [room] = await loadSeries(
    c,
    [
      {
        entityId: "climate.room",
        color: 0,
        attribute: "current_temperature",
        unit: "°C",
      },
    ],
    {
      "climate.room": {
        state: "heat",
        attributes: { current_temperature: 21 },
      },
    },
    6,
    { now: NOW },
  );
  expect(send.mock.calls[0][0]).toMatchObject({
    minimal_response: false,
    no_attributes: false,
  });
  expect(room.unit).toBe("°C");
  expect(room.points.map(([, v]) => v)).toEqual([20.5, 20.5, undefined, 21]);
});

it("loads timeline lanes with silent spells as gaps", async () => {
  const { connection: c } = connection(() => ({
    "lock.front": [
      { s: "locked", lu: s(NOW - 5 * HOUR) },
      { s: "unknown", lu: s(NOW - 4 * HOUR) },
    ],
  }));
  const [lane] = await loadLanes(
    c,
    [{ kind: "lock", entityId: "lock.front" }],
    { "lock.front": { state: "unlocked", attributes: {} } },
    6,
    { now: NOW },
  );
  expect(lane.marks).toEqual([
    [NOW - 5 * HOUR, "locked"],
    [NOW - 4 * HOUR, undefined],
    [NOW, "unlocked"],
  ]);
});

it("sends through callWS when Home Assistant has it, else the connection", async () => {
  const callWS = vi.fn(async () => ({ ok: 1 })) as never;
  const sendMessagePromise = vi.fn(async () => ({ ok: 2 })) as never;
  expect(
    await historyConnection({
      callWS,
      connection: { sendMessagePromise },
    }).sendMessagePromise({ type: "x" }),
  ).toEqual({ ok: 1 });
  expect(
    await historyConnection({
      connection: { sendMessagePromise },
    }).sendMessagePromise({ type: "x" }),
  ).toEqual({ ok: 2 });
  await expect(
    historyConnection({}).sendMessagePromise({ type: "x" }),
  ).rejects.toThrow();
});

it("tells measurements, on/off states and ticks apart", () => {
  expect(
    isMeasurement({ state: "4", attributes: { unit_of_measurement: "°C" } }),
  ).toBe(true);
  expect(
    isMeasurement({
      state: "unavailable",
      attributes: { state_class: "measurement" },
    }),
  ).toBe(true);
  expect(
    isMeasurement({
      state: "2026-01-01",
      attributes: { device_class: "timestamp", unit_of_measurement: "x" },
    }),
  ).toBe(false);
  expect(isMeasurement({ state: "low", attributes: {} })).toBe(false);
  expect([
    onOff("on"),
    onOff("open"),
    onOff("off"),
    onOff("unavailable"),
  ]).toEqual([1, 1, 0, undefined]);
  expect(ticks(4.2, 12.9)).toEqual([2.5, 5, 7.5, 10, 12.5, 15]);
  expect(ticks(55, 60)).toEqual([54, 56, 58, 60]);
});
