const { CmdCtx } = require('../');

module.exports = class Message {
  constructor(client) {
    this.client = client;
    this.name = "message";
  };

  async ON(message) {  
    if(!(this.client.database.guilds || this.client.database.users) || message.author.bot) return;
    if(message.channel.type === 'dm') return;

    const client_mention = message.guild ? message.guild.me.toString() : this.client.user.toString();
    const prefix = message.content.startsWith(client_mention) ? `${client_mention} ` : (message.content.startsWith(process.env.CLIENT_PREFIX) ? process.env.CLIENT_PREFIX : null);
    
    if(prefix) {
      const args = message.content.slice(prefix.length).trim().split(' ');
      const name = args.shift();
      const command = this.client.commands.find(command => command.name === name || command.aliases.includes(name));
      if(command) {
        const context = new CmdCtx({ client: this.client, message, command, args });
        return command._run(command, context);
      };
    };
  };
};