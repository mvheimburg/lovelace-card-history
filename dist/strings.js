/** The history view's own words, in English and Norwegian Bokmål. */
/** `nb` for Bokmål and its aliases (`nb-NO`, legacy `no`, `nn` → Bokmål), else `en`. */
export function historyLanguage(hass) {
    const code = (hass?.language || hass?.locale?.language || "en")
        .toLowerCase()
        .replace(/_/g, "-")
        .split("-")[0];
    return ["nb", "no", "nn"].includes(code) ? "nb" : "en";
}
/**
 * The locale for dates and numbers, kept apart from the dictionary: `en-GB`
 * keeps its 24-hour clock, and Norwegian aliases format as Bokmål.
 */
export function historyLocale(hass) {
    const code = (hass?.language || hass?.locale?.language || "en")
        .toLowerCase()
        .replace(/_/g, "-")
        .replace(/^(no|nn)(?=-|$)/, "nb");
    try {
        return Intl.getCanonicalLocales(code)[0] || "en";
    }
    catch {
        return "en";
    }
}
const en = {
    history: "History",
    inspect: "Inspect time",
    showHistory: "Show history",
    closeHistory: "Close history",
    ranges: "History ranges",
    loading: "Loading history…",
    empty: "No history for this period.",
    failed: "Could not load history",
    retry: "Try again",
    now: "Now",
    unavailable: "Unavailable",
    on: "On",
    off: "Off",
    target: "target",
    mode: "History view",
    modeCard: "In the card",
    modeMoreInfo: "Home Assistant's details",
    modePanel: "Home Assistant's History page",
};
const nb = {
    history: "Historikk",
    inspect: "Undersøk tidspunkt",
    showHistory: "Vis historikk",
    closeHistory: "Lukk historikk",
    ranges: "Tidsrom",
    loading: "Henter historikk …",
    empty: "Ingen historikk for denne perioden.",
    failed: "Kunne ikke hente historikk",
    retry: "Prøv igjen",
    now: "Nå",
    unavailable: "Utilgjengelig",
    on: "På",
    off: "Av",
    target: "ønsket",
    mode: "Historikkvisning",
    modeCard: "I kortet",
    modeMoreInfo: "Home Assistants detaljer",
    modePanel: "Home Assistants historikkside",
};
export function historyStrings(hass) {
    return historyLanguage(hass) === "nb" ? nb : en;
}
