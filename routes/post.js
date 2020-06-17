const express = require("express")
const router = express.Router();
const mongoose = require("mongoose")
const Post = mongoose.model("Post")
const requireLogin = require("../middleWare/requireLogin")


router.get("/allPosts", requireLogin, (req, res) => {

    Post.find()
        .populate("postedBy", "_id name")
        .populate("comments.commentedBy", "_id name")
        .then((posts) => {

            res.json({ posts: posts })
        }).catch((error) => console.log(error))
})



router.get("/subscribedPosts", requireLogin, (req, res) => {


    // if postedBy in following 
    Post.find({postedBy:{$in:req.user.following}})                     //getting posts of users who u following

        .populate("postedBy", "_id name")
        .populate("comments.commentedBy", "_id name")
        .then((posts) => {

            res.json({ posts: posts })
        }).catch((error) => console.log(error))
})





router.get("/myPosts", requireLogin, (req, res) => {

    Post.find({ postedBy: req.user._id })
        .populate("postedBy", "_id name")
        .then((myPosts) => {

            res.json({ myPosts: myPosts })

        }).catch((error) => console.log(error))
})


router.post("/createPost", requireLogin, (req, res) => {

    const { title, body, pic } = req.body

    if (!title || !body || !pic) {

        return res.status(422).json({ error: "Please add all fields" })
    }

    console.log(req.user)

    req.user.password = undefined

    const post = new Post({

        title: title,
        body: body,
        photo: pic,
        postedBy: req.user

    })
    post.save().then((result) => {

        res.json({ post: result })

    }).catch((error) => console.log(error))


})


router.put("/like", requireLogin, (req, res) => {

    Post.findByIdAndUpdate(req.body.postId, {

        $push: { likes: req.user._id }    // since likes is an array we use push 
    }, {
        new: true                      // so mongoDb returns updated record

    }).exec((error, result) => {

        if (error) {
            return res.status(422).json({ error: errors })

        } else {

            res.json(result)
        }
    })

})


router.put("/unLike", requireLogin, (req, res) => {

    Post.findByIdAndUpdate(req.body.postId, {

        $pull: { likes: req.user._id }    // since likes is an array of user id so we pull the that user id out of array
    }, {
        new: true                      // so mongoDb returns updated record

    }).exec((error, result) => {

        //result gives whole post
        if (error) {
            return res.status(422).json({ error: errors })

        } else {

            res.json(result)
        }
    })

})



router.put("/comment", requireLogin, (req, res) => {

    const comment = {
        text: req.body.text,
        commentedBy: req.user._id
    }

    Post.findByIdAndUpdate(req.body.postId, {

        $push: { comments: comment }    // since likes is an array we use pull , pull sets to 0
    }, {
        new: true                      // so mongoDb returns updated record

    })
        .populate("comments.commentedBy", "_id name")   /// to get name and id of user
        .populate("postedBy", "_id name")
        .exec((error, result) => {

            //result gives whole post
            if (error) {
                return res.status(422).json({ error: errors })

            } else {

                res.json(result)
            }
        })

})



router.delete("/deletePost/:postId", requireLogin, (req, res) => {


    console.log(req.params)

    Post.findOne({ _id: req.params.postId })
        .populate("postedBy", "_id")
        .exec((error, result) => {




            if (error || !result) {

                return res.status(422).json({ error: error })
            }
            if (result.postedBy._id.toString() === req.user._id.toString()) {

                result.remove()
                    .then((result) => {

                        console.log("result")
                        console.log(result)

                        res.json({ result: result })

                    }).catch((error) => {

                        console.log(error)
                    })
            }
        })

})

module.exports = router