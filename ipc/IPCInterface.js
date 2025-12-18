class IPCInterface {
  send(message) {
    throw new Error("send() not implemented");
  }
  receive(callback) {
    throw new Error("receive() not implemented");
  }
}
module.exports = IPCInterface;
