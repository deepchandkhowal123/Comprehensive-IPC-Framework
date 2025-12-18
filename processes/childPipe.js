process.on("message", msg => {
  console.log("👶 Child:", msg);
  process.send("ACK → " + msg);
});
