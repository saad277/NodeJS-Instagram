const express = require("express")
const app = express();
const PORT = process.env.PORT || 5000;
const mongoose = require("mongoose")
const { mongoURL } = require("./config/keys")


if(process.env.NODE_ENV=="production"){

    app.use(express.static("client/build"))
    const path=require("path")

    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,"client","build","index.html"))
    })
}


app.use(express.json())

require("./models/user")
require("./models/post")

app.use(require("./routes/auth"))
app.use(require("./routes/post"))
app.use(require("./routes/user"))


mongoose.connect(mongoURL,{ useNewUrlParser: true,useUnifiedTopology: true })

mongoose.connection.on("connected", () => {

    console.log("connected to mongodb")
})

mongoose.connection.on("error", (error) => {

    console.log(error)
})





app.listen(PORT, () => {


    console.log("Server running on " + PORT)
})