const express = require("express");
require("dotenv").config()
require("./config/database")

const userRouter = require("./routes/userRouter")
const postROuter = require("./routes/postROuter")
const commentRouter = require("./routes/commentRouter")

const PORT = process.env.PORT;

const app = express();

app.use(express.json())
app.use("/api/v1", userRouter)
app.use("api/v1/", postROuter)
app.use("api/v1/", commentRouter)



app.listen(PORT, () => {
    console.log(`app is listening to port : ${PORT}`);
    
})