const response = await fetch("http://localhost:4000/api", {
  method: 'DELETE',
  headers: {
    "Content-Type": 'application/json'
  }
});
const data = await response.json();

console.log(data);
