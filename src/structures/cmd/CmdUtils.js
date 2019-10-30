module.exports = class CmdUtils {
  constructor(client) {
    this.client = client;
  };
  
  getPing() {
    const ping = parseInt(this.client.ping);
    return ping + 'ms';
  };
};