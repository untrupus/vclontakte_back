const router = require("express").Router();
const User = require("../models/User");
const config = require("../config");
const auth = require("../middleware/auth");

router.post("/", async (req, res) => {
  const userData = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
  }
  const user = new User(userData);
  try {
    user.generateToken();
    await user.save();
    res.send(user);
  } catch (e) {
    return res.status(400).send(e);
  }
});

router.post('/sessions', async (req, res) => {
  const user = await User.findOne({email: req.body.email});
  if (!user) {
    return res.status(400).send({error: 'Username not found'});
  }
  const isMatch = await user.checkPassword(req.body.password);
  if (!isMatch) {
    return res.status(400).send({error: 'Password is wrong'});
  }
  user.generateToken();
  await user.save({validateBeforeSave: false});
  return res.send({user});
});

router.delete("/sessions", async (req, res) => {
  const token = req.get("Authorization");
  const success = {message: "Success"};
  if (!token) return res.send(success);
  const user = await User.findOne({token});
  if (!user) return res.send(success);
  user.generateToken();
  user.save({validateBeforeSave: false});
});

router.get("/:id", async (req, res) => {
    const result = await User.findById(req.params.id);
    if (result) {
      res.send(result);
    } else {
      res.sendStatus(404);
    }
});

router.get("/", async (req, res) => {
  try {
    const result = await User.find();
    if (result) {
      res.send(result);
    } else {
      res.sendStatus(404);
    }
  } catch (e) {
    return res.status(400).send(e);
  }
});

router.put('/edit', [auth, config.upload.single("image")], async (req, res) => {
  const userData = req.body;
  if (req.file) {
    userData.image = req.file.filename;
  }
  const token = req.get('Authorization');
  const user = await User.findOne({token});
  try {
    await req.user.updateOne(userData);
    const updatedUser = await User.findById(user._id);
    res.send({user: updatedUser});
  } catch (e) {
    res.status(400).send(e);
  }
});

router.patch("/chats", auth, async (req, res) => {
  const token = req.get("Authorization");
  const user = await User.findOne({token});
  const chatWith = await User.findOne({_id: req.body.with});
  const userChek = user.chats.find(chat => chat.with.equals(req.body.with));
  const chatWithChek = chatWith.chats.find(chat => chat.with.equals(user._id));
  const chatForAnotherUser = {
    with: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    image: user.image,
  };
  const chatWithMe = {
    with: req.body.with,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    image: req.body.image,
  }
  if (!userChek && !chatWithChek) {
    try {
      await user.updateOne({$push: {chats: chatWithMe}});
      await chatWith.updateOne({$push: {chats: chatForAnotherUser}});
      const updatedUser = await User.findById({_id: user._id});
      res.send({user: updatedUser});
    } catch (e) {
      res.status(400).send(e);
    }
  } else {
    res.send({message: "This chat exists"});
  }
});

router.patch("/chats/remove/:id", auth, async (req, res) => {
  const token = req.get("Authorization");
  const user = await User.findOne({token});
  const chatWith = await User.findOne({_id: req.params.id});
  const userChek = user.chats.find(chat => chat.with.equals(req.params.id));
  const chatWithChek = chatWith.chats.find(chat => chat.with.equals(user._id));

  if (userChek && chatWithChek) {
    try {
      await user.updateOne({$pull: {chats: {with: req.params.id}}});
      await chatWith.updateOne({$pull: {chats: {with: user._id}}});
      const updatedUser = await User.findById({_id: user._id});
      res.send({user: updatedUser});
    } catch (e) {
      res.status(400).send(e);
    }
  } else {
    res.send({message: "This chat does not exists"});
  }
});

module.exports = router;