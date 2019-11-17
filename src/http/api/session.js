const btoa = require('btoa');
const api = require('../services/Api');

module.exports = class SessionApi {
  constructor(client, app) {
    this.client = client;
    this.app = app;
  };

  async register() {
    this.app.get('/api/login', async (req, res) => {
      const { code } = req.query;

      if (code) {
        try {
          const data = await this._requestDiscord(code);
          const user = await this._getUser(data);
                              
          this.client.logs.logged(user);
          
          return res.json({
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            expiresIn: data.expires_in,
            expiresAt: Date.now() + data.expires_in * 1000,
            tokenType: data.token_type,
            scope: data.scope
          });
        } catch (error) {
          res.status(403).json({ error: 'Could not validate authentication code!' });
        };
      } else {
        res.status(400).json({ error: 'The authentication code was not provided!' });
      };
    });    
  };

  async _getUser(docs) {
    const response = await api('/users/@me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${docs.access_token}`
      }
    });      
    const data = response.data;    

    const userDB = await this.client.database.users.get(data.id);
    const user = this.client.users.get(userDB._id) || this.client.fetchUser(userDB._id);

    return user;
  };

  async _requestDiscord(code) {
    const response = await api(`/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&scope=${process.env.SCOPES}`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${btoa(`${process.env.DISCORD_ID}:${process.env.DISCORD_SECRET}`)}`
      }
    });
    const data = response.data;

    return data;
  };  
};