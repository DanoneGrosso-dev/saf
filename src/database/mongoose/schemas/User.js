const { Schema } = require('mongoose');

const patentSettings = {
  owner: false,
  developer: false,
  donator: false,      
  vip: false,
  translater: false,
  designer: false,
};

const teamSettings = {
  backend: false,
  frontend: false,
};

module.exports = new Schema({
  _id: {
    type: String
  },  
  patent: {
    type: Object,
    default: patentSettings,
  },
  team: {
    type: Object,
    default: teamSettings,
  },
  blacklist: {
    type: Boolean,
    default: false,
  },
  usedCommands: {
    type: Number,
    default: 0,
  },
  xp: {
    type: Number,
    default: 0,
  },
  level: {
    type: Number,
    default: 0,
  },
});