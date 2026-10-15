UDP se file send kar sakte hain, lekin UDP delivery, ordering aur duplicate data ko guarantee nahi karta. Isliye file missing, incomplete ya wrong order mein receive ho sakti hai, jisse file corrupt ho sakti hai.

1. UDP se file transfer kaise ho raha hai?

Client — num.txt

File ko read karke chunks mein divide karta hai

UDP socket.send()

Chunk 1

UDP

Chunk 2

UDP

Chunk 3

UDP

Har chunk ek alag UDP datagram hota hai. Koi chunk lose ya reorder ho sakta hai.

Server ka socket

Server — numbers.txt

Received chunks ko file mein write karta hai

2. Client-side code — File send karna
   Part 1: UDP socket create karna
   const socket = dgram.createSocket("udp4");

dgram Node.js ka UDP module hai.

createSocket("udp4") IPv4 UDP socket create karta hai.

socket ke through data send aur receive hota hai.

Notes: A UDP socket is a communication endpoint used to send and receive datagrams over a network.

Part 2: File ko read karna
const readStream = createReadStream(
"C:\\Users\\deepak\\Desktop\\num.txt",
{
highWaterMark: 1000,
}
);

createReadStream() file ko stream ke through read karta hai.

Puri file ek saath RAM mein load nahi hoti.

highWaterMark: 1000 stream ko approximately 1000 bytes ke chunks mein data read karne ke liye configure karta hai.

Example: Agar file 5000 bytes ki hai, toh lagbhag 5 chunks mil sakte hain. Actual chunk sizes aur count stream implementation aur file size par depend karte hain.

Notes: A Readable Stream reads a file in smaller chunks instead of loading the entire file into memory.

Part 3: data event — Chunk receive karna
readStream.on("data", (chunk) => {
socket.send(
chunk,
4000,
"192.168.0.210",
() => {
console.log("Message sent");
}
);
});

Isko line-by-line samjho:

Code

Kya karta hai?

"data"

Jab file se data ka chunk milta hai, event execute hota hai.

chunk

File ka current data, jo Buffer hota hai.

socket.send()

Chunk ko UDP datagram ke through send karta hai.

4000

Server ka destination port.

"192.168.0.210"

Server ka destination IP address.

Callback

Local send operation complete hone par execute hota hai.

Important: "Message sent" ka matlab ye nahi ki server ne chunk successfully receive kar liya. UDP mein sender ko delivery confirmation automatically nahi milta.

Part 4: end event — File reading complete
readStream.on("end", () => {
socket.send(
"EOF",
4000,
"192.168.0.210",
() => {
console.log("Message sent");
}
);
});

"end" tab fire hota hai jab file se reading complete ho jaati hai.

"EOF" ka matlab End Of File hai.

Client server ko signal bhej raha hai ki file ke chunks read kar liye gaye hain.

Lekin ek problem hai: UDP mein EOF datagram, file ke last chunk se pehle bhi pahunch sakta hai. Isliye sirf EOF bhejna reliable file transfer ke liye enough nahi hai.

3. Server-side code — File receive karna
   Part 1: Write Stream create karna
   const writeStream = createWriteStream("numbers.txt");

Server par numbers.txt file create/open hoti hai.

writeStream us file mein data write karta hai.

Agar file pehle se exist karti hai, toh default behavior mein uska existing content truncate ho jaata hai.

Notes: A Writable Stream writes incoming data to a file in chunks.

Part 2: Server ko port 4000 par listen karana
socket.bind(4000, () => {
const address = socket.address();

console.log(`Listening on port ${address.port}`);
console.log(address);
});

socket.bind(4000) server ke UDP socket ko port 4000 par bind karta hai.

Server is port par aane wale UDP datagrams receive kar sakta hai.

socket.address() server ke local socket address ki information deta hai.

Aapke client mein destination port 4000 hai, isliye dono ports match kar rahe hain.

Part 3: Message event — Data receive karna
socket.on("message", async (message, remoteAddress) => {

Jab UDP datagram receive hota hai, "message" event fire hota hai.

message received data ka Buffer hai.

remoteAddress sender ke IP aur port ki details deta hai.

Example:

message.toString();
// "123456"

remoteAddress.address;
// "192.168.0.100"

remoteAddress.port;
// Client ka source port

Dhyan rahe, client ka source port zaroori nahi ki 4000 ho. 4000 server ka destination port hai.

Part 4: EOF check karna
if (message.toString() === "EOF") {
socket.send(
"File Uploaded Successfully on the server",
remoteAddress.port,
remoteAddress.address
);
}

Server check karta hai ki received message "EOF" hai ya nahi.

Agar EOF hai, toh server client ke IP aur source port par success message send karta hai.

Problem: Aapke current code mein server success message bhej raha hai, lekin writeStream ko properly finish nahi kar raha. Sirf EOF milne se ye prove nahi hota ki file ke saare chunks receive aur write ho chuke hain.

Part 5: Normal chunk ko file mein write karna
else {
writeStream.write(message);
}

Agar message "EOF" nahi hai:

Received Buffer ko writeStream mein bheja jaata hai.

Stream us data ko numbers.txt mein write karta hai.

Agla received datagram bhi isi file mein write hota hai.

Yahan ek important risk hai: writeStream.write() data ko usi order mein likhega jis order mein server ko data diya gaya, lekin UDP datagrams network mein reorder ho sakte hain.

4. UDP se file corrupt kyun ho sakti hai?

Client ne is order mein bheja:

A
B
C
D

Network mein packet loss / reordering

Server ko mila:

A
Received
C
Received
D
Received
B
Late

Agar server isi order mein write karega, toh output A-C-D-B hoga, original A-B-C-D nahi.

UDP ke 3 important risks:

Packet loss: Koi chunk receive hi nahi hua.

Out-of-order delivery: Chunks galat order mein aa gaye.

No automatic retransmission: Lost chunk ko UDP khud dobara send nahi karta.

UDP checksum kuch transmission errors detect kar sakta hai, lekin woh missing chunks ko recover ya correct order mein arrange nahi karta.

Note: UDP use karne se file automatically corrupt nahi hoti. Chhoti file ya reliable local network par transfer sahi bhi ho sakta hai. Lekin UDP delivery guarantee nahi deta.

5. Aapke code mein aur kya improve karna chahiye?

1. EOF se pehle chunks ka wait

Server ko EOF milne ka matlab ye nahi ki saare chunks mil gaye. UDP mein EOF bhi reorder ho sakta hai.

2. Write Stream ko finish karna

EOF par writeStream.end() call karein aur write complete hone ke baad hi success response bhejein.

3. Chunk sequence number

Har chunk ke saath sequence number bhejein, taaki server missing ya out-of-order chunks detect kar sake.

4. Acknowledgement aur retry

Server se har chunk ka ACK lein. ACK na mile toh client chunk ko dobara send kar sakta hai.

Ek aur baat: aapke client mein socket.on("message", ...) ke andar socket.close() hai. Iska matlab server ka reply milte hi client socket close ho jayega. Lekin stream ki reading aur saare send operations properly complete hone ke baad hi socket close karna chahiye.

6. Final notes — UDP vs TCP

Feature

UDP

TCP

Delivery guarantee

Nahi

Haan, connection ke dauran

Correct order

Guarantee nahi

Haan

Lost data retry

Khud implement karna hoga

TCP handle karta hai

File transfer

Reliability khud banani hogi

Reliable byte stream

Data boundaries

Har datagram alag

Application ko framing khud karni hoti hai

Learning takeaway: UDP mein file transfer karna possible hai, lekin reliable transfer ke liye sequence numbers, acknowledgements, retransmission, aur proper file completion checks implement karne padte hain. Normal file transfer ke liye TCP ka use karna zyada straightforward hai.
