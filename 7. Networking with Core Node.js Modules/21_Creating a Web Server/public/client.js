import http from "http";

const clientRequest = http.request({
  method: "post",
  hostname: "192.168.0.210",
  port: 4000,
});
clientRequest.write("Hi I am client");

clientRequest.on("response", (response) => {
  response.on("data", (chunk) => {
    console.log(chunk.toString());
  });
});
