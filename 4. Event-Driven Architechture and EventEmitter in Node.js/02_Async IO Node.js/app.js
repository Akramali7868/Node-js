// import fsPromises from 'fs/promises'
import fs from 'fs'



setTimeout(() => {
    console.log('hi');
}, 0);

// Async IO
// const fileContent = await fsPromises.readFile('file.txt', 'utf-8')
// const fileContent =  fs.readFile('file.txt', 'utf-8', (data)=>{
//     console.log(data);
// })
// console.log(fileContent);

// Sync IO
// const fileContent =fs.readFileSync('file.txt', 'utf-8')