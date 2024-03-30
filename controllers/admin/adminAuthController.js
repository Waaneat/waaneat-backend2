const bcrypt = require("bcrypt");
const Admin = require("../../models/admin/Admin");
const isValidString = require("../../utils/isValidString");
const jwtGenerator = require("../../utils/jwtGenerator");


exports.loginAdmin = async(req,res)=>{
    try {
        const {username,password}=req.body;

        if (username == null || username === "" || !isValidString(username)) {
            res.status(400).json({code:20011,callBack:"username vide ou invalide"});
        } else if (password == null || password === "" || !isValidString(password) ) {
            res.status(400).json({code:20012,callBack:"password vide ou invalide"});
        } else {
            const admin = await Admin.findOne({
                where: {username: username}
            });
            if(!admin){
                res.status(404).json({code:20013,callBack:"admin n'existe pas"});
            }else{
                const validPassword = await bcrypt.compare(password,admin.password);
                if(admin && validPassword && (admin.role == "root" || admin.role == "admin")){
    
                    jwtGenerator(res,admin.id);
                    res.status(200).json({code:20014,callBack:admin});
    
                }else{
                    res.status(404).json({code:20012.5,callBack:"nom d'utilisateur ou password incorrect"})
                }
    
            }

        }
    
    } catch (error) {
        console.error(error.message);
        res.status(500).send({code:20010,callBack:"Erreur serveur"});
    }
}