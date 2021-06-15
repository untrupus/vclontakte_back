const router = require("express").Router();
const User = require("../models/User");
const auth = require("../middleware/auth");

router.patch("/:id", auth, async (req, res) => {
  const token = req.get("Authorization");
  const user = await User.findOne({token});
  const post = user.posts.find(post => post._id.equals(req.params.id));
  const check = post.likes.find(like => like.user.equals(user._id))
});

module.exports = router;