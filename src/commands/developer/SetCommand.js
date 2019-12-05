const { Cmd, Embed } = require("../../");

module.exports = class SetCommand extends Cmd {
  constructor(name, client) {
    super(name, client);
  
    this.name = 'set';
    this.aliases = [];
    this.category = 'developer';    
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

  async run({ channel, args }, t) { 
    // if(!args.slice(0).join(' ') < 1) {
    //   return channel.send('add, remoe, list?');
    // };

    const user = message.mentions.users.find(f => f.id === 'Zev#8260'.replace(/(<#>)/g, ''))

  };
};