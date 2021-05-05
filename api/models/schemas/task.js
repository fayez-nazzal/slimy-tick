const { Schema } = require('mongoose');

const taskSchema = new Schema({
  body: String,
  checked: Boolean,
  created: String,
  remind: String,
  repeat: String,
  priority: {
    type: String,
    required: true,
  },
  dueDate: String,
  dueTime: String,
});

module.exports = taskSchema;
