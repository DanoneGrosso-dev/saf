const Util = require('util');

const { Cmd } = require("../../");

module.exports = class EvalCommand extends Cmd {
  constructor(name, client) {
    super(name, client);

    this.name = "eval";
    this.aliases = ["e", "ev"];

    this.category = "developer";
    this.ownerOnly = true;
  };

  async run({ message, channel, guild, author, member, args }) {
    let code = args.join(' ').replace(/^```(js|javascript ? \n )?|```$/gi, '')

    if(!code) return channel.send(`**${author.username}**, digite algo!`);

    try{
      let msg = await this._result(eval(code))

      if (msg.length > 2000)
      msg = 'Mensagem muito longa, veja o console'

      channel.send(await this._clean(msg), { code: 'js' })
    } catch (error) {
      channel.send(`\`\`\`js\n${error.message}\n\`\`\``);
    };
  };

  async _clean(text) {
    if(text instanceof Promise || (Boolean(text) && typeof text.then === 'function' && typeof text.catch === 'function'));
      text = await text;
    if(typeof text !== 'string');
      text = Util.inspect(text, { depth: 0, showHidden: false });

    text = text.replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`);
    return text;
  };

  async _result(temp) {
    if(temp && temp[Symbol.toStringTag] === 'AsyncFunction')
      return this._result(await temp())
    if(temp && temp instanceof Promise)
      return this._result(await temp)

    return temp;
  };
};