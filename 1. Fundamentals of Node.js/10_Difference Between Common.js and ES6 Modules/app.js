// const timer = require("./timer.js");
// import timer from "./timer.js";

// Common JS Modules //
// 1. Synchronous file loading
// 2. File extension optional
// 3. If we give full file path We can Load any file using cjs
// 4. It is convention to add cjs in the file extension
// 5. It is optional to set type "commonjs" in package.json because common js is the default module system of Node.js
// 6. In cjs this keyword points to module.exports by default
// 7. cjs imports are not hoisted
// 8. Top level await is not allowed
// 9. Only one value can be export in cjs
// 10. Strict Mode is not enabled by default

// ES6 Modules
// 1. Asynchronous file loading
// 2. File extension mandatory
// 3. We can not load any file, only js and mjs file are allowed.
// 4. It is a convention to add mjs in the file extension
// 5. We must set type="module" inside package.json
// 6. In mjs this keyword is undefined
// 7. mjs are imports are hoisted
// 8. Top level await is allowed
// 9. Multiple value can be export
// 10. Strict Mode is enabled by default
