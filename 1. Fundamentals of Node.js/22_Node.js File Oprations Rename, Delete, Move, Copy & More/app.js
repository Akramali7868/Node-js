import {readFile, rename, copyFile, cp, unlink, rmdir, rm, writeFile, appendFile, mkdir,stat, watch } from "node:fs/promises";
// Rename method is used to move and rename
await rename("images.png", "backend.png");
copyFile("backend.png", "C:\\Users\\deepak\\Desktop\\nodejs.png");
cp('./src', "C:\\Users\\deepak\\Desktop\\src", {recursive:true})
rename("backend.png", "C:\\Users\\deepak\\Desktop\\backend.png");
unlink('backend.png')
rmdir('test')
rm('src', {recursive:true})
writeFile('style.css', '')
appendFile('styles.css', '')
rename('src', 'build')
mkdir('test')
const stats= await stat('app.js')
watch("file.txt", async (eventType)=>{
 if(eventType==="change") {
console.log(await readFile("file.txt", "utf8"));
 }
})

console.log("Renamed");
