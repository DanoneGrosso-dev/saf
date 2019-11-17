const { Cmd, Embed } = require("../../");

module.exports = class BanCommand extends Cmd {
  constructor(name, client) {
    super(name, client);
  
    this.name = 'ban';
    this.aliases = ['banir'];
    this.category = 'moderation';    
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
      client: [
        'BAN_MEMBERS'
      ],
      user: [
        'BAN_MEMBERS'
      ]
    };
  };

  async run({ channel, mentions, guild, member, author, args }, t) {
    const person = mentions.members.first() 
      ? mentions.members.first() : guild.members.get(args[0]) 
      ? guild.members.get(args[0]) : guild.members.find(user => user.user.username === args[0])
      ? guild.members.find(user => user.user.username === args[0]) : guild.members.find(user => user.user.tag === args[0]) 
      ? guild.members.find(user => user.user.tag === args[0]) : false;

    const reason = args[1] 
      ? args.slice(1).join(' ') : t('commands:ban.notReason');

    if(!args[0]) {
      return channel.send(t('commands:ban.noArgs', {
        emoji: this.client.getEmoji('user').all,
        user: author.username
      }));
    };

    if(!person) {
      return channel.send(t('commands:ban.noArgs', {
        emoji: this.client.getEmoji('user').all,
        user: author.username
      }));
    };

    if(member.highestRole.position <= person.highestRole.position && guild.owner.id !== author.id) {
      return channel.send(t('commands:ban.topRole', {
        emoji: this.client.getEmoji('console').all,
        user: author.username
      }));
    };

    if(!person.bannable) {
      return channel.send(t('commands:ban.notBannable', {
        emoji: this.client.getEmoji('console').all,
        user: author.username
      }));
    };

    // await person.ban(reason);
    channel.send(new Embed(author)
      .setDescription(t('commands:ban.banned', {
        emoji1: this.client.getEmoji('policeman').all,
        target: person.user.tag,
        user: author.username,
        emoji2: this.client.getEmoji('right').all,
        reason: reason
      }))
    );    
  };
};