const userAuthor =require("../models/userAuthorModel");
async function createUserOrAuthor(req,res){
    const newUserAuthor = req.body;
    const userinDb = await userAuthor.findOne({email:newUserAuthor.email});
    console.log(userinDb);
    //if user existed
    if(userinDb !== null){
        //check with role
        if(newUserAuthor.role === userinDb.role){
            res.status(200).send({message:newUserAuthor.role,payload:userinDb})
        }else{
            res.status(200).send({message:"Invalid Request"})
        }
    }else{
        let newUser = new userAuthor(newUserAuthor);
        let newUserOrAuthorDoc = await newUser.save();
        res.status(201).send({message:newUserOrAuthorDoc.role,payload:newUserOrAuthorDoc})
    }
}

module.exports = createUserOrAuthor;