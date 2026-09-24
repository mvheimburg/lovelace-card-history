import { historyLocale } from "./strings";
/** Locale formatting for charts, following HA's language and 12/24-hour setting. */
export function historyFormat(hass) {
    const locale = historyLocale(hass);
    const format = hass?.locale?.time_format;
    const hour12 = format === "12" ? true : format === "24" ? false : undefined;
    const safe = (make, fallback) => {
        try {
            return make();
        }
        catch {
            return fallback;
        }
    };
    return {
        locale,
        /** A clock time, or a weekday and date on a multi-day axis. */
        time: (ms, withDay = false) => safe(() => new Intl.DateTimeFormat(locale, withDay
            ? { weekday: "short", day: "numeric" }
            : { hour: "2-digit", minute: "2-digit", hour12 }).format(ms), new Date(ms).toLocaleTimeString()),
        /** Day and time, for the readout above the legend on a multi-day range. */
        moment: (ms) => safe(() => new Intl.DateTimeFormat(locale, {
            weekday: "short",
            hour: "2-digit",
            minute: "2-digit",
            hour12,
        }).format(ms), new Date(ms).toLocaleString()),
        /** A fixed number of decimals, for axis ticks. */
        number: (value, digits) => safe(() => new Intl.NumberFormat(locale, {
            minimumFractionDigits: digits,
            maximumFractionDigits: digits,
        }).format(value), value.toFixed(digits)),
        /** A reading: up to `digits` decimals, and its unit. */
        reading: (value, unit = "", digits = 1) => `${safe(() => new Intl.NumberFormat(locale, { maximumFractionDigits: digits }).format(value), String(value))}${unit ? ` ${unit}` : ""}`,
        /** A range button's label: "6 h", "24 t", "7 d". */
        span: (hours) => safe(() => new Intl.NumberFormat(locale, {
            style: "unit",
            unit: hours < 48 ? "hour" : "day",
            unitDisplay: "short",
        }).format(hours < 48 ? hours : hours / 24), hours < 48 ? `${hours} h` : `${hours / 24} d`),
    };
}
