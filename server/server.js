const exp = require("express")
const app = exp()
require('dotenv').config();
const userApp = require('./APIs/userApi')
const authorApp = require("./APIs/authorApi")
const adminApp = require("./APIs/adminApi")
const cors = require("cors")
app.use(cors())


const mongoose = require("mongoose");
const port = process.env.PORT || 4000;

mongoose.connect(process.env.DBURL)
.then(
    ()=>app.listen(port,()=>console.log(`server is listening on port ${port}`))
)
.catch((err)=>console.log(`error occured: ${err.message}`))
app.use(exp.json()) // to parse the json data in the request body
app.use("/user-api",userApp)
app.use("/author-api",authorApp)
app.use("/admin-api",adminApp)

app.use((err,req,res,next)=>{
    console.log("error object in express error handler :",err)

    res.send({message:err.message})
})