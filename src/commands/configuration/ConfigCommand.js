const { Cmd, Embed } = require("../../");

module.exports = class ConfigCommand extends Cmd {
  constructor(name, client) {
    super(name, client);
  
    this.name = 'config';
    this.aliases = [
      'cfg',
      'cfgs',
      'configs',
      'settings',
      'dashboard'
    ];
    this.category = 'configuration';    
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
      user: [
        'MANAGE_GUILD'
      ]
    };
  };

  async run({ channel, guild, author }, t) { 
    return channel.send(new Embed(author)
      .setTitle(t('commands:configs.ctx', {
        emoji: this.client.getEmoji('module').all,
      }))
      .setDescription([
        t('commands:configs.description', {
          user: author.tag,
          link: `${process.env.WEBSITE_URI}/dashboard/list`
        })              
      ].join('\n'))
    );
  };
};