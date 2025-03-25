const mongoose = require("mongoose")

const replySchema = new mongoose.Schema({
    reply : {
        type: String,
        required: true
    },
    username : {
        type: String,
        required: true
    },
    postId : {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Comments",
        required: true
    },
    userId : {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Users",
        required: true
    },
    commentId : {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Comments",
        required: true
    },
    replies:[ {
        type:  mongoose.SchemaTypes.ObjectId,
        ref: "Replies"
    }],
     reactions: [{
            userName: String,
            userId: {type: mongoose.Schema.Types.ObjectId, ref: "Users"},
            reaction: {
                type: String,
                enum: ["Like", "Love", "Wow", "Haha", "Care", "Angry"]
            }
        }]
}, {timestamps: true})

const replyModel = mongoose.model("Coments", replySchema)

module.exports = replyModel