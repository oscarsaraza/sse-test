import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let clients = [];

const notifyALl = (message) => {
  clients.forEach((client) => {
    client.res.write(`data: new message: ${message} \n\n`);
  });
};

app.get("/event", (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const newClientId = Date.now();

  res.write(`data: new client connected ${newClientId} \n\n`);
  clients.push({ id: newClientId, res });

  req.on("close", () => {
    console.log(`${newClientId} disconnected`);
    clients = clients.filter((client) => client.id !== newClientId);
  });

  notifyALl(`${newClientId} connected`);
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
