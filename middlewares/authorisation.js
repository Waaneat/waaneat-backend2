const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/users/User");

module.exports = async (req,res,next)=>{
    const authHeader = req.headers['authorization'];
    const jwtToken = authHeader && authHeader.split(' ')[1];

    if(jwtToken){
        console.log("pourtant la")
        try {
            const decoded = await jwt.verify(jwtToken,process.env.jwtSecret);
            let idUser = decoded.userId;
            req.user = await User.findOne({
                where: {
                    id: idUser
                }
            })

            if(!req.user){
                throw new Error("Utilisateur n'existe pas")
            }else{
                req.userId = idUser;
                // Continue le middleware
                next();
            }
        } catch (error) {
            res.status(401).json("erreur not autorise");
        }
    }else{
        res.status(401).json({code:50000,callback:"Not authorized, no token"});
    }
}