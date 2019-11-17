const Embed = require('./Embed');
const Channels = {
  commands: "553286242981249044",
  client: "554095928009556002",
  web: "557697479412285470",
  guild: "556585510110363649",
  user: "561003786496245781",
}

module.exports = class Logs {
  constructor(client) {
    this.client = client;    
  };

  connection() {
    return this.client.logChannel(new Embed()
      .setAuthor(this.client.user.username, this.client.user.avatarURL)
      .setDescription([
        `${this.client.getEmoji('discord2').all} **[\`Connected\`](${process.env.WEBSITE_URI})** in Discord successfully.`,        
      ].join('\n'))
      .setColor('738cd5')
      .setThumbnail(this.client.user.avatarURL)
      .setFooter('Status: I am working correctly.')    
      .setTimestamp(new Date())
    , Channels.client)
  };

  usage(command, message, { channel, guild, author } = message) {    
    return this.client.logChannel(new Embed(author)
      .setAuthor(this.client.user.username, this.client.user.avatarURL)
      .setDescription([
        `The command **[\`${command}\`](${process.env.SERVERAPI_URI}/api/commands/${command})** was used correctly!`,
        '󠂪 󠂪󠂪',        
        `[${this.client.getEmoji('server').all}] ➜ **Guild**: **\`${guild.name} (${guild.id})\`**`,
        `[${this.client.getEmoji('message').all}] ➜ **Channel**: **\`${channel.name} (${channel.id})\`**`,
        `[${this.client.getEmoji('user').all}] ➜ **User**: **\`${author.tag} (${author.id})\`**`,        
      ].join('\n'))
      .setThumbnail(guild.iconURL)
      .setFooter('Status: Command used correctly!', author.avatarURL)
      .setTimestamp(new Date())
    , Channels.commands)
  };

  miused(command, message, { channel, guild, author } = message) {
    return this.client.logChannel(new Embed(author)
      .setAuthor(this.client.user.username, this.client.user.avatarURL)
      .setDescription([
        `The command **[\`${command}\`](${process.env.WEBSITE_URI})** was used incorrectly!`,
        '󠂪 󠂪󠂪',        
        `[${this.client.getEmoji('server').all}] ➜ **Guilds**: **\`${guild.name} (${guild.id})\`**`,
        `[${this.client.getEmoji('message').all}] ➜ **Channel**: **\`${channel.name} (${channel.id})\`**`,
        `[${this.client.getEmoji('user').all}] ➜ **User**: **\`${author.tag} (${author.id})\`**`
      ].join('\n'))
      .setThumbnail(guild.iconURL)
      .setFooter('Status: Command used incorrectly!', author.avatarURL)
      .setTimestamp(new Date())
    , Channels.commands)
  };

  logged(user) {
    return this.client.logChannel(new Embed(user)
      .setAuthor(this.client.user.username, this.client.user.avatarURL)
      .setDescription([
        `${this.client.getEmoji('like').all} User **[\`${user.tag} (${user.id})\`](${process.env.WEBSITE_URI}/profile/${user.id})** has just **[\`logged\`](${process.env.WEBSITE_URI})** in to the site.`,        
      ].join('\n'))
      .setColor('276bd6')
      .setFooter('Status: Authentication completed data collected!', user.avatarURL)
      .setTimestamp(new Date())
    , Channels.web)
  };

  async guildCreate(guild) {
    return this.client.logChannel(new Embed()
      .setAuthor(this.client.user.username, this.client.user.avatarURL)
      .setDescription([
        `${this.client.getEmoji('online').all} I was **[\`added\`](${process.env.WEBSITE_URI})** from the server: **${guild.name}**`,
        '󠂪 󠂪󠂪',
        `[${this.client.getEmoji('discord').all}] ➜ **Name**: \`${guild.name} (${guild.id})\``,
        `[${this.client.getEmoji('users').all}] ➜ **Members**: \`${guild.memberCount}\``,
        `[${this.client.getEmoji('crown').all}] **Owner**: **\`${guild.owner.user.username} (${guild.owner.id})\`**`
      ].join('\n'))
      .setColor('4acc85')
      .setFooter('Status: Data created for the server.')
      .setTimestamp(new Date())
    , Channels.guild)
  };

  async guildDelete(guild) {
    return this.client.logChannel(new Embed()
      .setAuthor(this.client.user.username, this.client.user.avatarURL)
      .setDescription([
        `${this.client.getEmoji('online').all} I was **[\`removed\`](${process.env.WEBSITE_URI})** from the server: **${guild.name}**`,
        '󠂪 󠂪󠂪',
        `[${this.client.getEmoji('discord').all}] ➜ **Name**: \`${guild.name} (${guild.id})\``,
        `[${this.client.getEmoji('users').all}] ➜ **Members**: \`${guild.memberCount}\``,
        `[${this.client.getEmoji('crown').all}] **Owner**: **\`${guild.owner.user.username} (${guild.owner.id})\`**`
      ].join('\n'))
      .setColor('cc4a4a')
      .setFooter('Status: Data removed for the server.')
      .setTimestamp(new Date())
    , Channels.guild)
  };

  user(user) {
    return this.client.logChannel(new Embed(user)
      .setAuthor(this.client.user.username, this.client.user.avatarURL)
      .setDescription([
        `${this.client.getEmoji('online').all} **[\`${user.tag} (${user.id})\`](${process.env.WEBSITE_URI}/profile/${user.id})** in the database.`,
        '󠂪 󠂪󠂪',
        `[${this.client.getEmoji('user').all}] ➜ **Name**: \`${user.username}\``,
        `[${this.client.getEmoji('discord').all}] ➜ **ID**: \`${user.id}\``,        
      ].join('\n'))      
      .setColor('4acc85')
      .setFooter('Status: Data created for the user.', user.avatarURL)
      .setTimestamp(new Date())
    , Channels.user)
  };  
}
