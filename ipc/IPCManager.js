class IPCManager {
  constructor(method) {
    this.method = method;
  }
  send(msg) {
    this.method.send(msg);
  }
  receive(cb) {
    this.method.receive(cb);
  }
}
module.exports = IPCManager;
      