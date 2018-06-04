const {ClockJS} = require('../dist/module/clock');
const assert = require('assert');
assert.doesNotThrow(() => {
    let clock = ClockJS.now();
    clock.timestamp = clock.timestamp + 200;
}, 'Construction');

assert.doesNotThrow(() => {
    let clock = ClockJS.fromTimestamp(0);
    let format = clock.format('YYYYMMYYYDDhhHHmmmsssss.uduTZDTZDMONWEEKDAYWWMMMWWWMONTH');
    if (format !== '19691196931210900000000.0001000+03:00+03:00DecWednesday03DecWedDecember') {
        throw new Error('Format different of expected!');
    }
}, 'Format');