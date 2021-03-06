const Util = require('util');

const { Cmd } = require("../../");

module.exports = class EvalCommand extends Cmd {
  constructor(name, client) {
    super(name, client);

    this.name = 'eval';
    this.aliases = [
      'e',
      'ev'
    ];
    this.category = 'developer';    
    this.usage = {
      args: false,      
      txt: 'None',
      need: '{prefix}{cmd} {args}',
    };
    this.requirements = {
      ownerOnly: true,
      guildOnly: true
    };
    this.permissions = {
      client: [],
      user: []
    };
  };

  async run({ message, channel, guild, author, member, mentions, args, language }, t) {
    let code = args.join(' ').replace(/^```(js|javascript ? \n )?|```$/gi, '')

    if(!code) return channel.send(t('commands:eval.noArgs', {
      emoji: this.client.getEmoji('error').all,
      user: author.username,
    }));

    try{
      let msg = await this._result(eval(code))

      // if (msg.length > 2000)
      // msg = t('commands:eval.viewConsole')      

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