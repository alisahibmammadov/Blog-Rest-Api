const router = require("express").Router();
const Post = require("../models/post");
const User = require("../models/user");
const bcrypt = require("bcrypt");

// update

router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    try {
      const updateUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updateUser);
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(401).json({ msg: "You can update your update" });
  }
});

// delete
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    try {
        const user = await User.findById(req.params.id)
        try {
            await Post.deleteMany({username:user.username})
            // only delete user account
            await User.findByIdAndDelete(req.params.id)
            res.status(200).json({msg:"User has been deleted ..."})

        } catch (error) {
            res.status(500).json(error)
        }
    } catch (error) {
        res.status(404).json({msg:"User not found ..."})
    }
  }
  else{
    res.status(401).json({msg:"You can delete only your account ..."})
  }
});

// get user 
router.get("/:id",async(req,res)=>{
    try {
        const user = await User.findById(req.params.id)
        const {password, ...other} = user._doc
        res.status(200).json(other)
    } catch (error) {
        res.status(400).json(error)
    }
})

module.exports = router;
