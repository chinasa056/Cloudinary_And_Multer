const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema({
    comment : {
        type: String,
        required: true
    },
    username : {
        type: String,
        required: true
    },
    postId : {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Posts",
        required: true
    },
    userId : {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Users",
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

const commentModel = mongoose.model("Coments", commentSchema)

module.exports = commentModel