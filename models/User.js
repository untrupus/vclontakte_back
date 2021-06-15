const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const {nanoid} = require("nanoid");
const SALT_WORK_FACTOR = 10;

const Schema = mongoose.Schema;

const LikeSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const CommentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  text: {
    type: String,
    required: true
  }
});

const PostSchema = new Schema({
  dateTime: Date,
  text: String,
  image: String,
  likes: [LikeSchema],
  comments: [CommentSchema]
});

const GroupSchema = new Schema({
  group: {
    type: Schema.Types.ObjectId,
    ref: "Group",
  },
  name: String,
  description: String,
  image: String
});

const FriendSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  firstName: String,
  lastName: String,
  image: String
});

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: async (value) => {
        const user = await User.findOne({username: value});
        if (user) return false;
      },
      message: (props) => `Пользователь ${props.value} уже существует`
    }
  },
  password: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  groups: [GroupSchema],
  posts: [PostSchema],
  friends: [FriendSchema],
  gender: String,
  status: String,
  relationships: String,
  city: String,
  birthDate: String,
  image: String
});

UserSchema.path("email").validate(value => {
  return /^[\w-.]+@(\b[a-z-]+\b)[^-].[a-z]{2,10}$/g.test(value);
}, "Введите правильный почтовый ящик");
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
  const hash = await bcrypt.hash(this.password, salt);
  this.password = hash;
  next();
});
UserSchema.set('toJSON', {
  transform: (doc, ret, options) => {
    delete ret.password;
    return ret;
  }
});
UserSchema.methods.generateToken = function () {
  this.token = nanoid();
};
UserSchema.methods.checkPassword = function (password) {
  return bcrypt.compare(password, this.password);
};
const User = mongoose.model("User", UserSchema);

module.exports = User;