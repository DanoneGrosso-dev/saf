const mongoose = require('mongoose');

require('dotenv').config();

const Wrapper = require('../Wrapper');
const Repo = require('./Repo');
const { User, Guild } = require('./schemas/');

module.exports = class MongoDB extends Wrapper {
  constructor(options = {}) {
    super(options)
    this.mongoose = mongoose
  };

  async startConnection() {
    return mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true, useUnifiedTopology: true
    }).then((m) => {
      this.users = new Repo(m, m.model('Users', User));    
      this.guilds = new Repo(m, m.model('Guilds', Guild));      
    });
  };
};
