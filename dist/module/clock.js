"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Time units in seconds
 */
var InSeconds;
(function (InSeconds) {
    InSeconds[InSeconds["Year"] = 31540000] = "Year";
    InSeconds[InSeconds["Month"] = 2628000] = "Month";
    InSeconds[InSeconds["Week"] = 604800] = "Week";
    InSeconds[InSeconds["Day"] = 86400] = "Day";
    InSeconds[InSeconds["Hour"] = 3600] = "Hour";
    InSeconds[InSeconds["Minute"] = 60] = "Minute";
    InSeconds[InSeconds["Second"] = 1] = "Second";
})(InSeconds = exports.InSeconds || (exports.InSeconds = {}));
/**
 * Month names
 */
var Month;
(function (Month) {
    Month[Month["January"] = 0] = "January";
    Month[Month["February"] = 1] = "February";
    Month[Month["March"] = 2] = "March";
    Month[Month["April"] = 3] = "April";
    Month[Month["May"] = 4] = "May";
    Month[Month["June"] = 5] = "June";
    Month[Month["July"] = 6] = "July";
    Month[Month["August"] = 7] = "August";
    Month[Month["September"] = 8] = "September";
    Month[Month["October"] = 9] = "October";
    Month[Month["November"] = 10] = "November";
    Month[Month["December"] = 11] = "December";
})(Month = exports.Month || (exports.Month = {}));
/**
 * Weekday names
 */
var Weekday;
(function (Weekday) {
    Weekday[Weekday["Sunday"] = 0] = "Sunday";
    Weekday[Weekday["Monday"] = 1] = "Monday";
    Weekday[Weekday["Tuesday"] = 2] = "Tuesday";
    Weekday[Weekday["Wednesday"] = 3] = "Wednesday";
    Weekday[Weekday["Thursday"] = 4] = "Thursday";
    Weekday[Weekday["Friday"] = 5] = "Friday";
    Weekday[Weekday["Saturday"] = 6] = "Saturday";
})(Weekday = exports.Weekday || (exports.Weekday = {}));
/**
 * ClockJS Core
 */
class ClockJS {
    /**
     * Default constructor.
     */
    constructor() {
        // INTERVAL PROPERTIES
        this._id = null;
        this._timeout = 50;
        // CLOCK PROPERTIES
        this._year = -1;
        this._month = -1;
        this._weekday = -1;
        this._day = -1;
        this._hours = -1;
        this._minutes = -1;
        this._seconds = -1;
        this._milliseconds = -1;
        this._timezone = -1;
        this._timestamp = -1;
        this._cache = { lastDayOfMonth: [] };
        // CLOCK SETTINGS
        this._speed = 1;
        // HANDLERS
        this._listeners = [];
    }
    /**
     * Return if clock is already started.
     * @return already started
     */
    alreadyStarted() {
        return !!this._id;
    }
    /**
     * Start ticking.
     * @param speed [OPTIONAL] Speed
     * @return ClockJS instance
     */
    start(speed = this.speed) {
        let context = this;
        if (this._id) {
            console.info('This clock is already started!');
            return this;
        }
        this._speed = speed;
        this._id = setInterval(() => { this.tick(); }, this.clockTick);
        this.trigger('start');
        return this;
    }
    /**
     * Manually tick.
     * @return ClockJS instance
     */
    tick() {
        let old = new Date(this.timestamp);
        this.timestamp += this.speed * this.clockTick;
        this.trigger('ticking');
        let s = this.seconds === old.getSeconds(), m = this.minutes === old.getMinutes(), h = this.hours === old.getHours(), D = this.day === old.getDate(), W = this.weekday === old.getDay(), M = this.month === old.getMonth(), Y = this.year === old.getFullYear();
        s && m && h && D && W && M && Y || this.trigger('second');
        m && h && D && W && M && Y || this.trigger('minute');
        h && D && W && M && Y || this.trigger('hour');
        D && W && M && Y || this.trigger('day');
        W && M && Y || this.trigger('weekday');
        M && Y || this.trigger('month');
        Y || this.trigger('year');
        return this;
    }
    /**
     * Stop ticking.
     * @return ClockJS instance
     */
    stop() {
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
    on(events, handler) {
        events.split(' ').forEach((event) => {
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
    off(events, handler) {
        if (!events) {
            return this.clearListeners();
        }
        events.split(' ').forEach((event) => {
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
    trigger(event, data = []) {
        data.unshift(event, this);
        this.getListeners(event).forEach((handler) => handler.apply(this, data));
        return this;
    }
    /**
     * Format date using string.
     * YYYY-MM-DD hh:mm:ss.u TZD (HH for 24 hours)
     * @param format format string
     * @return formated date
     */
    format(format) {
        return format.replace(/MONTH|MON|WEEKDAY|([usmhHdDwWMyY])\1*|TZD/g, (type) => {
            let ch = type.charAt(0), length = type.length;
            if (ch.toUpperCase() === 'Y') {
                return ClockJS.pad(this.year, length);
            }
            if (ch === 'M') {
                if (length < 3) {
                    return ClockJS.pad(this.month, length);
                }
                if (length > 3) {
                    return this.monthName;
                }
                return this.monthName.substr(0, 3);
            }
            if (ch.toUpperCase() === 'W') {
                if (length < 3) {
                    return ClockJS.pad(this.weekday, length);
                }
                if (length > 3) {
                    return this.weekdayName;
                }
                return this.weekdayName.substr(0, 3);
            }
            if (ch.toUpperCase() === 'D') {
                return ClockJS.pad(this.day, length);
            }
            if (ch === 'H') {
                return ClockJS.pad(this.hours % 12, length);
            }
            if (ch === 'h') {
                return ClockJS.pad(this.hours, length);
            }
            if (ch === 'm') {
                return ClockJS.pad(this.minutes, length);
            }
            if (ch === 's') {
                return ClockJS.pad(this.seconds, length);
            }
            if (ch === 'u') {
                return ClockJS.pad(this.milliseconds / 10, 3, true);
            }
            return this.timezone;
        });
    }
    /**
     * Set date from timestamp.
     * @param timestamp timestamp in milliseconds
     */
    setDateFromTimestamp(timestamp) {
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
    getListeners(event) {
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
    clearListeners(event) {
        if (event) {
            this._listeners[event] = [];
        }
        else {
            this._listeners = [];
        }
        return this;
    }
    /**
     * Return float part of time unit.
     * @param seconds time in seconds
     * @return float part
     */
    remainder(seconds) {
        return (this.timestamp / (seconds * 1000)) % 1;
    }
    /* *** STATIC METHODS *** */
    /**
     * Return last day of a specific month.
     * @param month Month
     * @param year Year
     * @return last day of month
     */
    static lastDayOfMonth(month, year) {
        return new Date(year, month + 1, 0).getDate();
    }
    /**
     * Timestamp now.
     * @return timestamp in milliseconds
     */
    static timestampNow() {
        return Date.now();
    }
    /**
     * Return instance from timestamp.
     * @param timestamp timestamp in milliseconds
     * @return ClockJS instance from timestamp
     */
    static fromTimestamp(timestamp) {
        let clock = new ClockJS();
        clock.setDateFromTimestamp(timestamp);
        return clock;
    }
    /**
     * Return instance from actual time.
     * @return ClockJS instance
     */
    static now() {
        return ClockJS.fromTimestamp(ClockJS.timestampNow());
    }
    /**
     * Pad with zeros.
     * @param num number
     * @param pads number of pads
     * @param right pad right?
     */
    static pad(num, pads, right = false) {
        if (!num && num != 0) {
            return ClockJS.pad(0, pads, right);
        }
        let zeros = '';
        num = parseInt(num);
        for (let i = 0; i < pads; i++) {
            zeros += '0';
        }
        if (right) {
            return (num + zeros).slice(0, pads);
        }
        return (zeros + num).slice(pads * -1);
    }
    /**
     * Is set variable.
     * @param obj variable
     * @return if object is setted
     */
    static isSet(obj) {
        return obj !== undefined;
    }
    /* *** GETTERS & SETTERS *** */
    get year() {
        return this._year;
    }
    get yearFloat() {
        return this._year + (this.monthFloat / 12);
    }
    get month() {
        return this._month;
    }
    get monthFloat() {
        return this._month + (this.dayFloat / this.lastDayOfMonth);
    }
    get monthName() {
        return Month[this._month];
    }
    get weekday() {
        return this._weekday;
    }
    get weekdayFloat() {
        return this._weekday + (this.hoursFloat / 24);
    }
    get weekdayName() {
        return Weekday[this._weekday];
    }
    get lastDayOfMonth() {
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
    get day() {
        return this._day;
    }
    get dayFloat() {
        return this._day + (this.hoursFloat / 24);
    }
    get hours() {
        return this._hours;
    }
    get hoursFloat() {
        return this._hours + (this.minutesFloat / 60);
    }
    get minutes() {
        return this._minutes;
    }
    get minutesFloat() {
        return this._minutes + (this.secondsFloat / 60);
    }
    get seconds() {
        return this._seconds;
    }
    get secondsFloat() {
        return this._seconds + this.remainder(InSeconds.Second); // Second in seconds :D
    }
    get milliseconds() {
        return this._milliseconds;
    }
    get timezone() {
        let tzd = this._timezone, signal = '', hours, minutes;
        if (tzd === 0) {
            return 'Z';
        }
        if (tzd > 0) {
            signal = '+';
        }
        hours = ClockJS.pad(tzd / 60, 2);
        minutes = ClockJS.pad(tzd % 60, 2);
        return `${signal}${hours}:${minutes}`;
    }
    get timestamp() {
        return this._timestamp;
    }
    set timestamp(v) {
        this.setDateFromTimestamp(v);
    }
    get dateTime() {
        return this.format('YYYY-MM-DDThh:mm:ss.uTZD');
    }
    get speed() {
        return this._speed;
    }
    set speed(v) {
        if (v > 59) {
            console.warn('The speed defines how many seconds will be advanced when ' +
                'the clock ticks. For performance questions, numbers above ' +
                '59 will not call more than one event per tick.');
        }
        this._speed = v;
    }
    get clockTick() {
        return this._timeout;
    }
    set clockTick(v) {
        if (v < 20 || v > 1000) {
            console.warn('Because the interval proccess and the clock seconds, the ' +
                'tick is recommended to be between 20 and 1000 milliseconds. ' +
                'Values less than 20, may cause performance problem with "ticking" events');
        }
        let started = this.alreadyStarted();
        started && this.stop();
        this._timeout = v;
        started && this.start();
    }
}
exports.ClockJS = ClockJS;
