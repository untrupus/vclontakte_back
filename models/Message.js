const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  from: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  to: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  text: {
    type: String,
    required: true
  },
  image: String,
  dateTime: {
    type: Date,
    required: true
  },
});

const Message = mongoose.model("Message", MessageSchema);
module.exports = Message;