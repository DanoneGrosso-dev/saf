module.exports = class CmdUtils {
  constructor(client) {
    this.client = client;
  };
  
  getPing() {
    const ping = parseInt(this.client.ping);
    return ping + 'ms';
  };

  getRam() {
    const MemoryHeapUsed = (((process.memoryUsage().heapUsed) / 1024 / 1024).toFixed(2));
    return MemoryHeapUsed + 'mb';
  };
};