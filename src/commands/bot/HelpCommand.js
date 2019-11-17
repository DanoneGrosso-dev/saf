const { Cmd, Embed } = require("../../");

module.exports = class HelpCommand extends Cmd {
  constructor(name, client) {
    super(name, client);
  
    this.name = 'help'; 
    this.aliases = ['h', 'cmds', 'commands', 'comandos', 'ajuda'];
    this.category = 'bot';    
    this.usage = {
      args: true,      
      txt: '[commandName]',
      need: '{prefix}{cmd} {args}'
    };
    this.requirements = {
      ownerOnly: false,
      guildOnly: true
    };
    this.permissions = {
      client: [],
      user: []
    };
  };

  async run({ channel, guild, author, args }, t) {    
    const helpEmbed = new Embed(author);

    const guildDocument = guild && this.client.database.guilds && await this.client.database.guilds.get(guild.id, 'config');
    const guildPrefix = (guildDocument && guildDocument.config.prefix) || process.env.DEFAULT_PREFIX;

    const command = args[0] ? this.client.commands
      .filter((cmd) => !(cmd.category === 'developer' ))
      .find((cmd) => cmd.name.toLowerCase() === args.join(' ').toLowerCase() ||
      (cmd.aliases && cmd.aliases.includes(args.join(' ').toLowerCase()))
    ) : false;

    if(command) {      
      return this.cmdHelp(channel, guildPrefix, command, helpEmbed, t);        
    } else if (command === null) {
      return channel.send(t('commands:help.noCommand', {
        emoji: this.client.getEmoji('error').all,
        user: author.username,
        content: args.join(' ')
      }))
    }

    const validCommands = this.client.commands
      .filter((cmd) => !(cmd.category === 'developer' ))

    const categories = validCommands
      .map(c => c.category)
      .filter((v, i, a) => a.indexOf(v) === i);

    categories
      .sort((a, b) => t(`categories:notEmoji.${a}`)
      .localeCompare(t(`categories:notEmoji.${b}`)))
      .forEach(category => {
        const commands = validCommands
          .filter(c => c.category === category)
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(c => `\`${c.name}\``)
          .join(' **|** ')
            helpEmbed
              .setAuthor(this.client.user.username, this.client.user.avatarURL)
              .setDescription(t('commands:help.description', { prefix: guildPrefix }))
              .addField(`**${t(`categories:yesEmoji.${category}`)}** [**${validCommands.filter((c) => c.category === category).size}**]:`, [
                commands
              ].join('\n'), true)
              .setFooter(t('commands:help.footer', { prefix: guildPrefix }))
              .setThumbnail(this.client.user.avatarURL)
      });

    return channel.send(helpEmbed)
  };

  async cmdHelp(channel, prefix, command, embed, t) {
    const { usages } = await this.client.database.commands.get(command.name);
    const { name, aliases, category, requirements, permissions } = command;

    const getUsage = (cmd, subcommand = false) => {
      if(cmd.usage && !cmd.usage.args) {
        if(subcommand) {
          return `\`${prefix}${name} ${cmd.name}\``;
        } else {
          return `\`${prefix}${cmd.name}\``;
        };
      } else {
        if(!cmd.usage) return false;
        else {
          if(subcommand) {
            return `\`${prefix}${name} ${cmd.name} ${cmd.usage.need.replace(/{args}/gi, cmd.usage.txt)}\``
          } else {
            return `\`${cmd.usage.need
              .replace(/{args}/gi, cmd.usage.txt)
              .replace(/{prefix}/gi, prefix)
              .replace(/{cmd}/gi, cmd.name)}\``
          };
        };
      };
    };

    return channel.send(embed
      .setDescription([
        t('commands:help.command.name', {
          cmdName: name ? `\`${name}\`` : null,
          emoji: this.client.getEmoji('text').all
        }),
        t('commands:help.command.description', {
          cmdDescription: t(`help:commands.${name}`) ? t(`help:commands.${name}`) : t('commands:help.command.noDescription'),
          emoji: this.client.getEmoji('question').all
        }),        
        t('commands:help.command.category', {
          cmdCategory: t(`categories:notEmoji.${category}`) ? t(`categories:notEmoji.${category}`) : t('commands:help.command.noCategory'),
          emoji: this.client.getEmoji('folder').all
        }),
        t('commands:help.command.usage', {
          cmdUsage: getUsage(command) || t('commands:help.command.noUsage'),
          emoji: this.client.getEmoji('like').all
        }),
        t('commands:help.command.guildOnly', {
          cmdGuildOnly: requirements.guildOnly ? t('commands:help.command.true') : t('commands:help.command.false'),
          emoji: this.client.getEmoji('edit').all
        }),
        t('commands:help.command.aliases', {
          cmdAliases: aliases.length ?  aliases.map((aliases) => `\`${aliases}\``).join(', ') : t('commands:help.command.noAliases'),
          emoji: this.client.getEmoji('foldeEdit').all
        }),
        t('commands:help.command.clientPermissions', {
          cmdClientPermissions: permissions.client.length ? permissions.client.map(perm => `\`${t(`permissions:${perm}`)}\``).join(', ') : t('commands:help.command.noPermissions'),
          emoji: this.client.getEmoji('policeman').all
        }),
        t('commands:help.command.userPermissions', {
          cmdUserPermissions: permissions.user.length ? permissions.user.map(perm => `\`${t(`permissions:${perm}`)}\``).join(', ') : t('commands:help.command.noPermissions'),
          emoji: this.client.getEmoji('user').all
        }),
        t('commands:help.command.usages', {
          cmdUsages: `\`${Number(usages).toLocaleString()}\``,
          emoji: this.client.getEmoji('click').all
        })
      ].join('\n'))
      .setThumbnail(this.client.user.avatarURL)                    
    );
  }
};