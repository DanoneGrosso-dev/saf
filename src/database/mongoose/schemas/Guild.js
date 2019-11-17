const { Schema } = require('mongoose');

const configSettings = {
  prefix: process.env.DEFAULT_PREFIX,
  language: process.env.DEFAULT_LANGUAGE,
  systemLevel: false,  
  channels: {
    allowed: [],
    locked: [],
  },  
  logs: {
    on: false,
    channel: 'None',
    types: {
      message: {
        update: false,
        delete: false,
      },
      member: {
        add: {
          on: false,
          channel: 'None',
          message: 'None',
        },
        remove: {
          on: false,
          channel: 'None',
          message: 'None', 
        },
      },
    }
  },
};

module.exports = new Schema({
  _id: {
    type: String
  },
  config: {
    type: Object,
    default: configSettings,
  },
});