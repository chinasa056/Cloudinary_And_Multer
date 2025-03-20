const userModel = require("../models/user");
const cloudinary = require("../config/cloudinary")
const bcrypt = require("bcrypt")
const fs = require("fs")
const jwt = require("jsonwebtoken");
const html = require("../utils/emailTemplate");
const sendMail = require("../middleware/nodemailer");
// const os = require("os")

// UNBOARDING STAGE

exports.register = async (req, res) => {
    try {
        // exytact te=he needed fields from the request body
        const { fullName, email, password, gender } = req.body;
        // pass the file comimg from request. file into a variable file
        const file = req.file;
        // if (os.type() == "Darwin") {
        // return res.status(400).json({message: "user with macbook is nt allowed access"})
        // }          
        // check if user wuth that email already exists
        const emailExit = await userModel.findOne({ email: email.toLowerCase() })

        if (emailExit) {
            // await cloudinary.uploader.destroy(result.public_id)
            fs.unlinkSync(file.path)
            return res.status(400).json({
                message: `User with email ${email} alredy exists`
            })
        }
        // encrypt the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // uploadthei files to cloudinary and delete the one in the local storage
        const result = await cloudinary.uploader.upload(file.path);
        fs.unlinkSync(file.path)
        // create an instance of the user
        const user = new userModel({
            fullName,
            email,
            gender,
            password: hashedPassword,
            profilePic: {
                imageUrl: result.secure_url,
                publicId: result.public_id
            }
        })

        // generate a token for the user
        const token = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1hour" });
        // generate the verification link, this link will be passed to the html as the first parameter and will be used to verify the user
        const link = `${req.protocol}://${req.get("host")}/api/v1/user-verify/${token}`
        // dynamically get the users first name to pass to the html as a parameter
        const firstName = user.fullName.split(" ")[0]

        // get the mail options details into an object 
        const mailDetails = {
            email: user.email,
            subject: "welcome mail",
            html: html(link, firstName)
        }

        // invoke the nodmailer function and pass the mailDetails to it as a parameter
        //await nodemailer to send the user an email
        await sendMail(mailDetails)
        // save the document to the database
        await user.save()

        res.status(201).json({
            message: "User registered successfully",
            data: user
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "internal server error"
        })
    }
};

exports.verifyUser = async (req, res) => {
    try {
        // extract the token from the params
        const { token } = req.params;
        // check ifthe token is still active
        if (!token) {
            return res.status(400).json({
                message: "Token not found"
            })
        };
        // verify the token
        jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
            // if there was an error or if the token has expired, resend verification mail automaticalle
            if (err) {
                // check if the error is a JWT error
                if (err instanceof jwt.JsonWebTokenError) {
                    // decode the token and pass the payload into a variable
                    const decodedToken = jwt.decode(token)
                    // extract the userId from the decoed tokn and check for the user in the database
                    const user = await userModel.findById(decodedToken.userId)
                    // check if the user is found in the database 
                    if (user === null) {
                        res.status(404).json({
                            message: "User not found"
                        })
                    };

                    // check if the user is verified
                    if (user.isVerified === true) {
                        return res.status(400).json({
                            message: "User has already been verified"
                        })
                    };

                    // generate a new token
                    const newToken = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1hour" });
                    // generate the verification link
                    const link = `${req.protocol}://${req.get("host")}/api/v1/user-verify/${newToken}`;
                    // dynamically get the users firstname
                    const firstName = user.fullName.split(" ")[0]

                    // pass the mail options into an object variable
                    const mailDetails = {
                        email: user.email,
                        subject: "Email verification",
                        html: html(link, firstName)
                    };

                    // await the nodemailer to send the email
                    await sendMail(mailDetails)

                    res.status(200).json({
                        message: "Link expired, check your email for new verification link"
                    });

                };
                // if there was no error
            } else {
                console.log(payload)
                // check for the user in the database using the token id
                const user = await userModel.findById(payload.userId);
                if (user === null) {
                    return res.status(404).json({
                        message: "User not found"
                    })
                };

                // check if the user has been verified
                if (user.isVerified === true) {
                    return res.status(400).json({
                        message: "USer has already been verified"
                    })
                };

                user.isVerified = true
                await user.save()

                res.status(200).json({
                    message: "User verified successfully"
                })

            };

        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: "Error verifing user"
        })
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email) {
            return res.status(400).json({
                message: "Please enter your email address"
            })
        };

        if (password === null) {
            return res.status(400).json({
                message: "Please enter your password"
            })
        };

        const user = await userModel.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({
                message: `User with email : ${email} does not exist`
            })
        };

        const correctPassword = await bcrypt.compare(password, user.password)
        if (!correctPassword) {
            return res.status(400).json({
                message: "Incorrect password"
            })
        };

        if (user.isVerified === false) {
            return res.status(400).json({
                message: "Please verify your account"
            })
        };

        const token = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({
            message: "Login successful",
            data: user,
            token
        })
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(500).json({
                message: "Token expired"
            })
        }
        res.status(500).json({
            message: "Internal erver error"
        })
    }
}


// CRUD

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



