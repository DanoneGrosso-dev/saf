const { Listener } = require('../../');

module.exports = class WebSocketErrorListener extends Listener {
  constructor(client) {
    super(client);

    this.client = client;
    this.name = 'error';    
  };

  async ON(error) {
    this.client.logError(error);
    process.exit(1);
  };
};