const { RichEmbed } = require('discord.js');
require('dotenv').config();

module.exports = class Embed extends RichEmbed {
  constructor(user, data = {}) {
    super(data);
    
    this.setColor(process.env.EMBED_COLOR);    
  };
};