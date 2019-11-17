module.exports = class CommandsApi {
  constructor(client, app) {
    this.client = client;
    this.app = app;
  };

  async register() {
    this.app.get('/api/commands', (req, res) => {
      const t = this.client.language.i18next.getFixedT(req.query.language || process.env.DEFAULT_LANGUAGE);
      
      const validCommands = this.client.commands
        .filter((cmd) => !(cmd.category === 'developer' ));

      const categories = validCommands
        .map(c => c.category)
        .filter((v, i, a) => a.indexOf(v) === i)
        .sort((a, b) => t(`categories:notEmoji.${a}`)
        .localeCompare(t(`categories:notEmoji.${b}`)))
        .map(category => ({          
          name: t(`categories:${category}`),
          commands: validCommands
            .filter(c => c.category === category)
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(c => c.name)
            .join(', ')
        }));

      return res.status(200).json({ categories });
    });

    this.app.get('/api/commands/:name', async (req, res) => {
      const t = this.client.language.i18next.getFixedT(req.query.language || process.env.DEFAULT_LANGUAGE);      

      const command = this.client.commands
        .filter((cmd) => !(cmd.category === 'developer'))
        .find((cmd) => cmd.name.toLowerCase() === req.params.name.toLowerCase() ||
        (cmd.aliases && cmd.aliases.includes(req.params.name.toLowerCase())));

      if(!command) return res.status(400).json({
        error: `I'm sorry but I found no command to: ${req.params.name.toLowerCase()}`
      });

      const { usages } = await this.client.database.commands.get(command.name);
      const prefix = process.env.DEFAULT_PREFIX;

      const getUsage = (cmd, subcommand = false) => {
        if(cmd.usage && !cmd.usage.args) {
          if(subcommand) {
            return `${prefix}${name} ${cmd.name}`;
          } else {
            return `${prefix}${cmd.name}`;
          };
        } else {
          if(!cmd.usage) return false;
          else {
            if(subcommand) {
              return `${prefix}${name} ${cmd.name} ${cmd.usage.need.replace(/{args}/gi, cmd.usage.txt)}\``
            } else {
              return `${cmd.usage.need
                .replace(/{args}/gi, cmd.usage.txt)
                .replace(/{prefix}/gi, prefix)
                .replace(/{cmd}/gi, cmd.name)}`
            };
          };
        };
      };

      return res.status(200).json({
        command: {
          name: command.name,
          description: t(`help:commands.${command.name}`),
          category: t(`categories:notEmoji.${command.category}`) ? t(`categories:notEmoji.${command.category}`) : t('commands:help.command.noCategory'),
          usage: getUsage(command) || t('commands:help.command.noUsage'),
          guildOnly: command.requirements.guildOnly ? t('commands:help.command.true') : t('commands:help.command.false'),
          aliases: command.aliases.length ?  command.aliases.map((aliases) => aliases).join(', ') : t('commands:help.command.noAliases'),
          permissions: {
            bot: command.permissions.client.length ? command.permissions.client.map(perm => t(`permissions:${perm}`)).join(', ') : t('commands:help.command.noPermissions'),
            user: command.permissions.user.length ? command.permissions.user.map(perm => t(`permissions:${perm}`)).join(', ') : t('commands:help.command.noPermissions')
          },
          usages: Number(usages).toLocaleString(),
        }
      })
    });
  };
};