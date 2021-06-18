const router = require("express").Router();
const User = require("../models/User");
const config = require("../config");
const auth = require("../middleware/auth");

router.post("/", [auth, config.upload.single("image")], async (req, res) => {
  const token = req.get("Authorization");
  const user = await User.findOne({token});
  let newPost = {};
  newPost.dateTime = new Date();
  newPost.text = req.body.text;
  newPost.image = req.body.image;
  if (req.body.repostFromUser) {
    newPost.repostFromUser = req.body.repostFromUser
  }
  if (req.body.repostFromGroup) {
    newPost.repostFromGroup = req.body.repostFromGroup;
  }
  if (req.file) {
    newPost.image = req.file.filename;
  }
  try {
    await user.updateOne({$push: {posts: newPost}});
    const updatedUser = await User.findById(user._id);
    res.send({user: updatedUser});
  } catch (e) {
    res.status(400).send(e);
  }
});

router.patch("/remove/:id", auth, async (req, res) => {
  const token = req.get("Authorization");
  const user = await User.findOne({token});
  try {
    await user.updateOne({$pull: {posts: {_id: req.params.id}}});
    const updatedUser = await User.findById(user._id);
    res.send({user: updatedUser});
  } catch (e) {
    res.status(400).send(e);
  }
});

router.patch("/edit/:id", [auth, config.upload.single("image")], async (req, res) => {
  const token = req.get("Authorization");
  const user = await User.findOne({token});
  let editedPost = user.posts.find(post => post._id.equals(req.params.id));
  editedPost.text = req.body.text
  if (req.file) {
    editedPost.image = req.file.filename;
  }
  try {
    await user.updateOne({$pull: {posts: {_id: req.params.id}}});
    await user.updateOne({$push: {posts: editedPost}});
    const updatedUser = await User.findById(user._id);
    res.send({user: updatedUser});
  } catch (e) {
    res.status(400).send(e);
  }
});

router.patch("/repost", auth, async (req, res) => {
  const token = req.get("Authorization");
  const user = await User.findOne({token});
  let repost = req.body;
  repost.dateTime = new Date();
  try {
    await user.updateOne({$push: {posts: repost}});
    const updatedUser = await User.findById(user._id);
    res.send({user: updatedUser});
  } catch (e) {
    res.status(400).send(e);
  }
});

router.patch("/comment/:id", auth, async (req, res) => {
  const token = req.get("Authorization");
  const user = await User.findOne({token});
  const commentedUser = await User.findById({_id: req.params.id});
  let commentedPost = commentedUser.posts.find(post => post._id.equals(req.body.postId));
  commentedPost.comments.push({
    user: user._id,
    image: user.image,
    dateTime: new Date(),
    firstName: user.firstName,
    lastName: user.lastName,
    text: req.body.text,
  });
  try {
    await commentedUser.updateOne({$pull: {posts: {_id: commentedPost._id}}});
    await commentedUser.updateOne({$push: {posts: commentedPost}});
    res.send(commentedPost);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.patch("/like/:id", auth, async (req, res) => {
  const token = req.get("Authorization");
  const user = await User.findOne({token});
  const likedUser = await User.findById({_id: req.params.id});
  let likedPost = likedUser.posts.find(post => post._id.equals(req.body.postId));
  let check = likedPost.likes.findIndex(like => like.user.equals(user._id));
  if (check === -1) {
    likedPost.likes.push({user: user._id});
  } else {
    likedPost.likes = [
      ...likedPost.likes.slice(0, check),
      ...likedPost.likes.slice(check + 1)
    ];
  }
  try {
    await likedUser.updateOne({$pull: {posts: {_id: likedPost._id}}});
    await likedUser.updateOne({$push: {posts: likedPost}});
    res.send(likedPost);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.patch("/reply/:id", auth, async (req, res) => {
  const token = req.get("Authorization");
  const user = await User.findOne({token});
  const commentedUser = await User.findById({_id: req.params.id});
  let post = commentedUser.posts.find(post => post._id.equals(req.body.postId));
  let repliedComment = post.comments.find(comment => comment._id.equals(req.body.commentId));
  const index = post.comments.findIndex(comment => comment._id === repliedComment._id);
  const reply = {
    user: user._id,
    image: user.image,
    firstName: user.firstName,
    dateTime: new Date,
    text: req.body.text,
    to: {
      user: commentedUser._id,
      firstName: commentedUser.firstName
    },
  };
  repliedComment.replies.push(reply);
  post.comments = [
    ...post.comments.slice(0, index),
    repliedComment,
    ...post.comments.slice(index + 1)
  ];
  try {
    await commentedUser.updateOne({$pull: {posts: {comments: {$elemMatch: {_id: repliedComment._id}}}}});
    await commentedUser.updateOne({$push: {posts: post}});
    res.send(post);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;