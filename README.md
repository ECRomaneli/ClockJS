<div style="text-align:center; position: relative; width: 100%;">
<img src="https://s33.postimg.cc/4y7d4s7jj/clockjs.png" alt='logo' /><br/>
A lightweight framework that simulates a clock and allows you to use listeners<p/>
<img src="https://img.shields.io/npm/v/@ecromaneli/clockjs.svg" alt="module version">&nbsp;
<img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="GitHub license">&nbsp;
<img src="https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat" alt="contributions welcome">
</div>



## Install

```
npm i @ecromaneli/clockjs
```

## Constructors

### Import script
To use ClockJS, import script with this code:

```typescript
const {ClockJS} = require('@ecromaneli/clockjs')
```

### Now
To get instance of ClockJS with actual date, use:
```typescript
ClockJS.now(): ClockJS
```

### From timestamp
To get instance of ClockJS with timestamp in milliseconds (like Date.now()), use:
```typescript
ClockJS.fromTimestamp(timestamp: number): ClockJS
```

## Public Methods
- `start(): void` start ticking;
- `stop(): void` stop ticking;
- `alreadyStarted(): boolean` return if clock is already started;
- `tick(): void` manually tick.

## Events
- `ticking` on clock tick;
- `year` on year change;
- `month` on month change;
- `day` on day change;
- `hour` on hour change;
- `minute` on minute change;
- `second` on second change.

### Bind and Unbind handlers
```typescript
.on (events: string, handler: (event: string, clock: ClockJS) => void)
.off(events: string, handler: (event: string, clock: ClockJS) => void)
```

## Format date
You can format the clock time any way you want by using a string with:
- `Y` year, 1 - 4 digits;
- `M` month number, 1 or 2 digits;
- `W` weekday number, 1 or 2 digits;
- `D` day, 1 or 2 digits;
- `H` hours (24 hours), 1 or 2 digits;
- `h` hours, 1 or 2 digits;
- `m` minutes, 1 or 2 digits;
- `s` seconds, 1 or 2 digits;
- `u` milliseconds in seconds, 1 digit (.000);
- `TZD` timezone, [+-]HH:mm or Z;
- `MMM` or `MON` month abbrev. (Jan, Feb, Mar...);
- `MONTH` month name (January, February...);
- `WWW` weekday abbrev. (Mon, Tue, Wed...);
- `WEEKDAY` weekday name (Monday, Tuesday...).

The function:
```typescript
    // Print something like 2018 Jun 04, 15:49:32.770
    .format('YYYY MON DD, hh:mm:ss.u')
```

### For example:
The ISO 8601 format is: `2018-06-04T05:57:23.557Z`.
```typescript
    // ISO 8601
    clock.format('YYYY-MM-DDThh:mm:ss.uTZD')
```

## Usage Example
```typescript
const {ClockJS} = require('@ecromaneli/clockjs')
let clock = ClockJS.now()

let handler = (event, clock) => {
    console.log(clock.format('YYYY-MM-DD hh:mm:ss'))
};

// Start clock (now, clock ticking)
clock.start()

// Bind handler on year, day and second change
clock.on('year day second', handler)

// Unbind handler on year and day change
clock.off('year day', handler)

// Stop clock
clock.stop()
```
> **Obs.:** You don't need start the clock to use date information or .format() method. You need start, to use listeners.

## Getters (ES5 Format)
### Year
- `year: number` current year;
- `yearFloat: number` year float value.
### Month
- `month: number` current month (0 - 11);
- `monthFloat: number` month float value;
- `monthName: string` english month name.
### Week
- `weekday: number` current weekday (0 - 6);
- `weekdayFloat: number` weekday float value;
- `weekdayName: string` english weekday name.
### Day
- `lastDayOfMonth: number` last day of current month;
- `day: number` current day;
- `dayFloat: number` day float value.
### Hours
- `hours: number` current hours;
- `hoursFloat: number` hours float value.
### Minutes
- `minutes: number` current minutes;
- `minutesFloat: number` minutes float value.
### Seconds
- `seconds: number` current seconds;
- `secondsFloat: number` seconds float value.
### Milliseconds
- `milliseconds: number` milliseconds.
### Others
- `dateTime: string` string of current time in DateTime format;
- `timezone: string` current timezone. ( [+-]hh:mm|Z )

## Getters & Setters (ES5 Format)
- `speed: number` clock speed [0 - 59] (default: 1);
- `timestamp: number` current timestamp;
- `clockTick: number` current clocktick time in ms [10 - 1000].

## Example

```javascript
let clock = ClockJS.fromTimestamp(0);
console.log(clock.timestamp); // GET (print 0)
clock.timestamp = Date.now(); // SET (update actual timestamp)
```

## Author

- Created and maintained by [Emerson C. Romaneli](https://github.com/ECRomaneli) (@ECRomaneli).

## License

[MIT License](https://github.com/ECRomaneli/ClockJS/blob/master/LICENSE.md)