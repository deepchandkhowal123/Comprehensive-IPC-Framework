const net = require("net");

class SocketIPC {
  send(msg) {
    const client = new net.Socket();
    client.connect(9000, "127.0.0.1", () => {
      client.write(msg);
      client.end();
    });
  }
}
module.exports = SocketIPC;
