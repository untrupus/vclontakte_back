const router = require("express").Router();
const User = require("../models/User");
const auth = require("../middleware/auth");

router.patch("/subscribe/:id", auth, async (req, res) => {
  const token = req.get("Authorization");
  const user = await User.findOne({token});
  const friend = await User.findById({_id: req.params.id});
  const check = user.friends.find(friend => friend.user.equals(friend._id));
  if (!check) {
    try {
      await user.updateOne({
        $push: {
          friends: {
            user: friend._id,
            firstName: friend.firstName,
            lastName: friend.lastName,
            image: friend.image
          }
        }
      });
      await friend.updateOne({
        $push: {
          friends: {
            user: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            image: user.image
          }
        }
      });
      const updatedUser = await User.findById(friend._id);
      res.send({user: updatedUser});
    } catch (e) {
      res.status(400).send(e);
    }
  }
});

router.patch("/unsubscribe/:id", auth, async (req, res) => {
  const token = req.get("Authorization");
  const user = await User.findOne({token});
  const friend = await User.findById({_id: req.params.id});
  try {
    await user.updateOne({
      $pull: {friends: {user: friend._id}}
    });
    await friend.updateOne({
      $pull: {friends: {user: user._id,}}
    });
    const updatedUser = await User.findById(friend._id);
    res.send({user: updatedUser});
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;