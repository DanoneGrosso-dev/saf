const { Cmd } = require("../../");

module.exports = class BassbootCommand extends Cmd {
  constructor(name, client) {
    super(name, client);
  
    this.name = 'bassboot';
    this.aliases = ['bb'];
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
      const playerManager = this.client.playerManager.get(guild.id)
      if(playerManager) {
        playerManager.bassboost(!playerManager.bassboosted);
        
        return channel.send(t(`commands:bassboost.${playerManager.bassboosted}`, {
          emoji: this.client.getEmoji('headphones').all,
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