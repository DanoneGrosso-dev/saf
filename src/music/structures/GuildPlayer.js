const { Collection } = require("discord.js");
const { Player } = require("discord.js-lavalink");
const moment = require("moment");

module.exports = class GuildPlayer extends Player {
  constructor (options = {}) {
    super(options);

    this.queue = [];
    this._volume = 50;
    this._loop = false;
    this.previousVolume = null;
    this._bassboost = false;
    this._listening = new Collection();
    this.on('end', ({ reason }) => {      
      console.log(`\x1b[94m[Lavalink]\x1b[0m \x1b[34mThe music stopped for the reason: ${reason}\x1b[0m`)
      switch(reason) {
        case'FINISHED':
          this.next()
          break;
        case'STOPPED':
          this.next()          
          break;
        case'REPLACED':
      };
    });

    this.on('stop', () => {
      console.log("\x1b[94m[Lavalink]\x1b[0m \x1b[34mStop Event invoked!\x1b[0m");
      this.playingSong = null;
      this.manager.leave(this.id);      
    });
  };

  play(song, forcePlay = false, options = {}) {
    if (this.playing && !forcePlay) {
      this.addToQueue(song);
      return false;
    };
    
    super.play(song.track, options);
    this.playingSong = song;
    this.volume(this._volume);
    this.emit('start');
    return true;
  };

  addToQueue(song) {
    this.queue.push(song)
  }
  stop () {
    this.queue = []
    this._listening.clear()
    this.emit('stop')
    super.stop()
  }

  next (user) {
    if (this._loop) this.queueTrack(this.playingSong, true)
    const nextSong = this.queue.shift()
    if (nextSong) {
      this.play(nextSong, true)
      this.updateListening()
      this.updateNowPlaying()
      return nextSong
    } else {
      super.stop()
      this.emit('stop', user)
    }
  }

   // Queue
  get nextSong () {
    return this.queue[0]
  }

  queueTrack (song, silent = false) {
    this.queueTracks([ song ], silent)
    return song
  }

  queueTracks (songs, silent = false) {
    this.queue.push(...songs)
    if (!silent) songs.forEach(s => s.emit('queue'))
    return songs
  }

  clearQueue () {
    return this.queue.splice(0)
  }

  shuffleQueue () {
    this.queue = this.queue.sort(() => Math.random() > 0.5 ? -1 : 1)
  }

  removeFromQueue (index) {
    if (index < 0 || index >= this.queue.length) throw new Error('INDEX_OUT_OF_BOUNDS')
    return this.queue.splice(index, 1)[0]
  }

  jumpToIndex (index, ignoreLoop = false) {
    if (index < 0 || index >= this.queue.length) throw new Error('INDEX_OUT_OF_BOUNDS')

    const songs = this.queue.splice(0, index + 1)
    const song = songs.pop()
    if (!ignoreLoop && this._loop) this.queueTracks([ this.playingSong, ...songs ])
    this.play(song, true)

    return song
  }

  // Volume

  volume (volume = 50) {
    this._volume = volume
    super.volume(volume)
  }

  get bassboosted () {
    return this._bassboost
  }

  bassboost (state = true) {
    this._bassboost = state
    if (state) {
      this._previousVolume = this._volume
      this.setEQ(Array(6).fill(0).map((n, i) => ({ band: i, gain: 1 })))
      return true
    }

    if (this._previousVolume !== null) this.volume(this._previousVolume)
    this.setEQ(Array(6).fill(0).map((n, i) => ({ band: i, gain: 0 })))
    return false
  }

  get looping () {
    return this._loop
  }

  loop (loop = true) {
    this._loop = !!loop
  }

  // Helpers

  get formattedElapsed () {
    if (!this.playingSong || this.playingSong.isStream) return ''
    return moment.duration(this.state.position).format('hh:mm:ss', { stopTrim: 'm' })
  }

  get voiceChannel () {
    return this.client.channels.get(this.channel)
  }

  // Internal
  
  setEQ (bands) {
    this.node.send({
      op: 'equalizer',
      guildId: this.id,
      bands
    })
    return this
  }
  
    updateListening () {
    this._listening.forEach(({ scrobblePercent }, k) => this._listening.set(k, { join: new Date(), scrobblePercent }))
  }
  // Last.fm
  async getAbleToScrobble () {
    if (this.playingSong.isSteam) return []
    const map = this._listening.map(async (s, u) => {
      const connections = await this.client.modules.connection.getConnections(u)
      const user = { id: u, config: s }
      return { user, lastfm: connections.find(c => c.name === 'lastfm') }
    })
    const promise = await Promise.all(map)
      .then(conns => conns.filter(({ lastfm }) => lastfm ? lastfm.config.scrobbling : false))
    return promise
  }

  async updateNowPlaying () {
    const ableToUpdate = await this.getAbleToScrobble()
    ableToUpdate.forEach(({ lastfm }) => this.client.apis.lastfm.updateNowPlaying(this.playingSong, lastfm.tokens.sk))
  }

  async scrobbleSong (song) {
    const ableToScrobble = await this.getAbleToScrobble()
    const canScrobble2 = ableToScrobble.map(o => ({
      ...o,
      listenedPercent: (100 * (new Date() - o.user.config.join)) / song.length
    }))
    canScrobble2.filter(p => p.listenedPercent >= p.user.config.scrobblePercent).forEach(({ lastfm, user }) => {
      this.client.apis.lastfm.scrobbleSong(song, user.config.join, lastfm.tokens.sk)
    })
  }
  
}