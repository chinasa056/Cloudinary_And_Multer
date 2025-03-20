const userModel = require("../models/user")
const jwt = require("jsonwebtoken");

exports.authenticate = async (req, res, next) => {
    try {
        const auth = req.headers.authorization;
        if(!auth) {
            return res.status(404).json({
                message: "Authenticaion failed: Auth not found"
            })
        }
        const token = auth.split(" ")[1];
        if(!token) {
            return res.status(400).json({
                message: "Invalid Token"
            })
        };

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findById(decodedToken.userId);

        if(!user) {
            return res.status(404).json({
                message: "Authentication Failed: User is not found"
            })
        };

        if(user.isVerified !== true) {
            return res.status(400).json({
                message: "AUthentication Failed: User is not verified"
            })
        }

        req.user = decodedToken
        next()
    } catch (error) {
        console.log(error.message);
        if(error instanceof jwt.JsonWebTokenError) {
            return res.status(400).json({
                message: "Session Timed-Out"
            })
        };
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

