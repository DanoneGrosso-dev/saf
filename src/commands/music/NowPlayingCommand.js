const { Cmd } = require("../../");

module.exports = class NowPlayingCommand extends Cmd {
  constructor(name, client) {
    super(name, client);
  
    this.name = 'nowplaying';
    this.aliases = ['tocandoagora', 'np'];
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
      const playerManager = this.client.playerManager.get(guild.id);
      if(playerManager) {
        if(playerManager.paused) {        
          return channel.send(t('music:paused', {
            emoji: this.client.getEmoji('console').all,
            user: author.username
          }));
        };

        return channel.send(t('commands:nowPlaying', {
          emoji: this.client.getEmoji('play').all,
          track: playerManager.playingSong.info.title
        }))
      } else {
        return channel.send(t('music:notPlaying', {
          emoji: this.client.getEmoji('console').all,
          user: author.username
        }));
      };
    };
  };
};