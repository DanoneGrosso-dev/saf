const { Cmd, Embed } = require("../../");

const moment = require('moment');

module.exports = class ChannelinfoCommand extends Cmd {
  constructor(name, client) {
    super(name, client);
  
    this.name = 'channelinfo';
    this.aliases = [
      'ci',
      'canal',
      'channelinfo'
    ];
    this.category = 'utils';    
    this.usage = {
      args: true,
      txt: '[mention|ID|name]',
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

  async run({ message, channel, guild, author, args, language }, t) {
    moment.locale(language);
    
    const canal = await this.getChannel(args, message, guild, channel);

    return channel.send(new Embed(author)
      .setDescription([ 
        t('commands:channelinfo.name', {
          emoji: this.client.getEmoji('message').all,
          name: canal.name
        }),
        t('commands:channelinfo.id', {
          emoji: this.client.getEmoji('discord').all,
          id: canal.id
        }),
        t('commands:channelinfo.createdAt', {
          emoji: this.client.getEmoji('clock').all,
          created: moment(canal.createdAt).format('lll')
        }),
        t('commands:channelinfo.position', {
          emoji: this.client.getEmoji('menu').all,
          position: canal.position
        }),
        t('commands:channelinfo.deleted.ctx', {
          emoji: this.client.getEmoji('msg_delete').all,
          deleted: canal.deleted ? t('commands:channelinfo.deleted.yes') : t('commands:channelinfo.deleted.no')
        }),
        t('commands:channelinfo.nsfw.ctx', {
          emoji: this.client.getEmoji('stop').all,
          nsfw: canal.nsfw ? t('commands:channelinfo.nsfw.yes') : t('commands:channelinfo.nsfw.no')
        }),
        t('commands:channelinfo.topic.ctx', {
          emoji: this.client.getEmoji('edit').all,
          topic: canal.topic ? canal.topic : t('commands:channelinfo.topic.noTopic')
        })      
      ].join('\n'))
      .setThumbnail(guild.iconURL ? guild.iconURL : "https://discordapp.com/assets/6debd47ed13483642cf09e832ed0bc1b.png")
    );
  };
};