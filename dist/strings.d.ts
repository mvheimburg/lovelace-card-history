/** The history view's own words, in English and Norwegian Bokmål. */
export interface LanguageSource {
    language?: string;
    locale?: {
        language?: string;
        time_format?: string;
    };
}
/** `nb` for Bokmål and its aliases (`nb-NO`, legacy `no`, `nn` → Bokmål), else `en`. */
export declare function historyLanguage(hass?: LanguageSource): "en" | "nb";
/**
 * The locale for dates and numbers, kept apart from the dictionary: `en-GB`
 * keeps its 24-hour clock, and Norwegian aliases format as Bokmål.
 */
export declare function historyLocale(hass?: LanguageSource): string;
declare const en: {
    history: string;
    inspect: string;
    showHistory: string;
    closeHistory: string;
    ranges: string;
    loading: string;
    empty: string;
    failed: string;
    retry: string;
    now: string;
    unavailable: string;
    on: string;
    off: string;
    target: string;
    mode: string;
    modeCard: string;
    modeMoreInfo: string;
    modePanel: string;
};
export type HistoryStrings = typeof en;
export declare function historyStrings(hass?: LanguageSource): HistoryStrings;
export {};
//# sourceMappingURL=strings.d.ts.map