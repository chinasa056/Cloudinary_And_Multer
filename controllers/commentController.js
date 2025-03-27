const userModel = require("../models/user")
const postModel = require("../models/post")
const commentModel = require("../models/comment");

exports.createComment = async (req, res) => {
    try {
        const {userId} = req.user;
        const {id: postId} = req.params;
        const {comment} = req.body

        const post = await postModel.findById(postId)
        if(!post) {
            return res.status(404).json({
                message: "Post not found"
            })
        };
        const user = await userModel.findById(userId)
        if(!user) {
            return res.ststus(404).json({
                massage: "User not found" 
            })
        };

        const newComment = new commentModel({
            comment,
            userId,
            username: user.fullName,
            postId
        });

        post.commentIds.push(newComment._id);
        await newComment.save()
        await post.save()

        res.status(201).json({
            message: "Comment posted Successfully",
            data: newComment
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error Posting Comment",
            error: error.message
        })
        
    }
};

exports.getAllComments = async (req, res) => {
    try {
        const comments = await commentModel.find().populate("replies");

        res.status(200).json({
            message: "All replies retrieved successfully",
            data: comments
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    }
}