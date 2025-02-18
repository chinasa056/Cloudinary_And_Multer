const router = require("express").Router();

const { register, getAllUser, getOne, deleteUser, updateUser } = require("../controllers/userController");

const upload = require("../utils/multer")

router.post("/register", upload.single("profilePic"), register)
router.get("/user", upload.single("profilePic"), getAllUser)
router.get("/user/:id", upload.single("profilePic"), getOne)
router.delete("/user/:id", upload.single("profilePic"), deleteUser)
router.patch("/user/:id", upload.single("profilePic"), updateUser)





module.exports = router;