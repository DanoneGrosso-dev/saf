const { Cmd, Embed } = require("../../");

const moment = require('moment');

module.exports = class RoleinfoCommand extends Cmd {
  constructor(name, client) {
    super(name, client);
  
    this.name = 'roleinfo';
    this.aliases = [
      'ri',
      'role',
      'cargo'
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
    
    const cargo = (await this.getRole(args, message, guild));

    if(args[0] && cargo) {
      return channel.send(new Embed(author)
        .setDescription([
          t('commands:roleinfo.name', {
            emoji: this.client.getEmoji('rank').all,
            name: cargo.name
          }),
          t('commands:roleinfo.id', {
            emoji: this.client.getEmoji('discord').all,
            id: cargo.id
          }),
          t('commands:roleinfo.position', {
            emoji: this.client.getEmoji('playing').all,
            position: cargo.position
          }),
          t('commands:roleinfo.color', {
            emoji: this.client.getEmoji('emojis').all,
            color: cargo.hexColor
          }),
          t('commands:roleinfo.members', {
            emoji: this.client.getEmoji('users').all,
            membersSize: `[${cargo.members.size}] - (${cargo.members.filter(m => m.user.presence.status !== 'offline').size} Online)`
          }),
          t('commands:roleinfo.createdAt', {
            emoji: this.client.getEmoji('clock').all,
            created: `${moment(cargo.createdAt).format('LLL')} - (${moment(cargo.createdAt).fromNow()})`
          }),
          t('commands:roleinfo.editable.ctx', {
            emoji: this.client.getEmoji('text').all,
            ops: cargo.editable.toString() ? t('commands:roleinfo.editable.yes') : t('commands:roleinfo.editable.no')
          }),
          t('commands:roleinfo.hoist.ctx', {
            emoji: this.client.getEmoji('presence').all,
            ops: cargo.hoist.toString() ? t('commands:roleinfo.hoist.yes') : t('commands:roleinfo.hoist.no')
          })
        ].join('\n'))                                          
        .setColor(cargo.hexColor)
        .setThumbnail(`http://www.singlecolorimage.com/get/${cargo.hexColor.replace('#', '')}/400x400`)
      );
    } else {
      return channel.send(args[0] ? t('commands:roleinfo.noRole', {
        emoji: this.client.getEmoji('console').all,
        user: author.username,
        search: args.join(' ')
      }) : t('commands:roleinfo.noArgs', {
        emoji: this.client.getEmoji('console').all,
        user: author.username
      }));
    };    
  };
};