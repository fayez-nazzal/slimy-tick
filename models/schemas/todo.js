const { Schema } = require("mongoose");

const todoSchema = new Schema({
  body: String,
  checked: Boolean,
  created: String,
  remind: String,
  repeat: [String],
  priority: {
    type: String,
    required: true,
  },
  due: String,
});

module.exports = todoSchema;
