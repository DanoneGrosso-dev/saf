const { Cmd, Embed } = require("../../");

module.exports = class PingCommand extends Cmd {
  constructor(name, client) {
    super(name, client);
  
    this.name = 'ping';
    this.aliases = ['pin'];
    this.category = 'bot';    
    this.usage = {
      args: false,      
      txt: 'None',
      need: '{prefix}{cmd} {args}',
    };
    this.requirements = {
      ownerOnly: false,
      guildOnly: true
    };
    this.permissions = {
      client: [],
      user: []
    };
  };

  async run({ channel, message }, t) {        
    await channel.send( new Embed()
      .setDescription(t('commands:ping', {
        emoji1: this.client.getEmoji('message').all,
        latencyMessage: parseInt(new Date() - message.createdAt),
        emoji2: this.client.getEmoji('discord').all,
        latencyDiscord: await this.getPingWebSocket(),
        emoji3: this.client.getEmoji('server').all,
        latencyMongoose: await this.getPingMongoose(),
      }))      
    );
  };
};