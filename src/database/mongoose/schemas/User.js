const { Schema } = require('mongoose');

module.exports = new Schema({
  _id: String,
  clientSecret: String,
  accessToken: String,
  refreshToken: String
});