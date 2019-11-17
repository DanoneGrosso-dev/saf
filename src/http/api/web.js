module.exports = class WebApi {
  constructor(client, app) {
    this.client = client;
    this.app = app;
  };

  async register() {
    this.app.get('/', (req, res) => {
      res.json({
        guildsSize: this.client.guilds.size
      });
    });
  };
};