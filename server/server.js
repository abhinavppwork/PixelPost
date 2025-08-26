const exp = require("express")
const app = exp()
require('dotenv').config();
const userApp = require('./APIs/userApi')
const authorApp = require("./APIs/authorApi")
const adminApp = require("./APIs/adminApi")
const cors = require("cors");

const allowedOrigins = [
  "http://localhost:5173",
  "https://pixel-post-ten.vercel.app"
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow requests like curl/postman
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true  // allow cookies/tokens if you need them
}));

// handle preflight
app.options("*", cors());


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