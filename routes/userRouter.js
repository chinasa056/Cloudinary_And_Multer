const router = require("express").Router();
const jwt = require("jsonwebtoken")
const passport = require("passport")

const { register, getAllUser, getOne, deleteUser, updateUser } = require("../controllers/userController");

const upload = require("../utils/multer")

router.post("/register", upload.single("profilePic"), register)
router.get("/user", upload.single("profilePic"), getAllUser)
router.get("/user/:id", upload.single("profilePic"), getOne)
router.delete("/user/:id", upload.single("profilePic"), deleteUser)
router.patch("/user/:id", upload.single("profilePic"), updateUser)

router.get("/authenticate", passport.authenticate("google", { scope: ['profile', "email"] }))

router.get("/google/login", passport.authenticate("google"), async (req, res) => {
    const token = await jwt.sign({userId: req.user._id}, process.env.JWT_SECRET, {expiresIn: "1day"})
    res.status(200).json({
        message: "Login Successful",
        data: req.user,
        token
    })
})

module.exports = router;