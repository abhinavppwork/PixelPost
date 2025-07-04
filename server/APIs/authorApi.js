const exp = require("express")
const authorApp = exp.Router();
const expressAsyncHandler = require("express-async-handler")
const createUserOrAuthor = require("./createUserOrAuthor")
const Article = require("../models/ArticleModel")
const {requireAuth} = require("@clerk/express")
require('dotenv').config()

authorApp.post("/author",expressAsyncHandler(createUserOrAuthor));
authorApp.post("/article",expressAsyncHandler(async(req,res)=>{
    //get new article obj from req
    const newArticleObj = req.body;
    const newArticle = new Article(newArticleObj);
    const articleObj = await newArticle.save();
    res.status(201).send({message:"artcile published",payload:articleObj})
}))

//get all the articles
authorApp.get("/articles",requireAuth({signInUrl:"unauthorized"}),expressAsyncHandler(async(req,res)=>{
    const listOfArticles = await Article.find({isArticleActive:true})
    res.status(200).send({message:"articles",payload:listOfArticles})
}))
authorApp.get('/unauthorized',(req,res)=>{
    res.send({message:"unauthorized access please login"})
})

authorApp.put("/article/:articleId",requireAuth({signInUrl:"unauthorized"}),expressAsyncHandler(async(req,res)=>{

    //get modified article
    const modifiedArticle = req.body;
    const dbRes = await Article.findByIdAndUpdate(modifiedArticle._id,{ ...modifiedArticle},{returnOriginal:false})
    //send res
    res.status(200).send({message:"article updated",payload:dbRes})
}))


//delete (soft delete) the article
authorApp.put("/articles/:articleId",expressAsyncHandler(async(req,res)=>{

    //get modified article
    const modifiedArticle = req.body;

    const latestArticle = await Article.findByIdAndUpdate(modifiedArticle._id,
        { ...modifiedArticle },
        { new:true}
    )
    //send res
    res.status(200).send({message:"artcile deleted or restored",payload:latestArticle})
}))
module.exports = authorApp;
