import { type LanguageSource } from "./strings";
/**
 * Where a card shows history when a reading is tapped: its own chart
 * (`card`), Home Assistant's more-info dialog with its history graph
 * (`more-info`), or Home Assistant's History page (`panel`).
 */
export type HistoryMode = "card" | "more-info" | "panel";
export declare const HISTORY_MODES: readonly HistoryMode[];
/** A card config's `history` value as a mode; anything unknown is the card's own view. */
export declare function historyMode(value: unknown): HistoryMode;
/** The choices for a card editor's history setting, in the user's language. */
export declare function historyModeOptions(hass?: LanguageSource): {
    value: string;
    label: string;
}[];
/** Home Assistant's History page for these entities over the last `hours`. */
export declare function historyPanelPath(entityIds: string[], hours: number, now?: number): string;
/**
 * Show Home Assistant's own history for `entityIds` (the tapped one first).
 * Returns false for `card`, where the card opens its own view instead.
 */
export declare function openHomeAssistantHistory(from: EventTarget, mode: HistoryMode, entityIds: string[], hours?: number): boolean;
//# sourceMappingURL=open.d.ts.map