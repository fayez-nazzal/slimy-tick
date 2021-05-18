const { Schema } = require('mongoose');
const groupSchema = require('./group');

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  created: {
    type: String,
    required: true,
  },
  groups: [groupSchema],
});

module.exports = userSchema;
