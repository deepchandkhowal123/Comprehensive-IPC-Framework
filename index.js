const IPCManager = require("./ipc/IPCManager");
const PipeIPC = require("./ipc/PipeIPC");
const SocketIPC = require("./ipc/SocketIPC");

console.log("🚀 IPC Framework Started");

// Pipe IPC
const pipe = new IPCManager(new PipeIPC());
pipe.receive(msg => console.log("📥 Parent:", msg));
pipe.send("Hello Pipe");

// Socket IPC
const socket = new IPCManager(new SocketIPC());
setTimeout(() => {
  socket.send("Hello Socket");
}, 2000);
