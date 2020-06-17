const express = require("express")
const router = express.Router();
const mongoose = require("mongoose")
const Post = mongoose.model("Post")
const requireLogin = require("../middleWare/requireLogin")
const User = mongoose.model("User")




router.get("/user/:id", requireLogin, (req, res) => {

    User.findOne({ _id: req.params.id })
        .select("-password")
        .then((user) => {

            Post.find({ postedBy: req.params.id })
                .populate("postedBy", "_id name")
                .exec((error, post) => {

                    if (error) {

                        return res.status(422).json({ error })
                    }

                    res.json({ user, post })
                })

        }).catch((error) => {

            return res.status(422).send(error)
        })

})



router.put("/follow", requireLogin, (req, res) => {


    User.findByIdAndUpdate(req.body.followId, {

        $push: { followers: req.user._id }
    },
        {
            new: true

        }, (error, result) => {

            if (error) {

                return res.status(422).json({ error: error })
            }

            User.findByIdAndUpdate(req.user._id, {

                $push: { following: req.body.followId }
            },
                { new: true })
                .select("-password")
                .then((result) => {

                    res.json(result)

                }).catch((error) => {

                    return res.status(422).json({ error })
                })
        }

    )


})


router.put("/unFollow", requireLogin, (req, res) => {


    User.findByIdAndUpdate(req.body.unFollowId, {

        $pull: { followers: req.user._id }
    },
        {
            new: true

        }, (error, result) => {

            if (error) {

                return res.status(422).json({ error: error })
            }

            User.findByIdAndUpdate(req.user._id, {

                $pull: { following: req.body.unFollowId }
            },
                { new: true })
                .select("-password")
                .then((result) => {

                    res.json(result)

                }).catch((error) => {

                    return res.status(422).json({ error })
                })
        }

    )


})


router.put("/updatePic", requireLogin, (req, res) => {

    const { pic } = req.body

    User.findByIdAndUpdate(req.user._id, {

        $set: { pic: pic }
        
        },
        {new:true},
       
        (error, result) => {
                if(error){
                    return res.status(422).json(error)
                }
        }
    )


})



module.exports = router