module.exports = class Ctx {
  constructor(options = {}) {
    this.client = options.client
    this.message = options.message
    this.developer = options.developer
    this.channel = options.message.channel        
    this.guild = options.message.guild
    this.author = options.message.author
    this.member = options.message.member
    this.mentions = options.message.mentions
    this.command = options.command
    this.voiceChannel = options.message.member.voiceChannel
    this.args = options.args
    this.language = options.language
    this.t = options.client.language.i18next.getFixedT(options.language)
  };
};