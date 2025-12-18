const net = require("net");
const PORT = 9000;

const server = net.createServer(socket => {
  socket.on("data", () => {
    socket.write("ACK");
  });
});

server.on("error", err => {
  if (err.code === "EADDRINUSE") {
    console.log("Socket server already running");
  }
});

server.listen(PORT, () => {
  console.log(`Socket server listening on ${PORT}`);
});

// cd Desktop\Comprehensive-IPC-Framework

// npx electron .

