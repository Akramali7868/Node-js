socket.on("message", (message, remoteAddress) => {
  console.log(message.toString());
  console.log(remoteAddress);
});  yaha par jo udp se message karega use message ke andar recive hoga and remoteAddress me ip, port and size dikhega


isse ham server banaate hai
socket.bind({ port: 4000 }, () => {
  const address = socket.address();
  console.log(`listening on port ${address.port}`);
});   socket.bind se server start hota hai and object me port dal sake hai ki kispar start kana a ha 


Creating UDP Server

    ### Clinet UDP
    import dgram from "node:dgram";

    // returns an eventEmitter
    const socket = dgram.createSocket("udp4");

    // Listens for message event from sender/server
    socket.on("message", (message, remoteAddress) => {
    console.log(message.toString(), remoteAddress);
    });

    // Send a message to port 4000, at given IP
    socket.send("Hi from server", 4000, "192.168.0.104");

    ### Server UDP
    import dgram from "node:dgram";

    // returns an eventEmitter
    const socket = dgram.createSocket("udp4");

Listens for message event from sender/server
    socket.on("message", (message, remoteAddress) => {
    console.log(message.toString(), remoteAddress);
    socket.send("Message Received!!", remoteAddress.port, remoteAddress.address);
    });

    // Create an UDP server on Port 4000, and all local IPs
    socket.bind({ port: 4000 }, () => {
    console.log("Listening");
    console.log(socket.address());
