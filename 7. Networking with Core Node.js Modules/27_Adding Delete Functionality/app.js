import { createWriteStream, rm } from "fs";
import { open, readdir } from "fs/promises";
import http from "http";
import mime from "mime-types";

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");

  if (req.method === "GET") {
    if (req.url === "/favicon.ico") return res.end("No favicon");
    if (req.url === "/") {
      serveDirectory(req, res);
    } else {
      try {
        const [url, queryString] = req.url.split("?");
        const queryParam = {};
        queryString?.split("&").forEach((pair) => {
          const [key, value] = pair.split("=");
          queryParam[key] = value;
        });

        const fileHandle = await open(`./storage${decodeURIComponent(url)}`);
        const stats = await fileHandle.stat();
        if (stats.isDirectory()) {
          serveDirectory(req, res);
        } else {
          const readStream = fileHandle.createReadStream();
          res.setHeader("Content-Type", mime.contentType(url.slice(1)));
          res.setHeader("Content-Length", stats.size);

          if (queryParam.action === "download") {
            res.setHeader(
              "Content-Disposition",
              `attachment; filename="${url.slice(1)}"`,
            );
          }
          readStream.pipe(res);
        }
      } catch (error) {
        console.log(error.message);
        res.end("Not Found");
      }
    }
  } else if (req.method === "OPTIONS") {
    res.end("OK");
  } else if (req.method === "POST") {
    const filename = req.headers.filename;
    const writeStream = createWriteStream(`./storage/${filename}`);
    req.on("data", (chunk) => {
      writeStream.write(chunk);
    });
    req.on("end", () => {
      writeStream.end();
      res.end("File Uploaded on Server");
    });
  } else if (req.method === "DELETE") {
    req.on("data", async (chunk) => {
      try {
        const filename = chunk.toString();
        await rm(`./storage/${filename}`);
        res.end("File deleted successfully");
      } catch (error) {
        res.end(error.message);
      }
    });
  }
});
async function serveDirectory(req, res) {
  const [url] = req.url.split("?");

  const itemsList = await readdir(`./storage${url}`);
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(itemsList));
}
server.listen(80, "0.0.0.0", () => {
  console.log("Server Started");
});
