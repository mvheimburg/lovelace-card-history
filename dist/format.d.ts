import { type LanguageSource } from "./strings";
/** Locale formatting for charts, following HA's language and 12/24-hour setting. */
export declare function historyFormat(hass?: LanguageSource): {
    locale: string;
    /** A clock time, or a weekday and date on a multi-day axis. */
    time: (ms: number, withDay?: boolean) => string;
    /** Day and time, for the readout above the legend on a multi-day range. */
    moment: (ms: number) => string;
    /** A fixed number of decimals, for axis ticks. */
    number: (value: number, digits: number) => string;
    /** A reading: up to `digits` decimals, and its unit. */
    reading: (value: number, unit?: string, digits?: number) => string;
    /** A range button's label: "6 h", "24 t", "7 d". */
    span: (hours: number) => string;
};
export type HistoryFormat = ReturnType<typeof historyFormat>;
//# sourceMappingURL=format.d.ts.map