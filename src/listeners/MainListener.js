const { CmdCtx, Listener, Embed } = require('../');

module.exports = class MainListener extends Listener {
  constructor(client) {
    super(client);
    
    this.client = client;
    this.name = 'message';
  };

  async ON(message) {  
    if(!(this.client.database.guilds || this.client.database.users) || message.author.bot) return;    

    const databaseVerify = await this.databaseView(message);
    
    if(databaseVerify) {
      const userDocument = message.author && this.client.database && await this.client.database.users.get(message.author.id, 'patent blacklist');
      const guildDocument = message.guild && this.client.database && await this.client.database.guilds.get(message.guild.id, 'config');

      const guildPrefix = (guildDocument && guildDocument.config.prefix) || process.env.DEFAULT_PREFIX;
      const language = (guildDocument && guildDocument.config.language) || process.env.DEFAULT_LANGUAGE;

      const developer = userDocument.patent.developer;
      const blacklist = userDocument.blacklist;

      const clientMention = message.guild ? message.guild.me.toString() : this.client.user.toString();
      const prefix = message.content.startsWith(clientMention) ? `${clientMention} ` : (message.content.startsWith(guildPrefix) ? guildPrefix : null);  

      if(prefix) {
        const args = message.content.slice(prefix.length).trim().split(' ');
        const name = args.shift();        
        const command = this.client.commands.find(command => command.name === name || command.aliases.includes(name));
        
        if(command) {
          const { aproved, because } = await this.commandVerify({ blacklist, developer }, command);                   

          // if(guildDocument.config.messageDelete && message.guild.me.hasPermission(['MANAGE_MESSAGES'])) message.delete();

          if(!(aproved)) {
            return (() => {
              if(blacklist && because || because) {
                message.channel.send(new Embed(message.author)
                  .setDescription(this.client.language.i18next.getFixedT(language)(
                    because, {
                      emoji: this.client.getEmoji('console').all,
                      user: message.author.username
                    }
                  ))
                ).catch(() => { });
              };
            })();
          };                    
          
          
          const context = new CmdCtx({
            client: this.client,
            message,
            developer: (developer ? developer : false),
            command,
            args,
            language
          });                    

          return command._run(command, context).then(() => {
            this.client.logs.usage(name, message);
            return this.userUtils(message.author)
              .then(() => this.commandUtils(command))
          }).catch(this.client.logError)
        };
      };
    };
  };
};