const exp = require("express")
const userApp = exp.Router();
const expressAsyncHandler = require("express-async-handler")
const createUserOrAuthor = require("./createUserOrAuthor");
const Article = require("../models/ArticleModel");

userApp.post("/user",expressAsyncHandler(createUserOrAuthor));

userApp.put("/comment/:articleId",expressAsyncHandler(async(req,res)=>{
    //get comment obj
    const commentObj = req.body;
    const articleWithComments = await Article.findOneAndUpdate({articleId:req.params.articleId},{$push:{comments:commentObj}},{returnOriginal:false});

    res.status(200).send({message:"comment added",payload:articleWithComments});
}))


module.exports=userApp;