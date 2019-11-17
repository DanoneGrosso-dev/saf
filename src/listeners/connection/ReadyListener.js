const { Listener } = require('../../');

const PlayerManager = require("../../music/SafPlayerManager");

module.exports = class ReadyListener extends Listener {
  constructor(client) {
    super(client);

    this.client = client;
    this.name = 'ready';    
  };
  
  async ON() {       
    this.client.playerManager = new PlayerManager(this.client, JSON.parse(process.env.LAVALINK_NODES), { user: this.client.user.id, shards: 1 });
  };
};