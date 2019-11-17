const Verify = require("./Verify");

module.exports = class Cmd extends Verify {
  constructor(name, client) {
    super(name, client);

    this.name = name;
    this.client = client;
    this.aliases = [];
    this.category = null;    
    this.usage = {
      args: false,      
      txt: 'None',
      need: '{prefix}{cmd} {args}',
    };
    this.requirements = {
      ownerOnly: false,
      guildOnly: false,
    };
    this.permissions = {
      client: [
        'SEND_MESSAGES',
        'USE_EXTERNAL_EMOJIS'
      ],
      user: []
    };    
  };

  async _run(command, context, { channel, guild, author, t } = context) {
    try {
      if (channel.type === "dm" || (guild && channel.permissionsFor(this.client.user).has('SEND_MESSAGES'))) {
        if(this.requirements.guildOnly && !guild) {
          return channel.send(t('errors:guildOnly', {
            emoji: this.client.getEmoji('error').all,
            user: author.username
          })).then(last => last.delete(10000));
        };

        if(this.requirements.ownerOnly && !process.env.OWNER_ID.includes(author.id)) {
          return channel.send(t('errors:ownerOnly', {
            emoji: this.client.getEmoji('error').all,
            user: author.username
          }));
        };

        return await this.cmdVerify(command, context);
      } else {
        return context = null;
      }
    } catch (e) {
      this.client.logError(e, 'RunCommand')  
      return channel.send(t('errors:commandError', {
        emoji: this.client.getEmoji('error').all,
        user: author.username,
        type: e.message
      }));
    };       
  };  
};