const router = require("express").Router();
const User = require("../models/User");
const Group = require("../models/Group");
const config = require("../config");
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
  const result = await Group.find();
  if (result) {
    res.send(result);
  } else {
    res.sendStatus(404);
  }
});

router.get("/:id", async (req, res) => {
  const result = await Group.findById({_id: req.params.id});
  if (result) {
    res.send(result);
  } else {
    res.sendStatus(404);
  }
});

router.post("/", [auth, config.upload.single("image")], async (req, res) => {
  const groupData = req.body;
  groupData.admin = req.user._id
  const admin = await User.findById(req.user._id);
  if (req.file) {
    groupData.image = req.file.filename;
  }
  groupData.members = [];
  groupData.members.push({
    member: admin._id,
    memberImage: admin.image
  });
  groupData.creationDate = new Date();
  const group = new Group(groupData);
  try {
    await group.save();
    res.send(group);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/:id", auth, async (req, res) => {
  const group = await Group.findById({_id: req.params.id});
  if (req.user._id.equals(group.admin)) {
    const result = await Group.findByIdAndDelete(group._id);
    if (result) {
      res.send("Group removed");
    } else {
      res.sendStatus(404);
    }
  }
});

router.patch("/join/:id", auth, async (req, res) => {
  const group = await Group.findById({_id: req.params.id});
  const check = group.members.find(member => member.member.equals(req.user._id));
  const user = await User.findById(req.user._id);

  const newMember = {
    user: user._id,
    firstName: user.firstName,
    image: user.image
  };
  const newGroup = {
    group: group._id,
    name: group.name,
    description: group.description,
    image: group.image
  }
  if (!check) {
    await group.updateOne({$push: {members: newMember}});
    await user.updateOne({$push: {groups: newGroup}});
    const updatedGroup = await Group.findById(req.params.id);
    const updatedUser = await User.findById(user._id);
    res.send({group: updatedGroup, user: updatedUser});
  } else {
    res.send({message: "You have already join "})
  }
});

router.patch("/leave/:id", auth, async (req, res) => {
  const group = await Group.findById({_id: req.params.id});
  const user = await User.findById(req.user._id);
  const check = group.members.find(member => member.member.equals(req.user._id));
  if (check) {
    await group.updateOne({$pull: {members: {member: req.user._id}}});
    await user.updateOne({$pull: {groups: {group: group._id}}});
    const updatedGroup = await Group.findById(req.params.id);
    const updatedUser = await User.findById(user._id);
    res.send({group: updatedGroup, user: updatedUser});
  }
});

router.patch("/create_post/:id", [auth, config.upload.single("image")], async (req, res) =>{
  const group = await Group.findById({_id: req.params.id});
  const postData = req.body;
  postData.dateTime = new Date();
  if (req.file) {
    postData.image = req.file.filename;
  }
  if (req.user._id.equals(group.admin)) {
    await group.updateOne({$push: {posts: postData}});
    const updatedGroup = await Group.findById(req.params.id);
    res.send(updatedGroup);
  } else {
    res.send({message: "Denied"});
  }
});

router.patch("/remove_post/:id", auth, async (req, res) => {
  const group = await Group.findById({_id: req.params.id});
  if (req.user._id.equals(group.admin)) {
    await group.updateOne({$pull: {posts: {_id: req.query.post}}});
    const updatedGroup = await Group.findById(req.params.id);
    res.send(updatedGroup);
  } else {
    res.send({message: "Denied"});
  }
});

module.exports = router;

