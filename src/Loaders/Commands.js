const Dc = require("discord.js");
const Fs = require("fs");

module.exports = class CommandsLoader {
  constructor(client) {
    this.name = "CommandsLoader";
    this.client = client;
    this.commands = new Dc.Collection();
  };

  async load() { 
    this.client.commands = this.commands;
    this.initializeCommands(__dirname + './');
  };

  initializeCommands(path) {    
    Fs.readdir(path, (err, files) => {
      if(err) this.client.logError(err);
      
      files.forEach(file => {
        let filePath = path + '/' + file;
        if(file.endsWith('.js')) {
          const Command = require(filePath);
          const commandName = file.replace(/.js/g, '').toLowerCase();
          const command = new Command(commandName, this.client);
          return this.commands.set(commandName, command);
        } else if (Fs.lstatSync(filePath).isDirectory()) {
          this.initializeCommands(filePath);
        };
      });
    });
  };
};