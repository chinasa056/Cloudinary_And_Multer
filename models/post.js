const { ref } = require("joi");
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    content: {
        type: String,
    },

    images: [{
        imageUrl: { type: String },
        imagePublicId: { type: String }
    }],

    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Users",
        required: true
    },

    user: {
        type: String,
        required: true
    },

    commentIds: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Comments"
    }],

    reactions: [{
        userName: String,
        userId: {type: mongoose.Schema.Types.ObjectId, ref: "Users"},
        reaction: {
            type: String,
            enum: ["Like", "Love", "Wow", "Haha", "Care", "Angry"]
        }
    }]

}, { timestamps: true })

const postModel = mongoose.model("Post", postSchema);

module.exports = postModel;