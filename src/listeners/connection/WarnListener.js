const { Listener } = require('../../');

module.exports = class WarnListener extends Listener {
  constructor(client) {
    super(client);

    this.client = client;
    this.name = 'warn';    
  };

  async ON(warn) {
    this.client.logError(warn);
  };
};