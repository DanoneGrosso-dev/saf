const api = require('../services/Api');

module.exports = class WebApi {
  constructor(client, app) {
    this.client = client;
    this.app = app;
  };

  async register() {
    this.app.get('/api/config/:guildId/main', async (req, res) => {
      const guildId = req.params.guildId;
      const guild = this.client.guilds.get(guildId);
      const guildDb = await this.client.database.guilds.get(guildId);

      if(guild) {
        return res.json({
          id: guild.id,
          name: guild.name,
          config: {
            prefix: guildDb.config.prefix,
            language: guildDb.config.language,
            logs: {
              on: guildDb.config.logs.on,
              channel: guildDb.config.logs.channel,
            },
          },
        });
      } else {
        res.status(400).json({ error: 'The guild identifier provided is invalid.' })
      };
    });

    this.app.post('/api/config/:guildId/set', async (req, res) => {      
      const { prefix, language, config } = req.body.changedValues;
      const guildId = req.params.guildId;      
      const guild = this.client.guilds.get(guildId);
      const user = await this._getUser(req.body.authData.token);

      if(guild) {        
        await this.client.database.guilds.useFindAndModify(guild.id, {
          config: {
            prefix,
            language,
            config,
          },
        });
        this.client.log(`The admin ${user.tag} (${user.id}) changed my prefix for "${prefix}" in the guild ${guild.name} (${guild.id})`, 'PrefixUpdate');
      } else {
        return;
      }
    });
  };

  async _getUser(token) {
    const response = await api('/users/@me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = response.data;

    const userDB = await this.client.database.users.get(data.id);
    const user = this.client.users.get(userDB._id) || await this.client.fetchUser(userDB._id);

    return user;
  };
};