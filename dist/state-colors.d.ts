import type { HistoryStates } from "./data";
/**
 * A state's color the way Home Assistant resolves it, as a CSS value: the most
 * specific theme variable that is set wins, e.g. for a locked lock
 * `--state-lock-locked-color`, then `--state-lock-inactive-color`, then
 * `--state-inactive-color`, and finally the card's own color. A theme that sets
 * any of these recolors the card.
 */
export declare function stateColor(states: HistoryStates, entityId: string, state: string, fallback: string): string;
//# sourceMappingURL=state-colors.d.ts.map