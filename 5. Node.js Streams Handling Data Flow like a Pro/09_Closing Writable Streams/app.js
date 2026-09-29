import fs from "fs";

const writeStream = fs.createWriteStream("file.txt", { highWaterMark: 4 });
writeStream.write('a')
writeStream.write('a')
writeStream.write('a')


writeStream.end('Hi, I am Akram')

writeStream.on('finish', ()=>{
  console.log('Finished');
})
writeStream.on('close', ()=>{
  console.log('Closed');
})