const express = require("express");
require("dotenv").config()
require("./config/database")

const userRouter = require("./routes/userRouter")
const postROuter = require("./routes/postROuter")

const PORT = process.env.PORT;

const app = express();

app.use(express.json())
app.use(userRouter)
app.use(postROuter)


app.listen(PORT, () => {
    console.log(`app is listening to port : ${PORT}`);
    
})