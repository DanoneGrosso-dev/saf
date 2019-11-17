const { Schema } = require('mongoose');

module.exports = new Schema({
  _id: {
    type: String
  },
  maintenance: {
    type: Boolean,
    default: false
  },  
});