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
})(InSeconds || (InSeconds = {}));
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
})(Month || (Month = {}));
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
})(Weekday || (Weekday = {}));
/**
 * ClockJS Core
 */
var ClockJS = /** @class */ (function () {
    /**
     * Default constructor.
     */
    function ClockJS() {
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
    ClockJS.prototype.alreadyStarted = function () {
        return !!this._id;
    };
    /**
     * Start ticking.
     * @param speed [OPTIONAL] Speed
     * @return ClockJS instance
     */
    ClockJS.prototype.start = function (speed) {
        var _this = this;
        if (speed === void 0) { speed = this.speed; }
        if (this._id) {
            console.info('This clock is already started!');
            return this;
        }
        this._speed = speed;
        this._id = setInterval(function () { _this.tick(); }, this.clockTick);
        this.trigger('start');
        return this;
    };
    /**
     * Manually tick.
     * @return ClockJS instance
     */
    ClockJS.prototype.tick = function () {
        var old = new Date(this.timestamp);
        this.timestamp += this.speed * this.clockTick;
        this.trigger('ticking');
        var s = this.seconds === old.getSeconds(), m = this.minutes === old.getMinutes(), h = this.hours === old.getHours(), D = this.day === old.getDate(), M = this.month === old.getMonth(), Y = this.year === old.getFullYear();
        s && m && h && D && M && Y || this.trigger('second');
        m && h && D && M && Y || this.trigger('minute');
        h && D && M && Y || this.trigger('hour');
        D && M && Y || (this.trigger('day') && this.trigger('weekday'));
        M && Y || this.trigger('month');
        Y || this.trigger('year');
        return this;
    };
    /**
     * Stop ticking.
     * @return ClockJS instance
     */
    ClockJS.prototype.stop = function () {
        if (!this._id) {
            console.info('This clock is already stopped!');
            return this;
        }
        clearInterval(this._id);
        this._id = null;
        this.trigger('stop');
        return this;
    };
    /**
     * Bind event handler.
     * @param events events separated by space
     * @param handler listener
     * @return ClockJS instance
     */
    ClockJS.prototype.on = function (events, handler) {
        var _this = this;
        events.split(' ').forEach(function (event) {
            _this.getListeners(event).push(handler);
        });
        return this;
    };
    /**
     * Unbind event handler.
     * @param events events separated by space
     * @param handler listener (same as .on())
     * @return ClockJS instance
     */
    ClockJS.prototype.off = function (events, handler) {
        var _this = this;
        if (!events) {
            return this.clearListeners();
        }
        events.split(' ').forEach(function (event) {
            var listeners = _this.getListeners(event);
            if (!handler) {
                _this.clearListeners(event);
                return;
            }
            var indexOf = listeners.indexOf(handler);
            if (indexOf >= 0) {
                _this.getListeners(event).splice(indexOf, 1);
            }
        });
        return this;
    };
    /**
     * Trigger binded handlers.
     * @param event event name
     * @param data event data
     * @return ClockJS instance
     */
    ClockJS.prototype.trigger = function (event, data) {
        var _this = this;
        if (data === void 0) { data = []; }
        data.unshift(event, this);
        this.getListeners(event).forEach(function (handler) { return handler.apply(_this, data); });
        return this;
    };
    /**
     * Format date using string.
     * YYYY-MM-DD hh:mm:ss.u TZD (HH for 24 hours)
     * @param format format string
     * @return formated date
     */
    ClockJS.prototype.format = function (format) {
        var _this = this;
        return format.replace(/MONTH|MON|WEEKDAY|([usmhHdDwWMyY])\1*|TZD/g, function (type) {
            var ch = type.charAt(0), length = type.length;
            if (ch.toUpperCase() === 'Y') {
                return ClockJS.pad(_this.year, length);
            }
            if (ch === 'M') {
                if (length < 3) {
                    return ClockJS.pad(_this.month, length);
                }
                if (length > 3) {
                    return _this.monthName;
                }
                return _this.monthName.substr(0, 3);
            }
            if (ch.toUpperCase() === 'W') {
                if (length < 3) {
                    return ClockJS.pad(_this.weekday, length);
                }
                if (length > 3) {
                    return _this.weekdayName;
                }
                return _this.weekdayName.substr(0, 3);
            }
            if (ch.toUpperCase() === 'D') {
                return ClockJS.pad(_this.day, length);
            }
            if (ch === 'H') {
                return ClockJS.pad(_this.hours % 12, length);
            }
            if (ch === 'h') {
                return ClockJS.pad(_this.hours, length);
            }
            if (ch === 'm') {
                return ClockJS.pad(_this.minutes, length);
            }
            if (ch === 's') {
                return ClockJS.pad(_this.seconds, length);
            }
            if (ch === 'u') {
                return ClockJS.pad(_this.milliseconds / 10, 3, true);
            }
            return _this.timezone;
        });
    };
    /**
     * Set date from timestamp.
     * @param timestamp timestamp in milliseconds
     */
    ClockJS.prototype.setDateFromTimestamp = function (timestamp) {
        var date = new Date(timestamp);
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
    };
    /**
     * Get listeners.
     * @param event event name
     * @return listeners
     */
    ClockJS.prototype.getListeners = function (event) {
        if (ClockJS.isSet(this._listeners[event])) {
            return this._listeners[event];
        }
        return this._listeners[event] = [];
    };
    /**
     * Clear listeners.
     * @param event [OPTIONAL] event to be cleared
     * @return ClockJS instance
     */
    ClockJS.prototype.clearListeners = function (event) {
        if (event) {
            this._listeners[event] = [];
        }
        else {
            this._listeners = [];
        }
        return this;
    };
    /**
     * Return float part of time unit.
     * @param seconds time in seconds
     * @return float part
     */
    ClockJS.prototype.remainder = function (seconds) {
        return (this.timestamp / (seconds * 1000)) % 1;
    };
    /* *** STATIC METHODS *** */
    /**
     * Return last day of a specific month.
     * @param month Month
     * @param year Year
     * @return last day of month
     */
    ClockJS.lastDayOfMonth = function (month, year) {
        return new Date(year, month + 1, 0).getDate();
    };
    /**
     * Timestamp now.
     * @return timestamp in milliseconds
     */
    ClockJS.timestampNow = function () {
        return Date.now();
    };
    /**
     * Return instance from timestamp.
     * @param timestamp timestamp in milliseconds
     * @return ClockJS instance from timestamp
     */
    ClockJS.fromTimestamp = function (timestamp) {
        var clock = new ClockJS();
        clock.setDateFromTimestamp(timestamp);
        return clock;
    };
    /**
     * Return instance from actual time.
     * @return ClockJS instance
     */
    ClockJS.now = function () {
        return ClockJS.fromTimestamp(ClockJS.timestampNow());
    };
    /**
     * Pad with zeros.
     * @param num number
     * @param pads number of pads
     * @param right pad right?
     */
    ClockJS.pad = function (num, pads, right) {
        if (right === void 0) { right = false; }
        if (!num && num != 0) {
            return ClockJS.pad(0, pads, right);
        }
        var zeros = '';
        num = parseInt(num);
        for (var i = 0; i < pads; i++) {
            zeros += '0';
        }
        if (right) {
            return (num + zeros).slice(0, pads);
        }
        return (zeros + num).slice(pads * -1);
    };
    /**
     * Is set variable.
     * @param obj variable
     * @return if object is setted
     */
    ClockJS.isSet = function (obj) {
        return obj !== void 0;
    };
    Object.defineProperty(ClockJS.prototype, "year", {
        /* *** GETTERS & SETTERS *** */
        get: function () {
            return this._year;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClockJS.prototype, "yearFloat", {
        get: function () {
            return this._year + (this.monthFloat / 12);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClockJS.prototype, "month", {
        get: function () {
            return this._month;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClockJS.prototype, "monthFloat", {
        get: function () {
            return this._month + (this.dayFloat / this.lastDayOfMonth);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClockJS.prototype, "monthName", {
        get: function () {
            return Month[this._month];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClockJS.prototype, "weekday", {
        get: function () {
            return this._weekday;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClockJS.prototype, "weekdayFloat", {
        get: function () {
            return this._weekday + (this.hoursFloat / 24);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClockJS.prototype, "weekdayName", {
        get: function () {
            return Weekday[this._weekday];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClockJS.prototype, "lastDayOfMonth", {
        get: function () {
            var c = this._cache.lastDayOfMonth;
            if (!c || c[0] !== this.month || c[1] !== this.year) {
                c = [
                    this.month,
                    this.year,
                    ClockJS.lastDayOfMonth(this.month, this.year)
                ];
            }
            return c[2];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClockJS.prototype, "day", {
        get: function () {
            return this._day;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClockJS.prototype, "dayFloat", {
        get: function () {
            return this._day + (this.hoursFloat / 24);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClockJS.prototype, "hours", {
        get: function () {
            return this._hours;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClockJS.prototype, "hoursFloat", {
        get: function () {
            return this._hours + (this.minutesFloat / 60);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClockJS.prototype, "minutes", {
        get: function () {
            return this._minutes;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClockJS.prototype, "minutesFloat", {
        get: function () {
            return this._minutes + (this.secondsFloat / 60);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClockJS.prototype, "seconds", {
        get: function () {
            return this._seconds;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClockJS.prototype, "secondsFloat", {
        get: function () {
            return this._seconds + this.remainder(InSeconds.Second); // Second in seconds :D
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClockJS.prototype, "milliseconds", {
        get: function () {
            return this._milliseconds;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClockJS.prototype, "timezone", {
        get: function () {
            var tzd = this._timezone, signal = '', hours, minutes;
            if (tzd === 0) {
                return 'Z';
            }
            if (tzd > 0) {
                signal = '+';
            }
            hours = ClockJS.pad(tzd / 60, 2);
            minutes = ClockJS.pad(tzd % 60, 2);
            return "" + signal + hours + ":" + minutes;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClockJS.prototype, "timestamp", {
        get: function () {
            return this._timestamp;
        },
        set: function (v) {
            this.setDateFromTimestamp(v);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClockJS.prototype, "dateTime", {
        get: function () {
            return this.format('YYYY-MM-DDThh:mm:ss.uTZD');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClockJS.prototype, "speed", {
        get: function () {
            return this._speed;
        },
        set: function (v) {
            if (v > 59) {
                console.warn('The speed defines how many seconds will be advanced when ' +
                    'the clock ticks. For performance questions, numbers above ' +
                    '59 will not call more than one event per tick.');
            }
            this._speed = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClockJS.prototype, "clockTick", {
        get: function () {
            return this._timeout;
        },
        set: function (v) {
            if (v < 20 || v > 1000) {
                console.warn('Because the interval proccess and the clock seconds, the ' +
                    'tick is recommended to be between 20 and 1000 milliseconds. ' +
                    'Values less than 20, may cause performance problem with "ticking" events');
            }
            var started = this.alreadyStarted();
            started && this.stop();
            this._timeout = v;
            started && this.start();
        },
        enumerable: true,
        configurable: true
    });
    return ClockJS;
}());
