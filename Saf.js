const Dc = require("discord.js");
const Fs = require("fs");

const Modules = require("./src/modules");

require("dotenv").config();

module.exports = class SafClient extends Dc.Client {
  constructor(options = {}) {
    super(options);

    this.owner = process.env.OWNER_ID
    this.commands = new Dc.Collection();

    this.initializeModules();
    this.initalizeCommands('./src/commands');
    this.initalizeListeners('./src/listeners');
  };

  async start(token = process.env.CLIENT_TOKEN) {    
    await super.login(token).then(() => this.log("Connected in Discord successfully.", "Discord"));
  };

  log(...args) {
    const argument = ` \x1b[34m${args[0]}\x1b[0m`;
    const tags = `\x1b[94m${args.map(t => `[${t}]`).slice(1).join(' ')}\x1b[0m`;
    const log = (args.length > 1 ? tags : '');
    console.log(log + argument)  };

  logError(...args) {
    const msg = `\x1b[31m${args[0]}\x1b[0m`;
    const tags = args.slice(1).map(t => `\x1b[91m[${t}]\x1b[0m`);
    const log = (args.length > 1 ? tags : '');
    console.error('\x1b[91m[Error]\x1b[0m', ...log, msg);
  };
    
  Error(error) {
    throw new Error(error);
  };

  async initializeModules() {
    for (let name in Modules) {
      const loader = new Modules[name](this);
      let success = false;
      try {
        success = await loader.load();
      } catch (e) {
        this.logError(e);
      } finally {
        if(!success && loader.critical) process.exit(1);
      };
    };
  };

  initalizeCommands(path) {
    Fs.readdirSync(path).forEach(file => {
      try {
        let filePath = path + '/' + file;
        if(file.endsWith('.js')) {
          const Command = require(filePath);
          const commandName = file.replace(/.js/g, '').toLowerCase();
          const command = new Command(commandName, this);
          return this.commands.set(commandName, command)
        } else if (Fs.lstatSync(filePath).isDirectory()) {
          this.initalizeCommands(filePath)
        };
      } catch (error) {
        this.logError(error)
      };
    });
  };

  initalizeListeners(path) {
    Fs.readdirSync(path).forEach(file => {
      try {
        const filePath = path + '/' + file
        if(file.endsWith('.js')) {
          const Event = require(filePath);
          const event = new Event(this);          
          return super.on(event.name, (...args) => event.ON(...args));
        };

        let stats = Fs.lstatSync(filePath);
        if (stats.isDirectory()) {
          this.initalizeListeners(filePath)
        };
      } catch (error) {
        this.logError(error)
      };
    });
  };
};