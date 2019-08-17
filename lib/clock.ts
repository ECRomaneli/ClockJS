export type ClockListener = (event: string, clock: ClockJS, data?: any) => void;

/**
 * Time units in seconds
 */
export enum InSeconds {
    Year = 3.154e7,
    Month = 2.628e6,
    Week = 604800,
    Day = 86400,
    Hour = 3600,
    Minute = 60,
    Second = 1
}

/**
 * Month names
 */
export enum Month {
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
export enum Weekday {
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
export class ClockJS {
    // INTERVAL PROPERTIES
    private _id: any = null;
    private _timeout: number = 50;
    // CLOCK PROPERTIES
    private _year: number = -1;
    private _month: number = -1;
    private _weekday: number = -1;
    private _day: number = -1;
    private _hours: number = -1;
    private _minutes: number = -1;
    private _seconds: number = -1;
    private _milliseconds: number = -1;
    private _timezone: number = -1;
    private _timestamp: number = -1;
    private _cache = {lastDayOfMonth: <number[]>[]};
    // CLOCK SETTINGS
    private _speed: number = 1;
    // HANDLERS
    private _listeners: Array<Array<ClockListener>> = [];

    /**
     * Default constructor.
     */
    private constructor () {}

    /**
     * Return if clock is already started.
     * @return already started
     */
    public alreadyStarted(): boolean {
        return !!this._id;
    }

    /**
     * Start ticking.
     * @param speed [OPTIONAL] Speed
     * @return ClockJS instance
     */
    public start(speed: number = this.speed): ClockJS {
        if (this._id) {
            console.info('This clock is already started!');
            return this;
        }

        this._speed = speed;

        this._id = setInterval(() => {this.tick(); }, this.clockTick);
        this.trigger('start');
        return this;
    }

    /**
     * Manually tick.
     * @return ClockJS instance
     */
    public tick(): ClockJS {
        let old = new Date(this.timestamp);

        this.timestamp += this.speed * this.clockTick;
        this.trigger('ticking');

        let s = this.seconds === old.getSeconds(),
            m = this.minutes === old.getMinutes(),
            h = this.hours === old.getHours(),
            D = this.day === old.getDate(),
            M = this.month === old.getMonth(),
            Y = this.year === old.getFullYear();

        s&&m&&h&&D&&M&&Y || this.trigger('second');
        m&&h&&D&&M&&Y    || this.trigger('minute');
        h&&D&&M&&Y       || this.trigger('hour');
        D&&M&&Y          || (this.trigger('day') && this.trigger('weekday'));
        M&&Y             || this.trigger('month');
        Y                || this.trigger('year');

        return this;
    }

    /**
     * Stop ticking.
     * @return ClockJS instance
     */
    public stop(): ClockJS {
        if (!this._id) {
            console.info('This clock is already stopped!');
            return this;
        }

        clearInterval(this._id);
        this._id = null;
        this.trigger('stop');
        return this;
    }

    /**
     * Bind event handler.
     * @param events events separated by space
     * @param handler listener
     * @return ClockJS instance
     */
    public on(events: string, handler: ClockListener): ClockJS {
        events.split(' ').forEach((event: string) => {
            this.getListeners(event).push(handler);
        });
        return this;
    }

    /**
     * Unbind event handler.
     * @param events events separated by space
     * @param handler listener (same as .on())
     * @return ClockJS instance
     */
    public off(events?: string, handler?: ClockListener): ClockJS {
        if (!events) {return this.clearListeners(); }
        events.split(' ').forEach((event: string) => {
            let listeners = this.getListeners(event);
            if (!handler) {
                this.clearListeners(event);
                return;
            }
            let indexOf = listeners.indexOf(handler);
            if (indexOf >= 0) {
                this.getListeners(event).splice(indexOf, 1);
            }
        });
        return this;
    }

    /**
     * Trigger binded handlers.
     * @param event event name
     * @param data event data
     * @return ClockJS instance
     */
    public trigger(event: string, data: Array<any> = []): ClockJS {
        data.unshift(event, this);
        this.getListeners(event).forEach((handler: ClockListener) => handler.apply(this, data));
        return this;
    }

    /**
     * Format date using string.
     * YYYY-MM-DD hh:mm:ss.u TZD (HH for 24 hours)
     * @param format format string
     * @return formated date
     */
    public format(format: string): string {
        return format.replace(/MONTH|MON|WEEKDAY|([usmhHdDwWMyY])\1*|TZD/g, (type) => {
            let ch = type.charAt(0), length = type.length;

            if (ch.toUpperCase() === 'Y') {return ClockJS.pad(this.year, length); }
            if (ch === 'M') {
                if (length < 3) {return ClockJS.pad(this.month, length); }
                if (length > 3) {return this.monthName; }
                return this.monthName.substr(0, 3);
            }
            if (ch.toUpperCase() === 'W') {
                if (length < 3) {return ClockJS.pad(this.weekday, length); }
                if (length > 3) {return this.weekdayName; }
                return this.weekdayName.substr(0, 3);
            }
            if (ch.toUpperCase() === 'D') {return ClockJS.pad(this.day, length); }
            if (ch === 'H') {return ClockJS.pad(this.hours % 12, length); }
            if (ch === 'h') {return ClockJS.pad(this.hours, length); }
            if (ch === 'm') {return ClockJS.pad(this.minutes, length); }
            if (ch === 's') {return ClockJS.pad(this.seconds, length); }
            if (ch === 'u') {return ClockJS.pad(this.milliseconds / 10, 3, true); }

            return this.timezone;
        });
    }

    /**
     * Set date from timestamp.
     * @param timestamp timestamp in milliseconds
     */
    private setDateFromTimestamp(timestamp: number): void {
        let date = new Date(timestamp);
        this._year = date.getFullYear();
        this._month = date.getMonth();
        this._weekday = date.getDay();
        this._day = date.getDate();
        this._hours = date.getHours();
        this._minutes = date.getMinutes();
        this._seconds = date.getSeconds();
        this._milliseconds = date.getMilliseconds();
        this._timezone = date.getTimezoneOffset();
        this._timestamp = timestamp;
    }

    /**
     * Get listeners.
     * @param event event name
     * @return listeners
     */
    private getListeners(event: any): Array<ClockListener> {
        if (ClockJS.isSet(this._listeners[event])) {
            return this._listeners[event];
        }
        return this._listeners[event] = [];
    }

    /**
     * Clear listeners.
     * @param event [OPTIONAL] event to be cleared
     * @return ClockJS instance
     */
    private clearListeners(event?: any): ClockJS {
        if (event) {
            this._listeners[event] = [];
        } else {
            this._listeners = [];
        }
        return this;
    }

    /**
     * Return float part of time unit.
     * @param seconds time in seconds
     * @return float part
     */
    private remainder(seconds: InSeconds): number {
        return (this.timestamp / (seconds * 1000)) % 1;
    }

    /* *** STATIC METHODS *** */

    /**
     * Return last day of a specific month.
     * @param month Month
     * @param year Year
     * @return last day of month
     */
    public static lastDayOfMonth(month: Month, year: number): number {
        return new Date(year, month + 1, 0).getDate();
    }

    /**
     * Timestamp now.
     * @return timestamp in milliseconds
     */
    public static timestampNow(): number {
        return Date.now();
    }

    /**
     * Return instance from timestamp.
     * @param timestamp timestamp in milliseconds
     * @return ClockJS instance from timestamp
     */
    public static fromTimestamp(timestamp: number): ClockJS {
        let clock = new ClockJS();
        clock.setDateFromTimestamp(timestamp);
        return clock;
    }

    /**
     * Return instance from actual time.
     * @return ClockJS instance
     */
    public static now(): ClockJS {
        return ClockJS.fromTimestamp(ClockJS.timestampNow());
    }

    /**
     * Pad with zeros.
     * @param num number
     * @param pads number of pads
     * @param right pad right?
     */
    private static pad(num: any, pads: number, right: boolean = false): string {
        if (!num && num != 0) {return ClockJS.pad(0, pads, right); }
        let zeros = '';
        num = parseInt(num);
        for (let i = 0; i < pads; i++) {zeros += '0'}
        if (right) {return (num + zeros).slice(0, pads); }
        return (zeros + num).slice(pads * -1);
    }

    /**
     * Is set variable.
     * @param obj variable
     * @return if object is setted
     */
    private static isSet(obj: any): boolean {
        return obj !== void 0;
    }

    /* *** GETTERS & SETTERS *** */

    public get year() : number {
        return this._year;
    }

    public get yearFloat() : number {
        return this._year + (this.monthFloat / 12);
    }

    public get month() : number {
        return this._month;
    }

    public get monthFloat() : number {
        return this._month + (this.dayFloat / this.lastDayOfMonth);
    }

    public get monthName() : string {
        return Month[this._month];
    }

    public get weekday() : number {
        return this._weekday;
    }

    public get weekdayFloat() : number {
        return this._weekday + (this.hoursFloat / 24);
    }

    public get weekdayName() : string {
        return Weekday[this._weekday];
    }

    public get lastDayOfMonth() : number {
        let c = this._cache.lastDayOfMonth;
        if (!c || c[0] !== this.month || c[1] !== this.year) {
            c = [
                this.month, 
                this.year, 
                ClockJS.lastDayOfMonth(this.month, this.year)
            ];
        }
        return c[2];
    }

    public get day() : number {
        return this._day;
    }

    public get dayFloat() : number {
        return this._day + (this.hoursFloat / 24);
    }

    public get hours() : number {
        return this._hours;
    }

    public get hoursFloat() : number {
        return this._hours + (this.minutesFloat / 60);
    }

    public get minutes() : number {
        return this._minutes;
    }

    public get minutesFloat() : number {
        return this._minutes + (this.secondsFloat / 60);
    }

    public get seconds() : number {
        return this._seconds;
    }

    public get secondsFloat() : number {
        return this._seconds + this.remainder(InSeconds.Second); // Second in seconds :D
    }

    public get milliseconds() : number {
        return this._milliseconds;
    }

    public get timezone() : string {
        let tzd = this._timezone, signal = '', hours, minutes;
        if (tzd === 0) {return 'Z'; }

        if (tzd > 0) {signal = '+'; }
        hours = ClockJS.pad(tzd / 60, 2);
        minutes = ClockJS.pad(tzd % 60, 2);

        return `${signal}${hours}:${minutes}`;
    }

    public get timestamp() : number {
        return this._timestamp;
    }

    public set timestamp(v : number) {
        this.setDateFromTimestamp(v);
    }

    public get dateTime() : string {
        return this.format('YYYY-MM-DDThh:mm:ss.uTZD');
    }

    public get speed() : number {
        return this._speed;
    }

    public set speed(v : number) {
        if (v > 59) {
            console.warn(
                'The speed defines how many seconds will be advanced when ' +
                'the clock ticks. For performance questions, numbers above ' +
                '59 will not call more than one event per tick.'
            );
        }
        this._speed = v;
    }

    public get clockTick() : number {
        return this._timeout;
    }
    
    public set clockTick(v : number) {
        if (v < 20 || v > 1000) {
            console.warn(
                'Because the interval proccess and the clock seconds, the ' +
                'tick is recommended to be between 20 and 1000 milliseconds. ' +
                'Values less than 20, may cause performance problem with "ticking" events'
            );
        }
        let started = this.alreadyStarted();
        started && this.stop();
        this._timeout = v;
        started && this.start();
    }
    
}