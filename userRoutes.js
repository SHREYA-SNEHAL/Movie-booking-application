const express=require('express');
const {users}=require('./db');//import the users model
const {setUser}=require('./service/auth');
const router=express.Router();
const {restrictToLoggedinUserOnly}=require('./middlware/auth');


// Display registration form (GET /auth/register)
router.get("/register", (req, res) => {
    res.render("register");  // This will render register.ejs
});


//Users Registration
router.post("/register",async(req,res)=>{

    try{
        const {name,email,password}=req.body;

        //Validate Input
        if(!name || !email  || !password){
            return res.status(400).json({success:false,message:"All fields are required"})
        }

        //Save  user to the database
        const user=await users.create({
            name,
            email,
            password,
        });
        res.status(201).json({success:true ,message:"User registered successfully!"});

    }catch(error){

        res.status(500).json({success:false,message:"Register failed",error:error.message});
    }
});


//User Login

router.post("/login",async(req,res)=>{

    const {email,password}=req.body;

    const user=await users.findOne({where:{email}});
    if(!user){
        return res.json({message:"Invalid Username or Password"});
    }

    if (user.password!=password) {
        return res.json({message:"Invalid Username or Password"});
    }
    
    const token =setUser(user);
    res.cookie("uid",token);

    return res.json({message:"Login Successfully"});
});

router.get("/login", (req, res) => {
    res.render("login");  // This will render register.ejs
});

//View Profile
router.get("/profile",restrictToLoggedinUserOnly,async(req,res)=>{
    try{
        // Find the user in the database using their ID from the request (req.user.id)
        const user=await users.findByPk(req.user.id,{
            // Exclude the password field from the returned data for security
            attributes:{exclude:["password"]}
        });
     

        if(!user){
            return res.status(404).json({error:"User not found!"});
        }
    
        res.json(user);
    }catch(error){
        res.status(500).json({error:"Failed to fetch profile",details:error.message});
    }

});

//Update Profile
// router.put("/profile",async(req,res)=>{

// });

module.exports=router;