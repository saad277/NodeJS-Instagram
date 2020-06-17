const mongoose = require("mongoose")
const {ObjectId}=mongoose.Schema.Types
const postSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true

    },
    body: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        default: "no photo"
    },

    likes:[{type:ObjectId,ref:"User"}],

    comments:[{
        text:String,
        commentedBy:{type:ObjectId,ref:"User"}
    }],

    postedBy:{
        type:ObjectId,   //this is id of user who posted
        ref:"User"

    }

})

mongoose.model("Post",postSchema)