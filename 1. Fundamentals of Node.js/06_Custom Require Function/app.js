const b = loadModule("./math.js");

function loadModule(path) {
  const fs = require("fs");

  const fileContent = fs.readFileSync(path).toString()
  (function (send) {
    eval(fileContent);
  })({});
}
