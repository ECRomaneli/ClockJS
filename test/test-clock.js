const {ClockJS} = require('../dist/clock');
const assert = require('assert');
assert.doesNotThrow(() => {
    let clock = ClockJS.now();
    clock.timestamp = clock.timestamp + 200;
}, 'Construction');