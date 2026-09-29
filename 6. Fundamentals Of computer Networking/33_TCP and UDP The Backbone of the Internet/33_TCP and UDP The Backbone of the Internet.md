TCP and UDP The Backbone of the Internet


TCP => Transession control protocol
TCP and UDP are the mainly protocol on which other protocol like HTTP, QUIC, WEBRTC and others. Are made

TCP and UDP are made on Layer-4 

***TCP
Reliable way data transfer to one point to other
It's transfer big data in chunk which know as segment
It's insure that all the data is transfer if not it retry 
3-way Handshake syn connect to the destination then if syn-ack then it will resend ack
Every Operating system follow TCP 

***UDP
Not Reliable data transfer
It's transfer big data in chunk which know as Datagram
It's not insure that all the data is transfer. 
Manly  use in Real Time communication video call 
Example Zoom, Google meet base on WEBRTC (top of UDP) 

QUIC is made by google which is based on UDP and HTTP version 3 is based on it


TCP aur UDP: Internet ke Backbone
Duniya ka internet mainly do protocols pe depend karta hai: TCP aur UDP. Baaki saare major protocols (HTTP, FTP, SMTP, WebRTC etc.) in dono ke upar bante hain.

🌐 TCP aur UDP kya hain?
Dono Layer 4 (Transport Layer) protocols hain OSI model me.
TCP (Transmission Control Protocol) → Reliable communication deta hai.
UDP (User Datagram Protocol) → Fast aur lightweight hai, lekin reliable nahi.
Internet me mostly TCP use hota hai, lekin real-time apps me UDP ki importance bahut hai.

🔒 TCP kaise kaam karta hai?
TCP ek connection-oriented protocol hai → Pehle connection establish, phir data transfer.
3-Way Handshake (Connection Setup):
SYN → Computer A ne connection start kiya.
SYN-ACK → Computer B ne response diya.
ACK → Computer A ne confirm kiya.
Phir session start hota hai aur data segments me bheja jata hai.
TCP ensure karta hai ki data lossless aur correct order me mile. Agar packet miss ho gaya toh retransmission hoti hai.
UDP kaise kaam karta hai?
UDP ek connectionless aur unreliable protocol hai.
Sirf datagrams bhejte hain bina confirm kiye ki voh pahunch gaye ya nahi.
Speed important hai, accuracy secondary.
Agar packet lost ho jaye → Application handle kare (jaise video call me “repeat that again”).
Use cases: Live streaming, video calls, online gaming.

🌍 Real-World Examples
TCP → Web browsing (HTTP/HTTPS), File transfer (FTP), Email (SMTP).
UDP → Video calls (WebRTC), Online games, Live streaming.

🔥 Latest Protocols
QUIC (Quick UDP Internet Connection) → Google ne banaya, UDP par based.
HTTP/3 → QUIC ke upar run karta hai (iska matlab HTTP/3 = UDP based).

🎯 Ports in TCP/UDP
Dono ke paas 65,536 ports (0–65535) hote hain.
Same port number par TCP aur UDP alag-alag apps run kar sakte hain.
Lekin ek hi port par do TCP apps ek sath run nahi kar sakte.
Summary
TCP → Reliable, connection-oriented, ordered data.
UDP → Fast, connectionless, thoda unreliable.
TCP = Safety, UDP = Speed.
Networking me samajhna zaroori hai ki kab TCP use karna hai aur kab UDP.

TCP (Transmission Control Protocol):

    TCP is a reliable, connection-oriented protocol used for sending data over the internet.

    It ensures that data is delivered in order, without errors, and without loss.

    Before sending data, it uses a 3-way handshake to establish a connection.

    It uses acknowledgments, sequence numbers, and retransmissions to ensure reliability.

    Commonly used in web browsing, emails, file transfers, and remote access.

    Think of it like a phone call: both sides connect, talk in order, and confirm everything was heard.

UDP (User Datagram Protocol):

    UDP is a connectionless, fast, and lightweight protocol used for sending data.

    It does not guarantee delivery, order, or error checking.
No handshake—data is just sent without setup.

    It's faster than TCP but less reliable.

    Commonly used in Live video/audio streaming, Online gaming, VoIP (Voice over IP)

    Think of UDP like sending a letter without tracking—it might arrive, it might not, but it's quick and simple.