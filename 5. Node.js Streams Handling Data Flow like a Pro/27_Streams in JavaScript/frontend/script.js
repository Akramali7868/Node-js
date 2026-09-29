console.time();
const response = await fetch("http://localhost:4000/");

for await (const chunk of response.body) {
  console.log(chunk);
}
console.timeEnd();
