const api = require('../services/Api');
const { Permissions } = require('discord.js');

module.exports = class SessionApi {
  constructor(client, app) {
    this.client = client;
    this.app = app;
  };

  async register() {
    this.app.get('/api/account', async (req, res) => {
      const { token } = req.query;

      if (token) {
        try {                   
          return res.json({
            user: await this._fetchUser(token),
            guilds: await this._fetchGuilds(token)
          });
        } catch (error) {
          res.status(400).json({ error: 'Could not validate user token!' });
        }
      } else {
        res.status(400).json({ error: 'The user token was not provided!' });
      };
    });    

    this.app.get('/api/profile/:userId', async (req, res) => {
      const { userId } = req.params;

      const userDB = await this.client.database.users.get(userId);
      const user = this.client.users.get(userId);

      if(user) {      
        return res.json({
          user: {
            id: userDB._id,
            username: user.username,
            tag: user.tag,
            discriminator: user.discriminator,
            avatar: user.avatar,
            avatarURL: user.avatar ? `https://cdn.discordapp.com/avatars/${userDB._id}/${user.avatar}` : 'https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png',
            status: user.presence.status,
            data: {
              patent: userDB.patent,
              team: userDB.team,
              usedCommands: userDB.usedCommands,
              xp: userDB.xp,
              level: userDB.level,
            },
          },       
        });
      } else {        
        res.status(400).json({ error: 'The provided user identifier is invalid.' })
      };
    });
  };

  async _fetchUser(token) {
    const response = await api('/users/@me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const request = response.data;    

    const userDB = await this.client.database.users.get(request.id);
    const user = this.client.users.get(userDB._id) || this.client.fetchUser(userDB._id);

    const data = {
      id: userDB._id,
      username: user.username,
      tag: user.tag,
      discriminator: user.discriminator,
      avatar: user.avatar,
      avatarURL: user.avatar ? `https://cdn.discordapp.com/avatars/${userDB._id}/${user.avatar}` : 'https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png',
    };

    return data;
  };

  async _fetchGuilds(token) {
    const response = await api('/users/@me/guilds', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = response.data;

    return data
      .filter(g => (
        this.client.guilds.get(g.id) &&
        new Permissions(g.permissions).hasPermissions("MANAGE_GUILD")
      ))
      .map(g => ({
        name: g.name,
        id: g.id,
        iconURL: g.icon ? `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.jpg` : 'https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png',
        common: this.client.guilds.has(g.id),
      }));
  };
};