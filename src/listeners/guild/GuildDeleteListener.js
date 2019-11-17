const { Listener } = require('../../');

module.exports = class GuildDeleteListener extends Listener {
  constructor(client) {
    super(client);

    this.client = client;
    this.name = 'guildDelete'; 
  };

  async ON(guild) {    
    const guildDB = await this.client.database.guilds.verificar(guild.id);
    if(guildDB) await this.client.database.guilds.remove(guild.id);

    this.client.logs.guildDelete(guild)
  };
};