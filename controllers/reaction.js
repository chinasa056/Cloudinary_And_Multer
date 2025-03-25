const commentModel = require("../models/comment");
const postModel = require("../models/post");
const userModel = require("../models/user");

exports.reactToPost = async (req, res) => {
    try {
        // Get the user from the request user
        const {userId} = req.user;
        const {Id: postId} = req.params;
        const {reaction} = req.body;
        // Find the user and check if it exists
        const user = await userModel.findById(userId)
        if(!user) {
            return res.status(404).json({
                message: "User does not exist"
            })
        };

        // find the post and check if it exists
        const post = await postModel.findById(postId)
        if(!post) {
            return res.status(404).json({
                message: "Post no longer available"
            })
        };

        // check if the user has an existing reaction adnd return the index of the existing reaction
        const indexOfReaction = post.reactions.findIndex((element) => {element.userId == userId});

        // create a nw instance of the reaction
        const newReaction = {
            username: user.fullName,
            reaction,
            userId
        };
        // push the new reaction into the post if the user doesn't have an existing reaction
        if(indexOfReaction === -1) {
            post.reactions.push(newReaction)
        };

        // update the post reaction if the user has an existing reaction
        if(indexOfReaction !== -1) {
            post.reactions.splice(indexOfReaction, 1, newReaction)
        };

        // remove the user's existing existing reaction if the new reaction is an empty string
        if(indexOfReaction !== -1 && reaction.trim() == ""){
            post.reactions.splice(indexOfReaction, 1)
        };

        // save the changes to the database
        await post.save();
        // return a success response
        res.status(201).json({
            message: "Reaction Added",
            data: post.reactions
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error Reacting to post"
        })
    }
}