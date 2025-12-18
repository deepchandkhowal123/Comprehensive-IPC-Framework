const net = require("net");
const { fork } = require("child_process");

// -------- PIPE IPC --------
function sendPipe(message, callback) {
  const child = fork("./processes/childPipe.js");
  const start = Date.now();

  child.send(message);

  child.on("message", () => {
    const latency = Date.now() - start;
    callback({ ok: true, latency });
    child.kill();
  });
}

// -------- SOCKET IPC --------
function sendSocket(message, callback) {
  const client = new net.Socket();
  const start = Date.now();

  client.connect(9000, "127.0.0.1", () => {
    client.write(message);
  });

  client.on("data", () => {
    const latency = Date.now() - start;
    callback({ ok: true, latency });
    client.end();
  });

  client.on("error", () => {
    callback({ ok: false });
  });
}

module.exports = { sendPipe, sendSocket };
