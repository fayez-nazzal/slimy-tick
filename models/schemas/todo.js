const { Schema } = require("mongoose");

const todoSchema = new Schema({
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
  dueISO: String,
});

module.exports = todoSchema;
