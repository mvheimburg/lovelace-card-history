import { historyStrings, type LanguageSource } from "./strings";

/**
 * Where a card shows history when a reading is tapped: its own chart
 * (`card`), Home Assistant's more-info dialog with its history graph
 * (`more-info`), or Home Assistant's History page (`panel`).
 */
export type HistoryMode = "card" | "more-info" | "panel";
export const HISTORY_MODES: readonly HistoryMode[] = [
  "card",
  "more-info",
  "panel",
];

/** A card config's `history` value as a mode; anything unknown is the card's own view. */
export function historyMode(value: unknown): HistoryMode {
  return HISTORY_MODES.includes(value as HistoryMode)
    ? (value as HistoryMode)
    : "card";
}

/** The choices for a card editor's history setting, in the user's language. */
export function historyModeOptions(hass?: LanguageSource) {
  const t = historyStrings(hass);
  return [
    { value: "card", label: t.modeCard },
    { value: "more-info", label: t.modeMoreInfo },
    { value: "panel", label: t.modePanel },
  ];
}

/** Home Assistant's History page for these entities over the last `hours`. */
export function historyPanelPath(
  entityIds: string[],
  hours: number,
  now = Date.now(),
) {
  const start = new Date(now - hours * 3_600_000).toISOString();
  return `/history?entity_id=${encodeURIComponent(entityIds.join(","))}&start_date=${encodeURIComponent(start)}`;
}

/**
 * Show Home Assistant's own history for `entityIds` (the tapped one first).
 * Returns false for `card`, where the card opens its own view instead.
 */
export function openHomeAssistantHistory(
  from: EventTarget,
  mode: HistoryMode,
  entityIds: string[],
  hours = 24,
): boolean {
  if (mode === "card" || !entityIds.length) return false;
  if (mode === "more-info") {
    from.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId: entityIds[0] },
        bubbles: true,
        composed: true,
      }),
    );
    return true;
  }
  window.history.pushState(null, "", historyPanelPath(entityIds, hours));
  window.dispatchEvent(
    new CustomEvent("location-changed", { detail: { replace: false } }),
  );
  return true;
}
