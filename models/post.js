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
    }]

}, { timestamps: true })

const postModel = mongoose.model("Post", postSchema);

module.exports = postModel;