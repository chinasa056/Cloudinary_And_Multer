const postModel = require("../models/post");
const userModel = require("../models/user");
const cloudinary = require("../config/cloudinary")
const fs = require("fs");

exports.createPost = async (req, res) => {
    try {
        // extract the ID feom the params and create a default variablecalled userID
        const { id: userId } = req.params;
        // get the content from the request body
        const { content } = req.body;
        // check if the user exists
        const user = await userModel.findById(userId)

        if (user === null) {
            return res.status(404).json({
                message: "User does not exist"
            })
        };
        // pass the files into a variable files
        const files = req.files;
        // create a temporary pictures array
        const pictureUrl = [];
        // use a FOR OF LOOP to upload the images one at a time to cloudinary
        for (const image of files) {
            const result = await cloudinary.uploader.upload(image.path);
            // unlink the images from your local storageas it is loading
            fs.unlinkSync(image.path);
            // create an object forthe images to hold the URL and public_IDs
            const photo = {
                imageUrl: result.secure_url,
                imagePublicId: result.public_id
            }
            // push the photo object into the temporal array created
            pictureUrl.push(photo)
        }

        // create an instance of the post model
        const post = new postModel({
            content,
            user: user.fullName,
            userId: user._id,
            images: pictureUrl
        })
        // push the post ID into the user's document
        user.postId.push(post._id);

        // save the post and user documents to the database
        await post.save();
        await user.save();

        // send a success response
        res.status(201).json({
            message: "post created successfully",
            data: post
        })


    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal server error"
        })
    }
};

exports.updatePost = async (req, res) => {
    try {
        const { id: postId } = req.params;
        const { content } = req.body;

        const post = await postModel.findById(postId);

        if (post === null) {
            return res.status(404).json({
                message: "Post not found"
            })
        };

        const data = {
            content
        };

        if (req.files && req.files[0]) {
            for (const image of post.images) {
                await cloudinary.uploader.destroy(image.imagePublicId)
            }

            const pictureUrl = []
            for (const image of req.files) {
                result = await cloudinary.uploader.upload(image.path)
                fs.unlinkSync(image.path)
                const photo = {
                    imageUrl: result.secure_url,
                    imagePublicId: result.public_id
                }
                pictureUrl.push(photo)
            }
            data.images = pictureUrl
        }

        const updatedPost = await postModel.findByIdAndUpdate(postId, data, { new: true })

        res.status(200).json({
            message: "post updated successfully",
            data: updatedPost
        })

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal server error"
        })
    }
};

exports.deletePost = async (req, res) => {
    try {
        const { id: postId } = req.params;

        const post = await postModel.findById(postId);

        if(!post) {
            return res.status(404).json({
                message: "Post not found"
            })
        }

       
        await postModel.findByIdAndDelete(postId);

        for (const image of post.images) {
            await cloudinary.uploader.destroy(image.imagePublicId)
        }

        res.status(200).json({
            message: "User deleted successfully"
        })

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal server error"
        })
    }
}