export declare type ClockListener = (event: string, clock: ClockJS, data?: Array<any>) => void;
/**
 * Time units in seconds
 */
export declare enum InSeconds {
    Year = 31540000,
    Month = 2628000,
    Week = 604800,
    Day = 86400,
    Hour = 3600,
    Minute = 60,
    Second = 1
}
/**
 * Month names
 */
export declare enum Month {
    January = 0,
    February = 1,
    March = 2,
    April = 3,
    May = 4,
    June = 5,
    July = 6,
    August = 7,
    September = 8,
    October = 9,
    November = 10,
    December = 11
}
/**
 * Weekday names
 */
export declare enum Weekday {
    Sunday = 0,
    Monday = 1,
    Tuesday = 2,
    Wednesday = 3,
    Thursday = 4,
    Friday = 5,
    Saturday = 6
}
/**
 * ClockJS Core
 */
export declare class ClockJS {
    private _id;
    private _timeout;
    private _year;
    private _month;
    private _weekday;
    private _day;
    private _hours;
    private _minutes;
    private _seconds;
    private _milliseconds;
    private _timezone;
    private _timestamp;
    private _cache;
    private _speed;
    private _listeners;
    /**
     * Default constructor.
     */
    private constructor();
    /**
     * Return if clock is already started.
     * @return already started
     */
    alreadyStarted(): boolean;
    /**
     * Start ticking.
     * @param speed [OPTIONAL] Speed
     * @return ClockJS instance
     */
    start(speed?: number): ClockJS;
    /**
     * Manually tick.
     * @return ClockJS instance
     */
    tick(): ClockJS;
    /**
     * Stop ticking.
     * @return ClockJS instance
     */
    stop(): ClockJS;
    /**
     * Bind event handler.
     * @param events events separated by space
     * @param handler listener
     * @return ClockJS instance
     */
    on(events: string, handler: ClockListener): ClockJS;
    /**
     * Unbind event handler.
     * @param events events separated by space
     * @param handler listener (same as .on())
     * @return ClockJS instance
     */
    off(events?: string, handler?: ClockListener): ClockJS;
    /**
     * Trigger binded handlers.
     * @param event event name
     * @param data event data
     * @return ClockJS instance
     */
    trigger(event: string, data?: Array<any>): ClockJS;
    /**
     * Format date using string.
     * YYYY-MM-DD hh:mm:ss.u TZD (HH for 24 hours)
     * @param format format string
     * @return formated date
     */
    format(format: string): string;
    /**
     * Set date from timestamp.
     * @param timestamp timestamp in milliseconds
     */
    private setDateFromTimestamp;
    /**
     * Get listeners.
     * @param event event name
     * @return listeners
     */
    private getListeners;
    /**
     * Clear listeners.
     * @param event [OPTIONAL] event to be cleared
     * @return ClockJS instance
     */
    private clearListeners;
    /**
     * Return float part of time unit.
     * @param seconds time in seconds
     * @return float part
     */
    private remainder;
    /**
     * Return last day of a specific month.
     * @param month Month
     * @param year Year
     * @return last day of month
     */
    static lastDayOfMonth(month: Month, year: number): number;
    /**
     * Timestamp now.
     * @return timestamp in milliseconds
     */
    static timestampNow(): number;
    /**
     * Return instance from timestamp.
     * @param timestamp timestamp in milliseconds
     * @return ClockJS instance from timestamp
     */
    static fromTimestamp(timestamp: number): ClockJS;
    /**
     * Return instance from actual time.
     * @return ClockJS instance
     */
    static now(): ClockJS;
    /**
     * Pad with zeros.
     * @param num number
     * @param pads number of pads
     * @param right pad right?
     */
    private static pad;
    /**
     * Is set variable.
     * @param obj variable
     * @return if object is setted
     */
    private static isSet;
    readonly year: number;
    readonly yearFloat: number;
    readonly month: number;
    readonly monthFloat: number;
    readonly monthName: string;
    readonly weekday: number;
    readonly weekdayFloat: number;
    readonly weekdayName: string;
    readonly lastDayOfMonth: number;
    readonly day: number;
    readonly dayFloat: number;
    readonly hours: number;
    readonly hoursFloat: number;
    readonly minutes: number;
    readonly minutesFloat: number;
    readonly seconds: number;
    readonly secondsFloat: number;
    readonly milliseconds: number;
    readonly timezone: string;
    timestamp: number;
    readonly dateTime: string;
    speed: number;
    clockTick: number;
}
