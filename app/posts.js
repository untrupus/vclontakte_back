const router = require("express").Router();
const User = require("../models/User");
const config = require("../config");
const auth = require("../middleware/auth");

router.post("/", [auth, config.upload.single("image")], async (req, res) => {
  const token = req.get("Authorization");
  const user = await User.findOne({token});

  let newPost = {};
  newPost.dateTime = new Date();
  newPost.text = req.body.text

  if (req.file) {
    newPost.image = req.file.filename;
  }

  try {
    await user.updateOne({$push: {posts: newPost}});
    const updatedUser = await User.findById(user._id);
    res.send({message: "Success", updatedUser});
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
    res.send({message: "Success", updatedUser});
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
    res.send({message: "Success", updatedUser});
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;