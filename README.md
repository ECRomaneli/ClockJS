# ClockJS
A lightweight framework that simulates a clock and allows you to use listeners.

## Constructors

### Now
```typescript
ClockJS.now(): ClockJS
```

### From timestamp
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
.on(events: string, handler: (event: string, clock: ClockJS) => void);
.off(events: string, handler: Function) => void);
```

## Usage Example
```typescript
let clock = ClockJS.now();
let handler = (event, clock) => {
    console.log(clock.format("YYYY-MM-DD hh:mm:ss"));
};

// Start clock
clock.start();

// Bind handler on year, day and second change
clock.on("year day second", handler);

// Unbind handler on year and day change
clock.off("year day", handler);

// Stop clock
clock.stop();
```


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
### Others
- `timestamp: number` current timestamp;
- `speed: number` return current milliseconds.

## Getters & Setters (ES5 Format)
- `speed: number` clock speed [0-59] (default: 1);
- `timestamp: number` current timestamp;
- `clockTick: number` current clocktick time in ms [10-1000].

## Example

```javascript
let clock = ClockJS.fromTimestamp(0);
console.log(clock.timestamp); // GET (print 0)
clock.timestamp = Date.now(); // SET (update actual timestamp)
```

## Author

- Created and maintained by [Emerson C. Romaneli](https://github.com/ECRomaneli) (@ECRomaneli).

## License

[MIT License](https://github.com/laradock/laradock/blob/master/LICENSE)