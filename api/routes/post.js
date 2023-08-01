const router = require("express").Router();
const Post = require("../models/post");
const User = require("../models/user");
const bcrypt = require("bcrypt");

// create post
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);

  try {
    const savePost = await newPost.save();
    res.status(200).json(savePost);
  } catch (error) {
    res.status(500).json(error);
  }
});

// update post
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        const updatePost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          {
            new: true,
          }
        );
        res.status(200).json(updatePost);
      } catch (error) {
        res.status(500).json(error);
      }
    } else {
      res.status(401).json({ msg: "You can update only your post!" });
    }
  } catch (error) {}
  res.status(500).json(error);
});

// delete post

router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        await post.deleteOne();
        res.status(200).json({ msg: "Post has been deleted!" });
      } catch (error) {
        res.status(500).json(error);
      }
    } else {
      res.status(401).json({ msg: "You  can delete only your post!" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// get post 
router.get('/:id',async(req,res)=>{
    try {
        const post  = await Post.findById(req.params.id)
        res.status(200).json(post)
    } catch (error) {
        res.status(404).json(error)
    }
})
// get all post 
router.get('/',async(req,res)=>{
    const username = req.query.user
    const catName = req.query.cat
    try {
        let posts;
        if(username){
            posts = await Post.find({username:username})
        }else if(catName){
            posts = await Post.find({
                categories:{
                    $in:[catName]
                }
            })
        }else{
            posts = await Post.find()
        }
        res.status(200).json(posts)
    } catch (error) {
        res.status(404).json(error)
    }
})

module.exports = router;
