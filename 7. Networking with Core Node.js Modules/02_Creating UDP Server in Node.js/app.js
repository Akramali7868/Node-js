import dgram from "node:dgram"; // UDP

const socket = dgram.createSocket("udp4");

socket.on("message", (message, remoteAddress) => {
  console.log(message.toString());
  console.log(remoteAddress);

  socket.send(
    "message Received Successfully on server",
    remoteAddress.port,
    remoteAddress.address,
  );
});

socket.bind({ port: 4000 }, () => {
  const address = socket.address();
  console.log(`listening on port ${address.port}`);
});
