const CmdUtils = require("./CmdUtils");

module.exports = class Cmd extends CmdUtils {
  constructor(name, client) {
    super(name, client);

    this.name = name;
    this.client = client;
    this.aliases = [];

    this.category = "No category";    
    this.ownerOnly = false;
  };

  async _run(command, context, { channel, author, t } = context) {
    try{
      if(this.ownerOnly){
        if(!this.client.owner.includes(author.id)) {
          return channel.send('not').then(last => last.delete(4000))
        };
      };

      return await command.run(context, t)
    } catch (error) {
      return this.client.logError(error, 'RunCommand')      
    };
  };
};