const router = require("express").Router();
const { createPost, updatePost, deletePost } = require("../controllers/postController");
const upload = require("../utils/multer")

router.post("/post/:id", upload.array("images", 20), createPost )
router.patch("/post/:id", upload.array("images", 20), updatePost )
router.delete("/post/:id", upload.array("images", 20), deletePost )



module.exports = router;