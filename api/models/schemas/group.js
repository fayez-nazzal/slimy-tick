const { Schema } = require('mongoose');
const taskSchema = require('./task');

const groupSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  created: String,
  tasks: [taskSchema],
});

module.exports = groupSchema;
