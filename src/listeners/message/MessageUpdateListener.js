const { Listener, Embed } = require('../../');

module.exports = class MessageUpdateListener extends Listener {
  constructor(client) {
    super(client);

    this.client = client;
    this.name = 'messageUpdate';    
  };

  async ON(oldMessage, newMessage) {
    try {
      const { config } = newMessage.guild && this.client.database && await this.client.database.guilds.get(newMessage.guild.id);
      const t =  this.client.language.i18next.getFixedT(config.language);

      if(config.logs.on) {
        const guildLog = newMessage.guild.channels.get(config.logs.channel);

        if(guildLog) {
          if(oldMessage.author.bot || newMessage.author.bot) return;

          guildLog.send(new Embed()
            .setAuthor(newMessage.guild.name, newMessage.guild.iconURL)
            .setDescription([
              t('events:message.update.description.ctx', {
                emoji: this.client.getEmoji('message').all,
                user: newMessage.author.tag,
                userId: newMessage.author.id,
                webSite: `${process.env.WEBSITE_URI}/profile/${newMessage.author.id}`
              }),            
              '󠂪 󠂪󠂪',
              t('events:message.update.description.urlMessage', {
                emoji: this.client.getEmoji('right').all,
                linkMessage: `https://discordapp.com/channels/${oldMessage.guild.id}/${oldMessage.channel.id}/${oldMessage.id}`
              }),
              t('events:message.update.description.oldMessage', {
                emoji: this.client.getEmoji('clock').all,
                old: oldMessage.content.replace(/`/g, ""),
              }),
              t('events:message.update.description.newMessage', {
                emoji: this.client.getEmoji('like').all,
                new: newMessage.content.replace(/`/g, ""),
              }),
              t('events:message.update.description.channelMessage', {
                emoji: this.client.getEmoji('discord').all,
                channel: newMessage.channel,
              })
            ].join('\n'))
            .setThumbnail(newMessage.guild.iconURL)
            .setFooter(t('events:message.update.footer'), newMessage.author.displayAvatarURL)            
          );
        } else {};
      } else {};
    } catch (error) {};    
  };
};