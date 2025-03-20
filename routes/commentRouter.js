const { createComment } = require("../controllers/commentController");
const { authenticate } = require("../middleware/authentication");

const router = require("express").Router();


router.post("/comment", authenticate, createComment)

module.exports = router;
