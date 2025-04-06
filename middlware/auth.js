const { getUser } = require("../service/auth");

async function restrictToLoggedinUserOnly(req,res,next) {
    try{
        const userUid=req.cookies?.uid;

        if(!userUid) return res.redirect("/login");

        const user=getUser(userUid);

        if(!user) return res.redirect("/login");
        
        req.user=user;
        next();
    }catch(err){
        console.error("Auth error:",err.message);
        res.status(500).json({success:false,message:"Authentication failed"});
    }
    
}

function isAdmin(req,res,next) {
    if(!req.user || req.user.role!=='admin'){
        return res.status(403).json({success:false, message:'Access denied.Admins only.'});
    }
    next();
    
}

module.exports={
    restrictToLoggedinUserOnly,
    isAdmin,
};