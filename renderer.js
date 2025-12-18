const { exec } = require("child_process");
const { sendPipe, sendSocket } = require("./backend-ipc");

const packet = document.getElementById("packet");
const logBox = document.getElementById("log");

let socketStarted = false;
let latencies = [];
let chart = null;

// ---------- LOG ----------
function log(msg) {
  const time = new Date().toLocaleTimeString();
  logBox.textContent += `[${time}] ${msg}\n`;
}

// ---------- SOCKET AUTO START ----------
function ensureSocketServer() {
  if (socketStarted) return;
  exec("node processes/socketServer.js", () => {});
  socketStarted = true;
  log("Socket server started (auto-safe)");
}

// ---------- SEND ----------
function send() {
  const msg = document.getElementById("msg").value;
  const method = document.getElementById("method").value;
  const from = document.getElementById("fromProcess").value;
  const to = document.getElementById("toProcess").value;

  if (!msg) return;
  if (from === to) {
    log("⚠️ Source and destination process cannot be same");
    return;
  }

  packet.style.display = "block";

  let pos = (from === "P1") ? 190 : 650;
  packet.style.left = pos + "px";

  const interval = setInterval(() => {
    pos += (from === "P1") ? 6 : -6;
    packet.style.left = pos + "px";

    if ((from === "P1" && pos > 650) || (from === "P2" && pos < 190)) {
      clearInterval(interval);
      packet.style.display = "none";

      if (method === "Named Pipe") {
        sendPipe(msg, (res) => onReply(res, from, to));
      } else {
        ensureSocketServer();
        setTimeout(() => sendSocket(msg, (res) => onReply(res, from, to)), 300);
      }
    }
  }, 10);
}

// ---------- RESPONSE ----------
function onReply(res, from, to) {
  if (!res.ok) {
    log("Socket server not running");
    return;
  }

  latencies.push(res.latency);
  log(`Reply received (${from} → ${to}) | Latency = ${res.latency} ms`);
  updateLatencyGraph();
}

// ---------- GRAPH ----------
function updateLatencyGraph() {
  const ctx = document.getElementById("latencyChart").getContext("2d");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: latencies.map((_, i) => i + 1),
      datasets: [{
        label: "Latency (ms)",
        data: latencies,
        borderWidth: 2,
        tension: 0.3
      }]
    },
    options: {
      responsive: false,
      scales: {
        x: { title: { display: true, text: "Message Count" } },
        y: { title: { display: true, text: "Latency (ms)" } }
      }
    }
  });
}

// ---------- RESET ----------
function reset() {
  logBox.textContent = "";
  latencies = [];
  if (chart) chart.destroy();
  log("Visualization reset");
}
