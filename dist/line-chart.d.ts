import { type Series } from "./data";
/** Locale formatting the chart needs from its card. */
export interface ChartText {
    number: (value: number, digits: number) => string;
    time: (ms: number, withDay: boolean) => string;
    /** The chart's accessible name. */
    label: string;
}
export interface ChartOptions {
    /** Width of the drawing in px (the height is fixed); 600 by default. */
    width?: number;
    /**
     * The left scale's unit. By default temperatures go left when there are any,
     * else the first series' unit; a series in another unit gets the right scale.
     */
    leftUnit?: string;
    /** Translucent gradient under each line (default on). */
    fill?: boolean;
    /** Smooth lines through the readings without overshooting them (default off). */
    smooth?: boolean;
}
/** The left and right units of a chart; lanes have no scale. */
export declare function units(all: Series[], leftUnit?: string): [string, string | undefined];
/**
 * One chart of related readings: the left scale in the main unit, a right-hand
 * scale for a reading in another unit, dashed steps for setpoints and a lane per
 * on/off state below the plot. Unavailable spells are gaps.
 */
export declare function lineChart(all: Series[], start: number, end: number, hover: number | undefined, text: ChartText, options?: ChartOptions): import("lit-html").TemplateResult<2>;
/** The time under a pointer over a line chart. */
export declare function lineChartTimeAt(event: {
    clientX: number;
}, element: SVGSVGElement, start: number, end: number, twoScales: boolean): number;
//# sourceMappingURL=line-chart.d.ts.map