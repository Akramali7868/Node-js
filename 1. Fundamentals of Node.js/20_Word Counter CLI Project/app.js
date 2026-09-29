import { readFile } from "node:fs/promises";


const filePath = process.argv[2]

const fileContent = await readFile(filePath, "utf8");
const wordsArray = fileContent.split(/[\W]/).filter((word) => word);

const wordsCount = {};
console.log(process.argv);

wordsArray.forEach((word)=>{
    if(word in wordsCount) {
        wordsCount[word] +=1
    } else {
        wordsCount[word] = 1
    }
})
console.log(wordsCount);