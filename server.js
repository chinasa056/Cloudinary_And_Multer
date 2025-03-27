const express = require("express");
require("dotenv").config()
require("./config/database")
const passport = require("passport")

require("./middleware/passport")
const session = require("express-session")
const userRouter = require("./routes/userRouter")
const postROuter = require("./routes/postROuter")
const commentRouter = require("./routes/commentRouter")

const PORT = process.env.PORT;

const app = express();

app.use(express.json())

app.use(session({
    saveUninitialized:false,
    secret: "acha",
    resave: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use("/api/v1", userRouter)
app.use("api/v1/", postROuter)
app.use("api/v1/", commentRouter)



app.listen(PORT, () => {
    console.log(`app is listening to port : ${PORT}`);
    
})