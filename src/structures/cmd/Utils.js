const Manager = require("./Manager");

module.exports = class Utils extends Manager {
  constructor(client) {
    super(client);    
  };
  
  async getUser(args, message, guild, author, userGuild = false) {
    args = (args && Array.isArray(args) ? args.join(' ') : args ? args : false);
    let user = false

    try {
      if(args) {
        if(message && message.mentions.users.first()) {
          user = message.mentions.users.first()
        } else {
          if(!(isNaN(args))) {
            if(!userGuild && this.fetchUser(args)) {
              user = await this.fetchUser(args).then(user => user)
            } else if(guild && guild.members.get(args)) {
              user = guild.members.get(args).user;
            };
          };

          if(!user) {
            if(guild) {
              if (guild.members.find(user => user.displayName.toLowerCase() === args.toLowerCase() || user.displayName.toLowerCase().includes(args.toLowerCase()))) {
                user = guild.members.find(user => user.displayName.toLowerCase() === args.toLowerCase() || user.displayName.toLowerCase().includes(args.toLowerCase())).user
              } else if(guild.members.find(u => u.user.tag.toLowerCase() === args.toLowerCase() || u.user.tag.toLowerCase().includes(args.toLowerCase()))) {
                user = guild.members.find(u => u.user.tag.toLowerCase() === args.toLowerCase() || u.user.tag.toLowerCase().includes(args.toLowerCase())).user
              };
            };

            if(!user) {
              if(!userGuild && this.users.find(user => user.tag.toLowerCase() === args.toLowerCase() || user.tag.toLowerCase().includes(args.toLowerCase()))) {
                user = this.users.find(user => user.tag.toLowerCase() === args.toLowerCase() || user.tag.toLowerCase().includes(args.toLowerCase()))
              } else if(!userGuild && this.users.find(user => user.username.toLowerCase() === args.toLowerCase() || user.username.toLowerCase().includes(args.toLowerCase()))) {
                user = this.users.find(user => user.username.toLowerCase() === args.toLowerCase() || user.username.toLowerCase().includes(args.toLowerCase()))
              };
            };
          };
        };
      } else {
        user = author;
      };
      return user ? user : author;
    } catch (err) {
      this.client.logError(err);
      return author;
    };
  };

  getChannel(args, message, guild, channel) {
    args = (args && Array.isArray(args) ? args.join(' ') : args ? args : false);
    let CHANNEL = false

    try {
      if(args) {
        if(message.mentions.channels.first()) {
          CHANNEL = message.mentions.channels.first()
        } else if(!(isNaN(args))) {
          if(guild.channels.find(channel => channel.id === args)) {
            CHANNEL = guild.channels.find(channel => channel.id === args)
          };
        };

        if(!CHANNEL) {
          if(guild.channels.find(channel => channel.name.toLowerCase() === args.toLowerCase())) {
            CHANNEL = guild.channels.find(channel => channel.name.toLowerCase() === args.toLowerCase())
          };
        };
      } else {
        CHANNEL = channel
      };
      
      return CHANNEL ? CHANNEL : channel;
    } catch (err) {
      return false;
    };
  };

  async getRole(args, message, guild) {
    args = (args && Array.isArray(args) ? args.join(' ') : args ? args : false);
    let ROLE = false

    try {
      if(args) {
        let ROLES = guild.roles.map(r => r).slice(1);
        if(message.mentions.roles.first()) {
          ROLE = message.mentions.roles.first()
        } else if(!(isNaN(args))) {
          if(ROLES.find(role => role.id === args)) {
            ROLE = ROLES.find(role => role.id === args)
          };
        };
        
        if(!ROLE) {
          if(ROLES.find(role => role.name.toLowerCase() === args.toLowerCase())) {
            ROLE = ROLES.find(role => role.name.toLowerCase() === args.toLowerCase())
          };
        };
      } else {
        ROLE = false
      };
      
      return ROLE;
    } catch (err) {
      return false;
    };
  };

  async getMentions(message, type, args, position) {
    args = (Array.isArray(args) ? args : false)
    
    try {
      if (args) {
        let a = args[position]
          a = args[position].replace(/(<|@|&|#|!|>)/g, '')
        let b;
          b = message.mentions[type].find(s => s.id === a)
        return b
      };
    } catch(err) {
      return false;
    };
  };

  getCommand(cmdName) {
    const cmd = this.client.commands.find((cmd) => cmd.name.toLowerCase() === cmdName.toLowerCase() || (cmd.aliases && cmd.aliases.includes(cmdName.toLowerCase())));
    return cmd;
  };

  verifyVoiceChannel(guild, channel, author, voiceChannel, t, playCommand = false) {
    const guildQueue = this.client.playerManager.get(guild.id)

    if(voiceChannel && playCommand && !guildQueue && !(voiceChannel.joinable && voiceChannel.speakable)) {      
      channel.send(t('music:notPermissions', {
        emoji: this.client.getEmoji('console').all,
        user: author.username,
        permissions: voiceChannel.joinable ? 'falar' : 'conectar'
      }));
      return false;
    };

    if(!voiceChannel) {
      let response = t('music:userNotInChannel', {
        emoji: this.client.getEmoji('console').all,
        user: author.username
      });
      if(guildQueue) response = t('music:memberInDiferentChannel', {
        emoji: this.client.getEmoji('console').all,
        user: author.username
      });
      channel.send(response);
      return false;
    } else if(guildQueue) {
      if(guildQueue.voiceChannel.id !== voiceChannel.id) {
        channel.send(t('music:memberInDiferentChannel', {
          emoji: this.client.getEmoji('console').all,
          user: author.username
        }));
        return false;
      };
    };
    return true;
  };
};