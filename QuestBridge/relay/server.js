/**
 * Quest -> Spectacles relay + page host (single port, single URL).
 *
 *   GET  /         -> serves QuestBridge/webxr/index.html (open this in Quest Browser)
 *   WS   /quest    -> producer  (the WebXR page streams controller data here)
 *   WS   /specs    -> consumer  (each ControllerHandDriver in the Lens connects here)
 *
 * Every packet from a producer is fanned out to every consumer; drivers filter by hand.
 *
 * Run:    npm install && npm start          (listens on :8080)
 * Expose over wss (required by both Spectacles and WebXR):
 *   ngrok http 8080      -> use the https URL it prints (ws upgrades to wss on it)
 * or deploy this folder to Glitch / Render / Railway / Fly.
 */

const http = require("http");
const fs = require("fs");
const path = require("path");
const { WebSocketServer } = require("ws");

const PORT = process.env.PORT || 8080;
const WEB_DIR = path.join(__dirname, "..", "webxr");
const MIME = { ".html": "text/html", ".js": "application/javascript", ".css": "text/css" };

const server = http.createServer((req, res) => {
  let urlPath = (req.url || "/").split("?")[0];
  if (urlPath === "/") urlPath = "/index.html";
  const filePath = path.join(WEB_DIR, path.normalize(urlPath));
  if (!filePath.startsWith(WEB_DIR)) {
    res.writeHead(403);
    return res.end("forbidden");
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      return res.end("not found");
    }
    res.writeHead(200, { "Content-Type": MIME[path.extname(filePath)] || "application/octet-stream" });
    res.end(data);
  });
});

const wss = new WebSocketServer({ server });
const consumers = new Set(); // Spectacles ControllerHandDriver clients
let producers = 0;
let msgCount = 0;

wss.on("connection", (sock, req) => {
  const isQuest = (req.url || "").includes("quest");
  console.log(`+ ${isQuest ? "quest(producer)" : "specs(consumer)"} connected`);

  if (!isQuest) {
    consumers.add(sock);
    sock.on("close", () => {
      consumers.delete(sock);
      console.log(`- consumer left (${consumers.size} left)`);
    });
    return;
  }

  producers++;
  sock.on("message", (data) => {
    msgCount++;
    const msg = data.toString();
    for (const c of consumers) if (c.readyState === 1) c.send(msg);
  });
  sock.on("close", () => {
    producers--;
    console.log("- producer left");
  });
});

// Heartbeat so you can SEE data flowing from the terminal.
setInterval(() => {
  if (msgCount > 0 || producers > 0) {
    console.log(`… ${(msgCount / 2).toFixed(0)} msg/s  | producers:${producers} consumers:${consumers.size}`);
  }
  msgCount = 0;
}, 2000);

server.listen(PORT, () =>
  console.log(`Bridge on http://localhost:${PORT}  (page: /, producer: /quest, consumer: /specs)`)
);
