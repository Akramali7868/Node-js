import fs from "fs";


const writeStream = fs.createWriteStream('streams.mp4')
writeStream.write('abc')
