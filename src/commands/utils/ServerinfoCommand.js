const { Cmd, Embed } = require("../../");

const moment = require('moment');

module.exports = class ServerinfoCommand extends Cmd {
  constructor(name, client) {
    super(name, client);
  
    this.name = 'serverinfo';
    this.aliases = [
      'si',
      'server',
      'guild',
      'servidor',
      'guilda'
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

  async run({ channel, guild, author, language }, t) {
    moment.locale(language);
    
    const noIcon = "https://discordapp.com/assets/6debd47ed13483642cf09e832ed0bc1b.png";

    return channel.send(new Embed(author)
      .setAuthor(guild.name, guild.iconURL ? guild.iconURL : noIcon)
      .setDescription([
        t('commands:serverinfo.name', {
          emoji: this.client.getEmoji('server').all,
          name: guild.name,
          id: guild.id
        }),
        t('commands:serverinfo.region.ctx', {
          emoji: this.client.getEmoji('world').all,
          region: t(`commands:serverinfo.region.${guild.region}`)
        }),
        t('commands:serverinfo.owner', {
          emoji: this.client.getEmoji('crown').all,
          owner: guild.owner.id
        }),
        `${t('commands:serverinfo.emojis', {
          emoji: this.client.getEmoji('emojis').all,
          emojis: guild.emojis.size
        })} │ ${t('commands:serverinfo.roles', {
          emoji: this.client.getEmoji('foldeEdit').all,
          roles: guild.roles.size
        })}`,
        this.channelsSize(guild, t),
        this.membersSize(guild, t),
        this.membersStatus(guild, t),
        t('commands:serverinfo.createdAt', {
          emoji: this.client.getEmoji('clock').all,
          created: `${moment(guild.createdAt).format('LLL')} - (${moment(guild.createdAt).fromNow()})`
        })
      ].join('\n'))
      .setThumbnail(guild.iconURL ? guild.iconURL : noIcon)
      .setFooter(t('commands:serverinfo.footer', {
        guildName: guild.name
      }))
    );
  };

  channelsSize(guild, t) {
    const category = (guild.channels.filter(c => c.type === 'category').size);
    const text = (guild.channels.filter(c => c.type === 'text').size);
    const voice = (guild.channels.filter(c => c.type === 'voice').size);

    return `${t('commands:serverinfo.channels.category', {
      emoji: this.client.getEmoji('menu').all,
      categories: category
    })} │ ${t('commands:serverinfo.channels.text', {
      emoji: this.client.getEmoji('text').all,
      texts: text
    })} │ ${t('commands:serverinfo.channels.voice', {
      emoji: this.client.getEmoji('headphones').all,
      voices: voice
    })} │ ${t('commands:serverinfo.channels.size', {
      emoji: this.client.getEmoji('chats').all,
      size: text+voice
    })}`;
  };

  membersSize(guild, t) {
    const users = guild.memberCount - guild.members.filter(u => u.user.bot).size;
    const bots = guild.members.filter(u => u.user.bot).size;    

    return `${t('commands:serverinfo.members.ctx', {
      emoji: this.client.getEmoji('memberJoin').all,
    })} ${t('commands:serverinfo.members.users', {
      emoji: this.client.getEmoji('user').all,
      users: users
    })} │ ${t('commands:serverinfo.members.bots', {
      emoji: this.client.getEmoji('robot').all,
      bots: bots
    })} │ ${t('commands:serverinfo.members.size', {
      emoji: this.client.getEmoji('users').all,
      size: users+bots
    })}`;
  };

  membersStatus(guild, t) {
    const online = guild.members.filter(u => u.presence.status == 'online').size;
    const dnd = guild.members.filter(u => u.presence.status == 'dnd').size;
    const stream = guild.members.filter(u => u.presence.status == 'dnd').size;
    const idle = guild.members.filter(u => u.presence.status == 'idle').size;
    const offline = guild.members.filter(u => u.presence.status == 'offline').size;

    return t('commands:serverinfo.status', {
      emoji: this.client.getEmoji('presence').all,
      status: `${this.client.getEmoji('online').all} \`${online}\` │ ${this.client.getEmoji('dnd').all} \`${dnd}\` │ ${this.client.getEmoji('streaming').all} \`${stream}\` │ ${this.client.getEmoji('idle').all} \`${idle}\` │ ${this.client.getEmoji('offline').all} \`${offline}\``
    });
  };
};