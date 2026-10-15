# Creating a TCP Client Using Node.js

## 1. Introduction

Node.js ke `net` module ka use karke TCP client create kar sakte hain.
TCP client server ke saath connection establish karta hai, phir dono
data send aur receive kar sakte hain.

## 2. `net` module import karna

``` js
import net from "node:net";
```

-   `net` Node.js ka built-in module hai.
-   Iska use TCP server aur TCP client banane ke liye hota hai.

## 3. TCP client create karna

``` js
const socket = net.createConnection({
  host: "192.168.0.210",
  port: 4000
});
```

-   `net.createConnection()` TCP connection start karta hai.
-   `host` --- server ka IP address/hostname.
-   `port` --- server ka port number.
-   `socket` --- client-side `net.Socket` object hai. Iske through
    client data send aur receive karta hai.

## 4. Connection establish hone par

``` js
const socket = net.createConnection(
  { host: "192.168.0.210", port: 4000 },
  () => {
    console.log("Connected to server");
    socket.write("Hello Server");
  }
);
```

Connection successful hone par callback execute hota hai. Is example
mein client `"Hello Server"` bhejta hai.

**Note:** `socket.write()` ko connection establish hone se pehle bhi
call kiya ja sakta hai; Node.js data ko connection ready hone tak buffer
kar sakta hai. Beginner ke liye connect callback ke andar write karna
clear approach hai.

## 5. `socket.write()` --- data send karna

``` js
socket.write("Hii");
```

-   `socket.write()` socket ke through data send karta hai.
-   String network par bytes ke form mein transmit hoti hai.
-   TCP byte stream hai; receiver ko har `write()` ke liye separate
    `data` event milna guaranteed nahi hai.

## 6. `setTimeout()` ke saath message bhejna

Screenshot mein client code:

``` js
setTimeout(() => {
  socket.write("Hii");
  socket.end();
}, 2000);
```

-   `setTimeout(..., 2000)` callback ko lagbhag 2 seconds baad chalata
    hai.
-   Uske baad `"Hii"` send karne ke liye write hota hai.
-   `socket.end()` client ki taraf se data sending finish karta hai aur
    connection ko gracefully close karne ki process start karta hai.

**Important:** Ye code connect hote hi message nahi bhejta; ye timer ke
baad bhejta hai. Turant connection ke baad bhejna ho toh
`socket.write()` ko connect callback mein rakhein.

## 7. Server connect hote hi message bhej sakta hai

Server-side example:

``` js
const server = net.createServer((socket) => {
  socket.write("HTTP\n\nGot your message");
});
```

Jab client connect karta hai, server ka connection callback execute hota
hai. Server `socket.write()` se client ko message bhejta hai.

Yahan **server** connection ke baad message bhej raha hai; client ka
message aane ka wait nahi ho raha.

Client ko server ka message receive karne ke liye:

``` js
socket.on("data", (chunk) => {
  console.log("Server says:", chunk.toString());
});
```

## 8. Client ka `data` event

``` js
socket.on("data", (chunk) => {
  console.log(chunk.toString());
});
```

-   `"data"` event tab fire hota hai jab server se client socket par
    data receive hota hai.
-   `chunk` ek Buffer hota hai.
-   `chunk.toString()` Buffer ko readable text mein convert karta hai.

## 9. Error handling

``` js
socket.on("error", (err) => {
  console.log("Connection error:", err.message);
});
```

Connection fail ho sakta hai, jaise server start na ho, IP/port galat
ho, firewall block kare, ya network reachable na ho. `"error"` event in
errors ko handle karne mein help karta hai.

## 10. `end` aur `close` events

``` js
socket.on("end", () => {
  console.log("Server finished sending data");
});

socket.on("close", () => {
  console.log("Socket closed");
});
```

-   `"end"` --- remote side ne apni taraf se data sending finish ki (TCP
    FIN receive hua).
-   `"close"` --- socket close ho gaya.
-   Dono events ka meaning alag hai.

## 11. Complete TCP client --- `client.js`

``` js
import net from "node:net";

const socket = net.createConnection(
  { host: "192.168.0.210", port: 4000 },
  () => {
    console.log("Connected to server");
    socket.write("Hello Server");
  }
);

socket.on("data", (chunk) => {
  console.log("Server says:", chunk.toString());
});

socket.on("end", () => {
  console.log("Server finished sending data");
});

socket.on("error", (err) => {
  console.log("Connection error:", err.message);
});

socket.on("close", () => {
  console.log("Connection closed");
});
```

## 12. Complete server --- `app.js`

``` js
import net from "node:net";

const server = net.createServer((socket) => {
  console.log("Client connected:", socket.remoteAddress);

  // Client connect hote hi server message bhejta hai
  socket.write("Welcome! You are connected to the server.\\n");

  socket.on("data", (chunk) => {
    console.log("Client says:", chunk.toString());
    socket.write("Got your message");
  });

  socket.on("end", () => {
    console.log("Client finished sending data");
  });

  socket.on("close", () => {
    console.log("Client disconnected");
  });

  socket.on("error", (err) => {
    console.log("Socket error:", err.message);
  });
});

server.listen(4000, "0.0.0.0", () => {
  console.log("Server started on port 4000");
});
```

## 13. Client aur server ke socket

Client aur server dono ke paas apna socket object hota hai:

-   Client ka `socket.write()` --- server ko data send karta hai.
-   Server ke connection callback mein mila `socket.write()` --- client
    ko data send karta hai.
-   Client ka `socket.on("data")` --- server se aaya data receive karta
    hai.
-   Server ka `socket.on("data")` --- client se aaya data receive karta
    hai.

## 14. Quick revision

-   `net.createConnection()` --- TCP client connection start karta hai.
-   `host` --- server ka IP/hostname.
-   `port` --- server ka listening port.
-   Connect callback --- connection establish hone par execute hota hai.
-   `socket.write(data)` --- data send karta hai.
-   `socket.on("data")` --- doosri side se aaya data receive karta hai.
-   `chunk` --- received bytes ka Buffer.
-   `chunk.toString()` --- Buffer ko text mein decode karta hai.
-   `socket.end()` --- apni taraf se sending finish karta hai.
-   `socket.on("error")` --- socket errors handle karta hai.
-   `socket.on("close")` --- socket close hone par execute hota hai.

**One-line summary:** TCP client `net.createConnection()` se server se
connect karta hai; connection ke baad `socket.write()` se data bhej
sakta hai aur `"data"` event se server ka response receive kar sakta
hai.
