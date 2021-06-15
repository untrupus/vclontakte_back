const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const PostSchema = new Schema({
  dateTime: Date,
  text: String,
  image: String,
});
const MemberSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  firstName: String,
  lastName: String,
  image: String
});
const GroupSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  creationDate: Date,
  admin: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  image: {
    type: String,
    required: true
  },
  members: [MemberSchema],
  posts: [PostSchema],
});

const Group = mongoose.model("Group", GroupSchema);
module.exports = Group;