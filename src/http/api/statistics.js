const i18next = require('i18next');

module.exports = class StatisticsApi {
  constructor(client, app) {
    this.client = client;
    this.app = app;
  };

  async register() {
    this.app.get('/api/statistics', async (req, res) => {
      const commandsDocument = await this.client.database.commands.findAll();
      const usages = commandsDocument.map(c => c.usages).reduce((prev, val) => prev + val, 0);

      res.json({                        
        serverCount: Number(this.client.guilds.size).toLocaleString(),
        userCount: this.client.users.size,
        channelsCount: this.client.channels.size,
        uptime: process.uptime() * 1000,
        commandCount: this.client.commands.size,
        commandUsed: usages,
        languageCount: Object.keys(i18next.store.data).length
      });
    });
  };
};