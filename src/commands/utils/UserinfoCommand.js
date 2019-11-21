const { Cmd, Embed } = require("../../");

const moment = require('moment');

module.exports = class UserinfoCommand extends Cmd {
  constructor(name, client) {
    super(name, client);
  
    this.name = 'serverinfo';
    this.aliases = [
      'ui',
      'user',
      'person',
      'people'
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
    
    const user = await this.getUser(args, message, guild, author, true)
    const { usedCommands } = await this.client.database.users.get(user.id)

    const statusColors = {
      "online": "#43b581",
      "dnd": "#f04747",
      "idle": "#faa61a",
      "offline": "#747f8d",
      "streaming": "#593695"
    };

    return channel.send(new Embed(author)
      .setAuthor(user.username, user.avatarURL ? user.avatarURL : user.displayAvatarURL)
      .setDescription([
        t('commands:userinfo.name', {
          emoji: this.client.getEmoji('user').all,
          name: user.username
        }),
        t('commands:userinfo.presenceStatus.ctx', {
          emoji: this.client.getEmoji('presence').all,
          presenceStatus: t(`commands:userinfo.presenceStatus.${user.presence.status}`)
        }),
        t('commands:userinfo.id', {
          emoji: this.client.getEmoji('discord').all,
          id: user.id
        }),
        t('commands:userinfo.presenceGame.ctx', {
          emoji: this.client.getEmoji('playing').all,
          presenceGame: user.presence.game ? `\`${user.presence.game}\`` : t('commands:userinfo.presenceGame.none')
        }),
        t('commands:userinfo.nickName.ctx', {
          emoji: this.client.getEmoji('edit').all,
          nickName: message.guild.member(user.id).nickname ? message.guild.member(user.id).nickname : t('commands:userinfo.nickName.none')
        }),
        t('commands:userinfo.createdAt', {
          emoji: this.client.getEmoji('clock').all,
          created: `${moment(user.createdAt).format('LL')} - (${moment(user.createdAt).fromNow()})`
        }),
        t('commands:userinfo.joinedAt', {
          emoji: this.client.getEmoji('server').all,
          joined: `${moment(user.joinedAt).format('LL')}`
        }),
        t('commands:userinfo.commandsUsed', {
          emoji: this.client.getEmoji('commandRun').all,
          commands: Number(usedCommands).toLocaleString()
        }),
        t('commands:userinfo.bot.ctx', {
          emoji: this.client.getEmoji('robot').all,
          bot: user.bot ? t('commands:userinfo.bot.yes') : t('commands:userinfo.bot.no')
        })
      ].join('\n'))
      .setColor(statusColors[user.presence.status])
      .setThumbnail(user.avatarURL ? user.avatarURL : user.displayAvatarURL)
    );
  };
};