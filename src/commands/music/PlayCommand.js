const { Cmd, Embed } = require("../../");

module.exports = class PlayCommand extends Cmd {
  constructor(name, client) {
    super(name, client);
  
    this.name = 'play';
    this.aliases = ['tocar', 'p'];
    this.category = 'music';    
    this.usage = {
      args: true,      
      txt: '[nome/URL]',
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

  async run({ message, voiceChannel, channel, guild, author, args }, t) {
    const trueResult = await this.verifyVoiceChannel(guild, channel, author, voiceChannel, t, true);
    if(trueResult) {
      const track = args.join(' ');
      if(track) {
        if(this.client.playerManager.has(guild.id)) {
          this.client.playerManager.play(track, message).then(player => {
            channel.send(t('music:addedToQueue', {
              emoji: this.client.getEmoji('play').all,              
              track: player.title,
            }))
          })
        } else {
          // channel.send(new Embed().setColor('faa61a').setDescription(t('commands:play.warning', {
          //   emoji: this.client.getEmoji('console').all
          // })))
          this.client.playerManager.play(track, message).then(player => {
            channel.send(t('music:playingNow', {
              emoji: this.client.getEmoji('play').all,              
              track: player.title
            }));
          });
        };
      } else {
        return channel.send(t('commands:play.noArgs', {
          emoji: this.client.getEmoji('console').all,
          user: author.username
        }));
      };      
    };
  };
};