const { GuildPlayer } = require("./structures");

const { PlayerManager } = require("discord.js-lavalink");
const fetch = require("node-fetch");

const DEFAULT_JOIN_OPTIONS = {
  "selfdeaf": true
};

const defaultRegions = {
  "asia": [
    "sydney",
    "singapore",
    "japan",
    "hongkong"
  ],
  "eu": [
    "london",
    "frankfurt",
    "amsterdam",
    "russia",
    "eu-central",
    "eu-west",
    "southafrica"
  ],
  "us": [
    "us-central",
    "us-west",
    "us-east",
    "us-south"
  ],
  "sam": [
    'brazil'
  ]
};

const resolveRegion = (region) => {
  region = region.replace('vip-', '');

  const dRegion = Object.entries(defaultRegions).find(([ , r ]) => r.includes(region));
  
  return dRegion && dRegion[0];
};

module.exports = class SafPlayerManager extends PlayerManager {
  constructor (client, nodes = [], options = {}) {
    options.player = GuildPlayer;

    super(client, nodes, options);

    this.address = `${nodes[0].host}:${nodes[0].port}`;
    this.password = nodes[0].password;
  };


  async fetchTracks (identifier) {
    const params = new URLSearchParams();

    params.append('identifier', identifier);

    return await fetch(`http://${this.address}/loadtracks?${params.toString()}`, { headers: { Authorization: this.password } })
      .then(res => res.json())
      .then(data => data.tracks)
      .catch(err => {
        this.client.Error(err);
      });
  };  

  async play (song, message) {
    const host = this.getIdealHost(message.guild.region);
    const songs = await this.fetchTracks(`ytsearch:${song}`);
    const player = this.join({
      guild: message.guild.id,
      channel: message.member.voiceChannel.id,
      host: host
    }, DEFAULT_JOIN_OPTIONS)
      
    player.play(songs[0])
    return songs[0].info
  };

  getIdealHost (region) {
    region = resolveRegion(region);

    const { host } = (region && this.nodes.find(n => n.ready && n.region === region)) || this.nodes.first();

    return host;
  }
};