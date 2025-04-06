const jwt=require("jsonwebtoken");
const secret="Shrey@$";

function setUser(user){
    return jwt.sign({
        id:user.id,
        email:user.email,
        role:user.role,

    },
    secret
);

}

function getUser(token){
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        console.error("Invalid token:", error.message);
        return null;
    }
}

module.exports={
    setUser,
    getUser
};