const commentModel = require("../models/comment")
const postModel = require("../models/post");
const replyModel = require("../models/reply");
const userModel = require("../models/user")

exports.replyComment = async (req, res) => {
    try {
        const {userId} = req.user;
        const {id: commentId} = req.params;
        const {reply} = req.body

        const user = await userModel.findById(userId)
        if(!user) {
            return res.status(404).json({
                message: "User not found"
            })
        };
        const comment = await commentModel.findById(commentId)
        if(!comment) {
            return res.status(404).json({
                message: "Comment No Longer Available"
            })
        };

        const post = await postModel.findById(comment.postId)
        if(!post) {
            return res.status(404).json({
                message: "Post No Longer Available"
            })
        }

        const newReply = new replyModel({
            reply,
            userId,
            username: user.fullName,
            commentId,
            postId: comment.postId
        });

        comment.replies.push(newReply._id);
        await comment.save()
        await newReply.save()

        res.status(404).json({
            message: "Reply posted successfully",
            data: newReply
        })
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error Replying Comment"
        })
    }
};

exports.replyAReply = async (req, res) => {
    try {
        const {userId} = req.user;
        const {id: replyId} = req.params;
        const {reply} = req.body

        const user = await userModel.findById(userId)
        if(!user) {
            return res.status(404).json({
                message: "User not found"
            })
        };

        const replyExist = await replyModel.findById(replyId)
        if(!replyExist) {
            return res.status(404).json({
                message: "Reply No Longer Available"
            })
        }

        const comment = await commentModel.findById(replyExist.commentId)
        if(!comment) {
            return res.status(404).json({
                message: "Comment No Longer Available"
            })
        };

        const post = await postModel.findById(comment.postId)
        if(!post) {
            return res.status(404).json({
                message: "Post No Longer Available"
            })
        }

        const newReply = new replyModel({
            reply,
            userId,
            username: user.fullName,
            commentId: replyExist.commentId,
            postId: comment.postId
        });

        replyExist.replies.push(newReply._id);
        await newReply.save()
        await replyExist.save()

        res.status(404).json({
            message: "Reply posted successfully",
            data: newReply
        })
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error posting reply"
        })
    }
};

exports.getAllReplies = async (req, res) => {
    try {
        const replies = await replyModel.find().populate("replies")

        res.status(404).json({
            message: "all replies",
            data: replies
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error posting reply"
        })
    }
}