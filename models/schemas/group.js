const { Schema } = require('mongoose');
const todoSchema = require('./todo');

const groupSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  created: String,
  todos: [todoSchema],
});

module.exports = groupSchema;
