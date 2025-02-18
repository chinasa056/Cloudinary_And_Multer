const userModel = require("../models/user");
const cloudinary = require("../config/cloudinary")
const bcrypt = require("bcrypt")
const fs = require("fs")
// const os = require("os")

exports.register = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        const file = req.file;
        // if (os.type() == "Darwin") {
        // return res.status(400).json({message: "user with macbook is nt allowed access"})
        // }
        const result = await cloudinary.uploader.upload(file.path);

        fs.unlinkSync(file.path)


        const emailExit = await userModel.findOne({ email: email.toLowerCase() })

        if (emailExit) {
            await cloudinary.uploader.destroy(result.public_id)
            return res.status(400).json({
                message: `User with email ${email} alredy exists`
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        const user = new userModel({
            fullName,
            email,
            password: hashedPassword,
            profilePic: {
                imageUrl: result.secure_url,
                publicId: result.public_id
            }
        })

        await user.save()

        res.status(201).json({
            message: "User created successfully",
            data: user
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "internal server error"
        })
    }
};

exports.getAllUser = async (req, res) => {
    try {

        const allUsers = await userModel.find();

        res.status(200).json({
            message: " all users founnd",
            data: allUsers
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "internal server error"
        })
    }
};

exports.getOne = async (req, res) => {
    try {

        const { id } = req.params;

        const user = await userModel.findById(id)

        if (!user) {
            return res.status(404).json({
                message: "user not found"
            })
        };

        res.status(200).json({
            message: "User found",
            data: user
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "internal server error"
        })
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await userModel.findById(id)

        if (!user) {
            return res.status(404).json({
                message: "user not found"
            })
        };

        // console.log(req.file.path);
        // const result = await cloudinary.uploader.upload(req.file.path);
        // console.log(req.file);
        // const deletedUser =
        await userModel.findByIdAndDelete(id);
        await cloudinary.uploader.destroy(user.profilePic.publicId)

        // if(deletedUser) {
        // }

        res.status(200).json({
            message: "User deleted successfully"
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "internal server error"
        })
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName } = req.body;
        const user = await userModel.findById(id)

        if (!user) {
            return res.status(404).json({
                message: "user not found"
            })
        };

        const data = {
            fullName,
            profilePic: user.profilePic
        }

        if (req.file) {
            // / Upload the new profile picture to Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path);

            if (user.profilePic.publicId) {
                // Delete the old profile picture from Cloudinary
                await cloudinary.uploader.destroy(user.profilePic.publicId);
                // Remove the uploaded file from the local file system
            }
            // Update the profile picture details
            data.profilePic = {
                imageUrl: result.secure_url,
                publicId: result.public_id
            }

            fs.unlinkSync(req.file.path)
        }

        const updatedUser = await userModel.findByIdAndUpdate(id, data, { new: true })

        res.status(200).json({
            message: "User updated successfully",
            data: updatedUser
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "internal server error"
        })
    }
}



