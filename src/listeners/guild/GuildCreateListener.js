const { Listener } = require('../../');

module.exports = class GuildCreateListener extends Listener {
  constructor(client) {
    super(client);

    this.client = client;
    this.name = 'guildCreate'; 
  };

  async ON(guild) {
    const guildDB = await this.client.database.guilds.verificar(guild.id);
    
    if(!guildDB) await this.client.database.guilds.add({
      _id: guild.id,
      prefix: process.env.DEFAULT_PREFIX,
    });

    this.client.logs.guildCreate(guild)
  };
};