const { replyComment, replyAReply, getAllReplies } = require("../controllers/replyController");
const { authenticate } = require("../middleware/authentication");

const router = require("express").Router();


router.post("/reply/create/:id", authenticate, replyComment)

router.post("/reply/reply/:id", replyAReply)

router.get("/reply/get", getAllReplies)

module.exports = router;
