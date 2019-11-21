const { Cmd } = require("../../");

module.exports = class StopCommand extends Cmd {
  constructor(name, client) {
    super(name, client);
  
    this.name = 'stop';
    this.aliases = [
      'parar',
      'st'
    ];
    this.category = 'music';    
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

  async run({ voiceChannel, channel, guild, author, args }, t) {
    const trueResult = await this.verifyVoiceChannel(guild, channel, author, voiceChannel, t, true);
    if(trueResult) {
      if(this.client.playerManager.has(guild.id)) {
        this.client.playerManager.get(guild.id).next()
        
        return channel.send(t('music:stopped', {
          emoji: this.client.getEmoji('console').all
        }));
      } else {
        return channel.send(t('music:notPlaying', {
          emoji: this.client.getEmoji('console').all,
          user: author.username
        }))
      };    
    };
  };
};