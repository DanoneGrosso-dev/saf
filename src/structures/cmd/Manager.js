module.exports = class Manager {
  constructor(client) {
    this.client = client;
  };
    
  getPingWebSocket() {
    const websocket = parseInt(this.client.ping);
    return websocket + 'ms';
  };  

  async getPingMongoose() {    
    const init = Date.now();
    await this.client.database.mongoose.connection.db.admin().ping();
    const mongoose = Date.now() - init;

    return mongoose + 'ms';
  };

  async getPrefix(guild) {
    const guildDocument = guild && this.client.database.guilds && await this.client.database.guilds.get(guild.id, 'config');
    const guildPrefix = (guildDocument && guildDocument.config.prefix) || process.env.DEFAULT_PREFIX;
    
    return guildPrefix;
  };

  async getLanguage(guild) {
    const guildDocument = guild && this.client.database.guilds && await this.client.database.guilds.get(guild.id, 'config');
    const guildLang = (guildDocument && guildDocument.config.language) || process.env.DEFAULT_LANGUAGE;
    
    return guildLang;
  };

  getGuildsSize() {
    return Number(this.client.guilds.size).toLocaleString();
  };

  getUsersSize() {
    return Number(this.client.users.size).toLocaleString();
  };

  getCommandsSize() {
    return Number(this.client.commands.size).toLocaleString();
  };

  async getCommandsUsages() {
    const commandsDocument = await this.client.database.commands.findAll();
    const usages = commandsDocument.map(c => c.usages).reduce((prev, val) => prev + val, 0);

    return Number(usages).toLocaleString()
  };

  getChnnaelSize() {
    return Number(this.client.channels.size).toLocaleString()
  };
};