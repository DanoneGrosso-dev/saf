const Dc = require("discord.js");
const Fs = require("fs");

const Loaders = require("./src/Loaders");

require("dotenv").config();
require('moment-duration-format');

module.exports = class SafClient extends Dc.Client {
  constructor(options = {}) {
    super(options);
    
    this.logs = new (require('./src/structures/LogsChannel'))(this);
    // this.commands = new Dc.Collection();        

    this.initializeLoaders();
    // this.test('./src/commands');
    this.initalizeListeners('./src/listeners');
  };

  async start(token = process.env.DISCORD_TOKEN) {    
    await super.login(token)
      .then(() => {
        this.logs.connection();
        this.log("Connected in Discord successfully.", "Discord")
      });
  };

  getEmoji(name) {            
    return require('./src/utils/Constants').find(e =>
      e.name.includes(name) ||
      e.name.includes(name.toLowerCase()) ||
      e.name.includes(name.toUpperCase())
    );
  };

  log(...args) {
    const argument = ` \x1b[34m${args[0]}\x1b[0m`;
    const tags = `\x1b[94m${args.map(t => `[${t}]`).slice(1).join(' ')}\x1b[0m`;
    const log = (args.length > 1 ? tags : '');
    console.log(log + argument)
  };

  logChannel(...args) {
    const msg = args[0];    
    const id = args.slice(1).toString();
    this.channels.get(id).send(msg);
  }
  
  logError(...args) {
    const msg = args[0];
    const tags = args.slice(1).map(t => `\x1b[95m[${t}]\x1b[0m`);
    const log = (args.length > 1 ? tags : '');
    console.error('\x1b[31m[Error]\x1b[0m', ...log, msg);
  };
    
  Error(error) {
    throw new Error(error);
  };

  async initializeLoaders() {
    for (let name in Loaders) {
      const loader = new Loaders[name](this);
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

  test(path) {
    Fs.readdir(path, (err, files) => {
      if(err) this.logError(err);
      
      files.forEach(file => {
        let filePath = path + '/' + file;
        if(file.endsWith('.js')) {
          const Command = require(filePath);
          const commandName = file.replace(/.js/g, '').toLowerCase();
          const command = new Command(commandName, this);
          return this.commands.set(commandName, command);
        } else if (Fs.lstatSync(filePath).isDirectory()) {
          this.test(filePath);
        };
      });
    });
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