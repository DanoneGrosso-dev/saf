const { Cmd, Embed } = require("../../");

const moment = require('moment');

module.exports = class BotinfoCommand extends Cmd {
  constructor(name, client) {
    super(name, client);
  
    this.name = 'botinfo';
    this.aliases = [
      'bi',
      'bot',
      'info',
      'saf'
    ];
    this.category = 'bot';    
    this.usage = {
      args: false,
      argsNeed: false,
      argstxt: 'None',
      need: 'None'
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

    return channel.send(new Embed(author)
      .setAuthor(`${this.client.user.username} - ${t('commands:botinfo.authorSubName')}`, this.client.user.avatarURL, `${process.env.WEBSITE_URI}/invite`)
      .setDescription(t('commands:botinfo.description', {
        user: author.username,
        name: this.client.user.username,
        url: process.env.WEBSITE_URI,
        guilds: await this.getGuildsSize(),
        users: await this.getUsersSize(),
        commands: await this.getCommandsUsages(),
        channels: await this.getChnnaelSize(),
      }))
      .addField(t('commands:botinfo.principalInformation.title'), [
        t('commands:botinfo.principalInformation.prefix', {
          emoji: this.client.getEmoji('saf').all,
          prefix: await this.getPrefix(guild)
        }),
        t('commands:botinfo.principalInformation.developer', {
          emoji: this.client.getEmoji('code').all,
          developer: this.client.users.get(process.env.OWNER_ID).tag
        }),
        t('commands:botinfo.principalInformation.upTime', {
          emoji: this.client.getEmoji('robot').all,
          uptime: moment.duration(this.client.uptime).format('D[d]:H[h]:m[m]:s[s]')
        }),
        t('commands:botinfo.principalInformation.createdAt', {
          emoji: this.client.getEmoji('clock').all,
          data: moment(this.client.user.createdAt).format('L')
        })
      ].join('\n'), true)
      .addField(t('commands:botinfo.otherLinks.title'), [
        t('commands:botinfo.otherLinks.invite', {
          emoji: this.client.getEmoji('invite').all,
          id: this.client.user.id,
          permissions: '8',
        }),
        t('commands:botinfo.otherLinks.dashboard', {
          emoji: this.client.getEmoji('module').all,
          url: process.env.WEBSITE_URI,
        }),
        t('commands:botinfo.otherLinks.github', {
          emoji: this.client.getEmoji('github').all
        }),
        t('commands:botinfo.otherLinks.support', {
          emoji: this.client.getEmoji('support').all
        }),
      ].join('\n'), true)
      .setThumbnail(this.client.user.avatarURL)
    );
  };    
};