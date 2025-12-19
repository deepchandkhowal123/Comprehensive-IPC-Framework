const { fork } = require("child_process");

class PipeIPC {
  constructor() {
    this.child = fork("./processes/childPipe.js");
  }

  send(message) {
    this.child.send(message);
  }

  receive(callback) {
    this.child.on("message", callback);
  }
}

module.exports = PipeIPC;
    