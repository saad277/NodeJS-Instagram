const express=require("express")
const router=express.Router();
const mongoose=require("mongoose")
const User = mongoose.model("User")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const {JWTKey}=require("../config/keys")
const requireLogin=require("../middleWare/requireLogin")

const nodemailer=require("nodemailer");

const sendgridTransport=require("nodemailer-sendgrid-transport")




const transporter=nodemailer.createTransport(sendgridTransport({

    auth:{
        api_key:"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"
    }
}))

router.get("/protected",requireLogin,(req,res)=>{

    res.send("hello user")

})


router.post("/signIn",(req,res)=>{

    const {email,password}=req.body
    if(!email || !password){

       return res.status(422).json({error:"fill all fields"})
    }
    User.findOne({email:email})
    .then((savedUser)=>{
        if(!savedUser){

            return res.status(422).json({error:"invalid email or password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then((doMatch)=>{
            if(doMatch){
                //res.json({message:"successful"})
                const token=jwt.sign({_id:savedUser._id},JWTKey)
                const {_id,name,email,followers,following,pic}=savedUser;
                res.json({token,user:{_id,name,password,followers,following,pic }})
            }
            else{
                return res.status(422).json({error:"invalid password"})
            }

        }).catch((error)=>console.log(error))
    })

})

router.post("/signUp",(req,res)=>{

    const{name,email,password,pic}=req.body

    if(!email || !password || !name){

        res.status(422).json({error:"please add all fields"})

    }
    User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser){

           return res.status(422).json({error:"user already exists"})
        }
        bcrypt.hash(password,12)
        .then((hashedPassword)=>{

            const user =new User({
                email:email,
                password:hashedPassword,
                name:name,
                pic:pic
            })

            user.save().then((user)=>{

                transporter.sendMail({
                        
                    to:user.email,
                    from:"no-reply@insta.com",
                    subject:"signup success",
                    html:"<h1>Welcome To Instagram"
                })


                res.json({message:"user saved"})
            }).catch((error)=>{
    
                console.log(error)
            })

        })
      
      
    }).catch((error)=>{

        console.log(error)
    })
})


module.exports=router;