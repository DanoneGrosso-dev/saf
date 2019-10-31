module.exports = class CmdCtx {
  constructor(options = {}) {
    this.client = options.client;
    this.message = options.message;
    this.channel = options.message.channel;
    this.guild = options.message.guild;
    this.author = options.message.author;
    this.member = options.message.member;
    this.command = options.command;
    this.args = options.args;
    this.language = options.language;
    this.t = options.client.language.i18next.getFixedT(options.language);
  };
};