import fs from "fs";

const fd = fs.openSync("text.txt", 'w+');

fs.writeSync(fd,'Hilll')