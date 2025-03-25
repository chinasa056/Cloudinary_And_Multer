const { reactToPost } = require("../controllers/reaction");
const { authenticate } = require("../middleware/authentication");

const router = require("express").Router();


router.patch("/reaction/post/:Id", authenticate, reactToPost)

module.exports = router;
