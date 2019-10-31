const { Cmd } = require("../../");

module.exports = class PingCommand extends Cmd {
  constructor(name, client) {
    super(name, client);
  
    this.name = "ping";
    this.aliases = ['pin'];
  };

  async run({ channel }, t) {    
    channel.send(t('commands:ping', { ms: await this.getPing() }))
  };
};