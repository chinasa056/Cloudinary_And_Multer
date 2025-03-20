const { string, required } = require("joi")
const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema({
    comment : {
        type: string,
        required: true
    },
    username : {
        type: string,
        required: true
    },
    postId : {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Comments",
        required: true
    },
    userId : {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Comments",
        required: true
    },
    replies:[ {
        type:  mongoose.SchemaTypes.ObjectId,
        ref: "Replies"
    }]
}, {timestamps: true})

const commentModel = mongoose.model("Coments", commentSchema)

module.exports = commentModel