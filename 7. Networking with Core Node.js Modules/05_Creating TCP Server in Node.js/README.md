# Node.js TCP Server --- `net` Module

## 1. Introduction

Node.js ka `net` module TCP servers aur TCP clients banane ke liye use
hota hai.

TCP connection establish hone ke baad client aur server ek doosre ko
data send aur receive kar sakte hain.

**Important:** TCP ek reliable, ordered byte stream provide karta hai.
Lekin TCP data ko application-level messages mein automatically divide
nahi karta.

## 2. Server create karna

``` js
import net from "node:net";

const server = net.createServer();
```

-   `net` --- Node.js ka built-in module hai, jo TCP networking ke liye
    use hota hai.
-   `net.createServer()` --- ek TCP server create karta hai.
-   `server` --- created server ko refer karne wala variable hai.

## 3. Server ko port par listen karana

``` js
server.listen(4000, "0.0.0.0", () => {
  console.log("Server started on Port 4000");
});
```

-   `4000` --- server ka port number.
-   `"0.0.0.0"` --- server ko machine ke sabhi available IPv4 network
    interfaces par listen karne ke liye bind karta hai.
-   Callback tab execute hota hai jab server listening ke liye ready ho
    jaata hai.

## 4. `connection` event

``` js
server.on("connection", (socket) => {
  console.log("Client Connected");
});
```

Jab koi client server ke saath TCP connection establish karta hai, tab
`"connection"` event fire hota hai.

-   `socket` --- us particular client connection ka `net.Socket` object
    hota hai.
-   Har client connection ke liye server ko alag socket object milta
    hai.
-   Ye socket **Duplex Stream** hai: isse data receive bhi kar sakte
    hain aur send bhi.

> Analogy: Server ek reception ki tarah hai. Jab client connect karta
> hai, server us connection ke liye ek communication line (`socket`)
> deta hai.

## 5. `data` event --- client ka data receive karna

``` js
socket.on("data", (chunk) => {
  console.log(chunk.toString());
});
```

Maan lo client ye bhejta hai:

``` js
client.write("Hello");
```

Server ke `data` event mein `chunk` ke andar received bytes aate hain.
`chunk` ek **Buffer** hota hai.

-   `chunk` --- abhi receive hua data.
-   `chunk.toString()` --- Buffer ke bytes ko text mein decode karta hai
    (default UTF-8).
-   Agar client `"Hello"` bheje, toh console par `Hello` print ho sakta
    hai.

**TCP stream ki important baat:** Ek `write("Hello")` ka matlab ye
guarantee nahi hai ki server ko ek hi `data` event mein poora `"Hello"`
milega. Data multiple chunks mein aa sakta hai, ya multiple writes ka
data ek chunk mein mil sakta hai. Agar application ko messages ki
boundaries chahiye, toh delimiter ya length-prefix jaisi framing
implement karein.

## 6. `socket.write()` --- client ko response bhejna

``` js
socket.on("data", (chunk) => {
  console.log(chunk.toString());

  socket.write("Got your message");
});
```

Is code mein:

1.  Client data send karta hai.
2.  Server ka `"data"` event fire hota hai.
3.  Received chunk console par print hota hai.
4.  `socket.write("Got your message")` client ko response bhejta hai.

**Clarification:** `socket.write()` sirf tabhi chal sakta hai jab client
message bheje --- aisa nahi hai. Is example mein woh `data` callback ke
andar likha hai, isliye is code mein response data receive hone par
bheja jaata hai. Socket open ho toh aap `socket.write()` ko doosri jagah
se bhi call kar sakte hain.

## 7. `close` event --- connection close hona

``` js
socket.on("close", () => {
  console.log(socket.remoteAddress, "Client disconnected");
});
```

Socket connection close hone par `"close"` event fire hota hai.

-   Is example mein server client disconnect hone par message log karta
    hai.
-   `socket.remoteAddress` remote client ka IP address hota hai.

`"close"` event aur `"end"` event alag hain: - `"end"` --- remote side
ne apna writable side finish kiya (FIN bheja); server ab aur incoming
data expect nahi karta. - `"close"` --- socket connection close ho gaya.

## 8. Socket address properties

``` js
console.log(socket.address());
console.log(socket.remoteAddress);
console.log(socket.remotePort);
console.log(socket.remoteFamily);
```

  -----------------------------------------------------------------------
  Property                            Meaning
  ----------------------------------- -----------------------------------
  `socket.address()`                  Local side ka address object ---
                                      jaise server ka local IP aur port

  `socket.remoteAddress`              Connected client ka IP address

  `socket.remotePort`                 Client ke connection ka source port

  `socket.remoteFamily`               Remote address family, jaise `IPv4`
                                      ya `IPv6`
  -----------------------------------------------------------------------

`socket.address()` local endpoint ki details deta hai, jabki
`remoteAddress` aur `remotePort` doosri side (client) ki details dete
hain.

## 9. Complete example

### Server --- `app.js`

``` js
import net from "node:net";

const server = net.createServer();

server.listen(4000, "0.0.0.0", () => {
  console.log("Server started on Port 4000");
});

server.on("connection", (socket) => {
  console.log("Client Connected");
  console.log("Local address:", socket.address());
  console.log("Client IP:", socket.remoteAddress);
  console.log("Client port:", socket.remotePort);
  console.log("Client family:", socket.remoteFamily);

  socket.on("data", (chunk) => {
    console.log("Client says:", chunk.toString());
    socket.write("Got your message");
  });

  socket.on("close", () => {
    console.log(socket.remoteAddress, "Client disconnected");
  });

  socket.on("error", (err) => {
    console.error("Socket error:", err.message);
  });
});
```

### Client --- `client.js`

``` js
import net from "node:net";

const client = net.createConnection(
  { port: 4000, host: "127.0.0.1" },
  () => {
    console.log("Connected to server");
    client.write("Hello");
  }
);

client.on("data", (chunk) => {
  console.log("Server says:", chunk.toString());
  client.end();
});

client.on("error", (err) => {
  console.error("Client error:", err.message);
});
```

Run server first, then client. Dono same machine par hon toh client
`127.0.0.1` use kar sakta hai. Kisi doosre device se connect karne ke
liye server machine ka reachable IP use karein aur firewall mein port
allow hona chahiye.

## 10. Quick revision

-   `net.createServer()` --- TCP server create karta hai.
-   `server.listen()` --- server ko specified port par listen karata
    hai.
-   `"connection"` --- client connect hone par fire hota hai; callback
    mein connection ka `socket` milta hai.
-   `socket` --- Duplex Stream hai, yani read bhi kar sakta hai aur
    write bhi.
-   `"data"` --- socket par bytes receive hone par fire hota hai.
-   `chunk` --- received data ka Buffer.
-   `chunk.toString()` --- Buffer ko readable text mein convert karta
    hai.
-   `socket.write()` --- connected client ko data send karta hai.
-   `"close"` --- socket close hone par fire hota hai.
-   `socket.remoteAddress` / `remotePort` --- client ki network details.
-   `socket.address()` --- server-side local endpoint ki details.

**One-line summary:** TCP server par client connect karta hai, server ko
us connection ka `socket` milta hai, aur us socket ke through dono sides
data read aur write kar sakti hain.
