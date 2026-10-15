# Inspecting TCP Data Packets in Wireshark

## 1. Wireshark kya hai?

Wireshark ek **network packet analyzer** hai. Isse hum client aur server ke beech network traffic ko inspect kar sakte hain.

Hum dekh sakte hain:

```text
TCP handshake
TCP ACKs
TCP segments
IP information
HTTP data
Headers
Payload
```

---

# 2. Multiple `socket.write()` ka kya hota hai?

Maan lo:

```js
socket.write("HTTP/1.1 200 OK\r\n");
socket.write("Content-Type: text/plain\r\n");
socket.write("Content-Length: 5\r\n");
socket.write("\r\n");
socket.write("Hello");
```

Humne 5 `socket.write()` calls kiye.

Lekin Wireshark mein zaroori nahi ki 5 alag TCP packets dikhen.

TCP **byte stream** hai.

```text
Application writes
      ↓
TCP byte stream
      ↓
TCP segments
      ↓
IP packets
      ↓
Ethernet/Wi-Fi frames
```

OS/TCP stack data ko apne according segment/combine kar sakta hai.

> **1 `socket.write()` = 1 TCP packet, ye guarantee nahi hai.**

Multiple writes ek TCP segment mein combine ho sakte hain, aur ek write ka data multiple TCP segments mein split ho sakta hai.

---

# 3. TCP 3-Way Handshake

TCP connection establish karne ke liye normally:

```text
Client                         Server

SYN  ------------------------>

     <------------------------ SYN + ACK

ACK  ------------------------>
```

### Packet 1 — SYN

Client connection establish karne ki request karta hai.

### Packet 2 — SYN + ACK

Server:

```text
SYN + ACK
```

bhejta hai.

### Packet 3 — ACK

Client ACK bhejta hai.

Uske baad TCP connection established ho sakta hai.

### Important

Ye **HTTPS version packets nahi hain**.

Ye **TCP handshake packets** hain.

HTTPS/TLS handshake alag process hai aur TCP connection ke baad ho sakta hai jab HTTPS TCP ke upar use ho raha ho.

---

# 4. ACK kya hai?

`ACK` = **Acknowledgment**

Simple meaning:

> Receiver sender ko confirm karta hai ki TCP ke particular bytes/sequence range receive ho gaye.

```text
Client
  ↓
TCP data
  ↓
Server

Server
  ↓
ACK
  ↓
Client
```

ACK ka matlab ye nahi ki poora HTTP response receive ho gaya. Ye TCP-level acknowledgment hai.

---

# 5. HTTP Headers Wireshark mein

HTTP/1.x response:

```text
HTTP/1.1 200 OK\r\n
Content-Type: text/plain\r\n
Content-Length: 5\r\n
\r\n
Hello
```

Structure:

```text
Status Line
     ↓
Headers
     ↓
Blank Line
     ↓
Body
```

---

# 6. Headers ka end kaise pata chalta hai?

HTTP/1.x mein standard line ending:

```text
\r\n
```

Headers ke end par:

```text
\r\n\r\n
```

Hexadecimal:

```text
\r\n
↓
0D 0A

\r\n\r\n
↓
0D 0A 0D 0A
```

### Important correction

Agar manually:

```js
"\n\n"
```

bhejo, uska hex:

```text
0A 0A
```

hoga.

Lekin proper HTTP/1.x response mein standard separator:

```text
\r\n\r\n
=
0D 0A 0D 0A
```

hai.

---

# 7. Headers ke baad body

Example:

```text
HTTP/1.1 200 OK\r\n
Content-Type: text/plain\r\n
Content-Length: 5\r\n
\r\n
Hello
```

Flow:

```text
Status
  ↓
Headers
  ↓
\r\n\r\n
  ↓
Body
  ↓
Hello
```

---

# 8. Large data multiple TCP segments mein

Agar response data bahut bada hai, toh woh multiple TCP segments mein transmit ho sakta hai.

```text
Large Data
   ↓
Segment 1
Segment 2
Segment 3
Segment 4
   ↓
Receiver TCP
   ↓
Reassembly
   ↓
Ordered byte stream
```

TCP sequence numbers ki help se receiver bytes ko correct order mein handle karta hai.

### Important

TCP application ko **ordered byte stream** deta hai.

Application ko original TCP segment boundaries preserve hona guaranteed nahi hota.

---

# 9. Packet mein sirf HTTP data nahi hota

Network packet/frame mein multiple layers ka information hota hai:

```text
Ethernet Header
       +
IP Header
       +
TCP Header
       +
TCP Payload
```

Isliye Wireshark ka:

```text
Length: 43
```

automatically ye nahi batata ki HTTP data 43 bytes ka hai.

Different fields dekho:

```text
Frame length
IP total length
TCP segment length
TCP payload
HTTP data
```

### Empty TCP data

TCP packet ka payload **0 bytes** bhi ho sakta hai.

Example:

```text
TCP Header
+
0 bytes application data
```

Pure ACK packets mein application payload nahi bhi ho sakta.

---

# 10. `fetch()` mein two `await` kyun?

Example:

```js
const res = await fetch(url);

const data = await res.text();
```

Dono `await` alag Promise ko wait kar rahe hain.

---

# 11. First `await`

```js
const res = await fetch(url);
```

`fetch()` ka Promise generally response available hone par resolve hota hai, yani response ke initial status/headers available ho jaane ke baad.

Simple mental model:

```text
fetch()
  ↓
Request sent
  ↓
Server response starts
  ↓
Response headers available
  ↓
fetch() resolves
  ↓
res available
```

Iske baad:

```js
res.status
res.headers
res.body
```

jaise response information access kar sakte ho.

### Important

First `await` ka matlab ye nahi ki **poori response body receive ho gayi**.

---

# 12. Second `await`

```js
const data = await res.text();
```

Ab response body ko consume karke text mein convert kiya jaata hai.

Flow:

```text
Response headers
      ↓
fetch() resolves
      ↓
res available
      ↓
Body stream
      ↓
Chunks receive
      ↓
Complete body
      ↓
res.text() resolves
      ↓
data available
```

JSON:

```js
const data = await res.json();
```

Binary:

```js
const data = await res.arrayBuffer();
```

---

# 13. `res.format()` nahi

Fetch API mein normally:

```js
res.text()
res.json()
res.arrayBuffer()
res.blob()
```

jaise body-reading methods use hote hain.

Example:

```js
const res = await fetch(url);

const data = await res.text();

console.log(data);
```

---

# 14. Two `await` ko simple example se samjho

Courier example:

```text
Courier door par aaya
       ↓
"Parcel available hai"
       ↓
First await
       ↓
Parcel available
       ↓
Parcel open/read karo
       ↓
Second await
       ↓
Actual contents ready
```

Similarly:

```js
const res = await fetch(url);
```

→ Response available.

```js
const data = await res.text();
```

→ Body consume karke text ready.

---

# 15. Wireshark + Fetch ko connect karo

```text
Browser fetch()
      ↓
TCP connection
      ↓
TCP handshake

SYN
SYN-ACK
ACK

      ↓
HTTP request
      ↓
Server
      ↓
HTTP response headers
      ↓
HTTP response body
      ↓
TCP segments
      ↓
Wireshark
```

Browser side:

```text
fetch()
  ↓
Response available
  ↓
fetch() Promise resolves
  ↓
res
  ↓
Body stream
  ↓
res.text() / res.json()
  ↓
Complete body
  ↓
data
```

---

# 16. HTTP/1.1 vs HTTP/2 vs HTTP/3

Ye notes mainly **HTTP/1.x** ke liye hain.

### HTTP/1.x

Text-style headers:

```text
HTTP/1.1 200 OK
Content-Type: text/plain

Hello
```

Headers end:

```text
\r\n\r\n
```

### HTTP/2

HTTP/2 **binary framing** use karta hai. Isliye Wireshark mein HTTP/1.1 ki tarah simple text header structure expect nahi karna chahiye.

### HTTP/3

```text
HTTP/3
 ↓
QUIC
 ↓
UDP
```

use karta hai.

---

# 17. Complete mental model

```text
                 APPLICATION
                      │
                     HTTP
                      │
             ┌────────┴────────┐
             │                 │
          Headers             Body
             │                 │
             └────────┬────────┘
                      ↓
                     TCP
                      ↓
              TCP Segments / ACKs
                      ↓
                      IP
                      ↓
               Ethernet / Wi-Fi
                      ↓
                Physical Signal
```

Wireshark different layers ko inspect karne mein help karta hai.

---

# 🧠 Quick Revision

### TCP 3-Way Handshake

```text
SYN
 ↓
SYN-ACK
 ↓
ACK
```

### ACK

```text
Acknowledgment
```

TCP-level received bytes/sequence information ko acknowledge karta hai.

### HTTP/1.x Header End

```text
\r\n\r\n
```

Hex:

```text
0D 0A 0D 0A
```

### `\n\n`

```text
0A 0A
```

Ye LF-only separator hai. Proper HTTP/1.x line endings CRLF hain.

### Large Data

```text
Large HTTP data
      ↓
Multiple TCP segments
      ↓
Receiver TCP
      ↓
Ordered byte stream
```

### First Await

```js
const res = await fetch(url);
```

→ Response status/headers available hone par response object milta hai; full body necessarily ready nahi hoti.

### Second Await

```js
const data = await res.text();
```

→ Body consume karke text ready.

### JSON

```js
const data = await res.json();
```

### Binary

```js
const data = await res.arrayBuffer();
```

---

## One-line summary

> **Wireshark mein TCP handshake (`SYN → SYN-ACK → ACK`), ACKs, TCP segments aur application data inspect kar sakte hain. HTTP/1.x mein headers `\r\n\r\n` (`0D 0A 0D 0A`) ke baad body start hoti hai. Large data multiple TCP segments mein aa sakta hai, aur `fetch()` ka first `await` response availability tak, jabki `res.text()/json()/arrayBuffer()` wala second `await` response body ko consume/parse hone tak wait karta hai.**
