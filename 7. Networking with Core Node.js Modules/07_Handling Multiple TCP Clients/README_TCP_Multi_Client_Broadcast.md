# Node.js TCP Multi-Client Chat / Message Broadcast

## 1. Is project mein kya ho raha hai?

Is example mein ek TCP server multiple clients ko accept karta hai.

-   Client server se connect hota hai.
-   Client ka message server tak aata hai.
-   Server received message ko connected clients tak forward/broadcast
    karta hai.
-   Server terminal se bhi kisi ek client ko ya sabhi clients ko message
    bhejne ka logic rakhta hai.

> **Important:** TCP ek reliable, ordered byte stream hai. Lekin har
> `write()` ke liye receiver ko ek separate `data` event milna
> guaranteed nahi hota. Real chat app mein message boundaries ke liye
> newline delimiter ya length-prefix framing use karein.

------------------------------------------------------------------------

## 2. Server mein `net` module import karna

``` js
import net from "node:net";
```

-   `net` Node.js ka built-in module hai.
-   Iska use TCP server aur client banane ke liye hota hai.

## 3. Connected clients ko store karna

``` js
const clientsList = [];
```

-   `clientsList` ek array hai.
-   Har baar naya client connect hota hai, uska socket is array mein add
    hota hai.
-   Server is array ka use clients ko messages bhejne ke liye karta hai.
-   Array ka index client ko select karne ke kaam aa sakta hai.

Example:

``` text
clientsList[0] -> pehla connected client
clientsList[1] -> doosra connected client
clientsList[2] -> teesra connected client
```

Index `0` se start hota hai.

## 4. Server terminal se input lena

``` js
process.stdin.on("data", (input) => {
  const inputStr = input.toString();
  const [clientIndex] = inputStr.split(" ");
});
```

-   `process.stdin` terminal se user ka input read karta hai.
-   `"data"` event terminal input aane par fire hota hai.
-   `input` aam taur par Buffer hota hai.
-   `input.toString()` usse text mein convert karta hai.
-   `split(" ")` input ko spaces par divide karta hai.

Example input:

``` text
1 Hello client
```

Ismein: - `clientIndex` = `"1"` - Baaki message = `"Hello client"` (code
mein `substring(1)` use karke pehle token ke baad ka text liya ja raha
hai).

**Note:** Terminal input mein newline (`\n`) bhi aa sakta hai. Use
handle karne ke liye `trim()`/line-based input parsing ki zaroorat ho
sakti hai.

## 5. Terminal se kisi ek client ko message bhejna

Screenshot mein intended logic:

``` js
clientsList[parseInt(clientIndex)].write(
  inputStr.substring(1)
);
```

Agar terminal input `1 Hello` hai, toh server `clientsList[1]` ko
message bhejne ki koshish karta hai.

-   `parseInt(clientIndex)` string index ko number banata hai.
-   `clientsList[index]` selected client ka socket hai.
-   `.write(...)` us client ko data send karta hai.

**Index check zaroor karein:** Agar index exist nahi karta, toh error aa
sakta hai. Aur `substring(1)` sirf pehla character remove karta hai;
multi-digit index (jaise `10 Hello`) ke liye ye parsing sahi nahi hogi.

## 6. Important bug: `typeof parseInt(...)` check

Screenshot mein condition hai:

``` js
if (typeof parseInt(clientIndex) === "number") {
  // send to selected client
} else {
  // broadcast
}
```

Ye condition sahi nahi hai. `parseInt("abc")` ka result `NaN` hota hai,
lekin `typeof NaN` bhi `"number"` hota hai. Isliye `else` branch
expected tarike se execute nahi hogi.

Safer check:

``` js
const index = Number(clientIndex);

if (clientIndex !== undefined && clientIndex.trim() !== "" &&
    Number.isInteger(index)) {
  // selected client ko message
} else {
  // sabhi clients ko message
}
```

Iske saath index range bhi check karein:

``` js
if (Number.isInteger(index) && index >= 0 && index < clientsList.length) {
  clientsList[index].write(message);
}
```

## 7. Sabhi clients ko message broadcast karna

``` js
clientsList.forEach((socket) => {
  socket.write(input);
});
```

-   `forEach()` array ke har client socket par loop karta hai.
-   `socket.write(input)` har connected client ko input send karta hai.
-   Isko broadcast kehte hain.

Agar 3 clients connected hain, toh server ye message teeno ko bhejega.

> Is logic mein sender bhi `clientsList` mein hai, isliye broadcast
> message sender ko bhi wapas mil sakta hai.

## 8. TCP server create karna

``` js
const server = net.createServer((socket) => {
  // New client ka connection
});
```

-   `net.createServer()` TCP server create karta hai.
-   Callback har naye client connection ke liye execute hota hai.
-   `socket` us specific client connection ka `net.Socket` object hai.
-   `socket` ek Duplex Stream hai: data receive bhi kar sakta hai aur
    send bhi.

## 9. Client connect hone par socket list mein add karna

``` js
const server = net.createServer((socket) => {
  clientsList.push(socket);
  console.log(clientsList.length);
});
```

-   `clientsList.push(socket)` naye client ka socket array mein add
    karta hai.
-   `clientsList.length` connected sockets ki total stored count dikhata
    hai.

**Important:** Client disconnect hone par us socket ko array se remove
bhi karna chahiye. Warna array mein stale/closed sockets reh sakte hain.

## 10. Client se data receive karna

``` js
socket.on("data", (chunk) => {
  console.log(chunk.toString());

  clientsList.forEach((socket) => {
    socket.write(chunk);
  });
});
```

Step-by-step:

1.  Client server ko data bhejta hai.
2.  Server ke us client socket par `"data"` event fire hota hai.
3.  `chunk` mein received bytes hote hain (Buffer).
4.  `chunk.toString()` data ko text ke roop mein console par print karta
    hai.
5.  `clientsList.forEach()` har stored client socket ko wahi chunk send
    karta hai.

**Note:** TCP stream hone ki wajah se `chunk` zaroori nahi ki ek
complete chat message ho. Ek message multiple chunks mein aa sakta hai,
ya multiple messages ek chunk mein aa sakte hain.

## 11. Client connect hote hi welcome message

Screenshot mein:

``` js
socket.write("HTTP\n\nGot your message");
```

Ye line server ke connection callback ke andar hai, isliye client
connect hone par server ye text bhejta hai.

-   `\n` newline character hai.
-   Ye apne aap mein proper HTTP response nahi hai. Agar actual HTTP
    protocol use karna hai, toh valid status line, headers aur blank
    line chahiye.
-   TCP chat example mein simple message bhejna ho toh
    `"Welcome to the server!\n"` jaisa text zyada clear hai.

## 12. Client disconnect aur error events

``` js
socket.on("close", () => {
  console.log(socket.remoteAddress, "Client disconnected");
});

socket.on("error", () => {
  console.log("client lost");
});
```

-   `"close"` --- socket close hone par execute hota hai.
-   `socket.remoteAddress` --- connected client ka IP address.
-   `"error"` --- socket par error aane par execute hota hai.

Disconnect par client ko list se remove karna useful hai:

``` js
socket.on("close", () => {
  const index = clientsList.indexOf(socket);
  if (index !== -1) {
    clientsList.splice(index, 1);
  }
});
```

## 13. Server ko port 4000 par listen karana

``` js
server.listen(4000, "0.0.0.0", () => {
  console.log("Server started on Port 4000");
});
```

-   `4000` --- server ka TCP port.
-   `"0.0.0.0"` --- machine ke sabhi available IPv4 interfaces par
    listen karta hai.
-   Callback server listening ke liye ready hone par run hota hai.

Remote client se connect karne ke liye server machine ka reachable IP
use karein aur firewall mein TCP port 4000 allow ho.

------------------------------------------------------------------------

# 14. Client-side code --- `client.js`

## Step 1: TCP module import karein

``` js
import net from "node:net";
```

## Step 2: Terminal input ko socket par write karna

``` js
process.stdin.on("data", (input) => {
  socket.write(input);
});
```

-   Terminal par type kiya gaya input read hota hai.
-   `socket.write(input)` us data ko server ko send karta hai.
-   Yahan input Buffer ke roop mein bhi send ho sakta hai.

## Step 3: Server se connect karna

``` js
const socket = net.createConnection({
  host: "192.168.0.210",
  port: 4000
});
```

-   `host` server ka IP address hai.
-   `port` server ka listening port hai.
-   `socket` client-side TCP connection ko represent karta hai.

## Step 4: Errors handle karna

``` js
socket.on("error", () => {
  console.log("Server lost");
});
```

Connection fail hone ya socket error aane par error event handle hota
hai. Debugging ke liye error message bhi print kar sakte hain:

``` js
socket.on("error", (err) => {
  console.log("Connection error:", err.message);
});
```

## Step 5: Server ka data receive karna

``` js
socket.on("data", (chunk) => {
  console.log(chunk.toString());
});
```

Server se data aane par `"data"` event fire hota hai. Buffer ko
`toString()` se readable text mein convert kiya jaata hai.

------------------------------------------------------------------------

# 15. Overall flow

1.  Server port `4000` par listen karta hai.
2.  Client server ke IP aur port par TCP connection banata hai.
3.  Server ka `"connection"` callback fire hota hai.
4.  Server client ka socket `clientsList` mein add karta hai.
5.  Client terminal se message type karke server ko send karta hai.
6.  Server ke `"data"` event mein message receive hota hai.
7.  Server message ko `clientsList` ke clients tak broadcast karta hai.
8.  Client sockets `"data"` event ke through message receive karke
    console par print karte hain.
9.  Client disconnect hone par server ko socket list se us client ko
    remove karna chahiye.

# 16. Quick revision

-   `clientsList` --- connected client sockets ka array.
-   `process.stdin` --- terminal se input read karta hai.
-   `net.createServer()` --- TCP server create karta hai.
-   `"connection"` --- client connect hone par fire hota hai.
-   `clientsList.push(socket)` --- client socket ko list mein add karta
    hai.
-   `"data"` --- socket par data receive hone par fire hota hai.
-   `chunk` --- received bytes ka Buffer.
-   `socket.write()` --- doosri side ko data send karta hai.
-   `forEach()` --- har client ko message broadcast karne ke liye.
-   `net.createConnection()` --- TCP client connection start karta hai.
-   `"close"` --- socket close hone par fire hota hai.
-   `remoteAddress` --- remote client ka IP address.

**One-line summary:** Ye project TCP server ke through multiple clients
ko connect karta hai, client messages receive karta hai aur unhe
connected clients tak forward/broadcast karta hai.
