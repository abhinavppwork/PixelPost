const exp = require("express");
const authorApp = exp.Router();
const expressAsyncHandler = require("express-async-handler");
const createUserOrAuthor = require("./createUserOrAuthor");
const Article = require("../models/ArticleModel");
const verifyFirebaseToken = require("../middlewares/verifyFirebaseToken"); // <-- New Middleware
require("dotenv").config();

authorApp.post("/author", expressAsyncHandler(createUserOrAuthor));

authorApp.post("/article", verifyFirebaseToken, expressAsyncHandler(async (req, res) => {
  const newArticleObj = req.body;
  const newArticle = new Article(newArticleObj);
  const articleObj = await newArticle.save();
  res.status(201).send({ message: "article published", payload: articleObj });
}));

// Get all the articles
authorApp.get("/articles", verifyFirebaseToken, expressAsyncHandler(async (req, res) => {
  const listOfArticles = await Article.find({ isArticleActive: true });
  res.status(200).send({ message: "articles", payload: listOfArticles });
}));

authorApp.put("/article/:articleId", verifyFirebaseToken, expressAsyncHandler(async (req, res) => {
  const modifiedArticle = req.body;
  const dbRes = await Article.findByIdAndUpdate(modifiedArticle._id, { ...modifiedArticle }, { returnOriginal: false });
  res.status(200).send({ message: "article updated", payload: dbRes });
}));

authorApp.put("/articles/:articleId", verifyFirebaseToken, expressAsyncHandler(async (req, res) => {
  const modifiedArticle = req.body;
  const latestArticle = await Article.findByIdAndUpdate(modifiedArticle._id, { ...modifiedArticle }, { new: true });
  res.status(200).send({ message: "article deleted or restored", payload: latestArticle });
}));

module.exports = authorApp;
