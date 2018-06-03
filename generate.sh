tsc target/clock.ts --alwaysStrict --target ES5 --outFile output/clock.js
uglifyjs --compress --mangle --output output/clock.min.js -- output/clock.js