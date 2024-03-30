const bcrypt = require("bcrypt");
const { Op, json } = require("sequelize");
const Admin = require("../../models/admin/Admin");
const isValidString = require("../../utils/isValidString");
// const isValidEmail = require("../../utils/isValidEmail");
const jwtGenerator = require("../../utils/jwtGenerator");


exports.create = async(req,res)=>{
    try {
        
        const { username,email,password,role} = req.body;
        // const saltRound = 10;
        // const salt = await bcrypt.genSalt(saltRound);
        // const bcryptPassword = await bcrypt.hash(password,salt);

        // const newAdmin = await Admin.create({ 
        //     username: username,
        //     email:email,
        //     password: bcryptPassword,
        //     role: "root"
        // });
        // //res.json("okayy")
        const admin = await Admin.findOne(
            {
                where: {id: req.cookies.userId}
            }
        );
        
        if(admin == null || admin.role != "root" ){
            res.status(403).json({code:20051,message:admin});
        }else if(admin != null){
            if (username == null || username === "" || !isValidString(username)) {
                res.status(400).json({code:20001,message:"username vide ou invalide"});
            } else if (email == null || email === "" || !isValidEmail(email)) {
                res.status(400).json({code:20002,message:"email vide ou invalide"});
            } else if (password == null || password === "" || !isValidString(password) ) {
                res.status(400).json({code:20003,message:"password vide ou invalide"});
            } else if ( password.length < 6 ) {
                res.status(400).json({code:20004,message:"password trop court"});
            } else if (role == null || role === "" || !isValidString(role)) {
                res.status(400).json({code:20006,message:"role vide ou invalide"});
            } else {
                const admin = await Admin.findOne({
                    where: {
                        [Op.or]: [
                            { username: username },
                            { email: email }
                        ]
                    }
                });
                if(admin){
                    res.status(403).json({code:20008,message:"Vendeur existe deja"});
                }else if(admin == null){
                    const saltRound = 10;
                    const salt = await bcrypt.genSalt(saltRound);
                    const bcryptPassword = await bcrypt.hash(password,salt);
        
                    const newAdmin = await Admin.create({ 
                        username: username,
                        email:email,
                        password: bcryptPassword,
                        role: role
                    });
                
                    //jwtGenerator(res,newAdmin.id);
                
                    if(newAdmin != null){
                        res.status(200).json({code:20009,callBack:newAdmin});
                    }else{
                        res.status(200).json({code:20008.5,callBack:"Probleme lors de la creation de l'admin"});
                    }
                }           
                
            }
        }

        
    } catch (error) {
        console.error(error);
        res.status(200).json({code:20000,callBack:"serveur erreur"});
    }
}

exports.update = async(req,res)=>{
    try {
        const { username,email,password } = req.body;
        const idAdmin = req.params.idAdmin;

        const admin = await Admin.findOne(
            {
                where: {id: req.cookies.userId}
            }
        );

        if(admin == null || admin.role != "root"){
            res.status(403).json({code:20051,message:"Vous n'etes pas un admin"});
        }else if(admin != null){
            
            if (username == null || username === "" || !isValidString(username)) {
                res.status(400).json({code:20001,message:"username vide ou invalide"});
            } else if (email == null || email === "" || !isValidEmail(email)) {
                res.status(400).json({code:20002,message:"email vide ou invalide"});
            } else if (password == null || password === "" || !isValidString(password) ) {
                res.status(400).json({code:20003,message:"password vide ou invalide"});
            } else if ( password.length < 6 ) {
                res.status(400).json({code:20004,message:"password trop court"});
            } else {
                const saltRound = 10;
                const salt = await bcrypt.genSalt(saltRound);
                const bcryptPassword = await bcrypt.hash(password,salt);
    
                await Admin.update({ 
                        username: username,
                        email:email,
                        password: bcryptPassword,
                    },
                    {
                        where:{id:idAdmin}
                    }
                );

                res.status(200).json({code:20056,callBack:"admin modifié avec success"});
            }

        }

    } catch (error) {
        console.error(error.message);
        res.status(500).json({code:20050,message:"serveur erreur"});
    }
}

exports.updateOne = async(req,res)=>{
    try {
        const { username,email,password } = req.body;

        const admin = await Admin.findOne(
            {
                where: {id: req.cookies.userId}
            }
        );

        if(admin == null || (admin.role !== "admin" && admin.role !=="root")){
            res.status(403).json({code:20051,message:"Vous n'etes pas un admin"});
        }else if(admin != null){
            
            if (username == null || username === "" || !isValidString(username)) {
                res.status(400).json({code:20001,message:"username vide ou invalide"});
            } else if (email == null || email === "" || !isValidEmail(email)) {
                res.status(400).json({code:20002,message:"email vide ou invalide"});
            } else if (password == null || password === "" || !isValidString(password) ) {
                res.status(400).json({code:20003,message:"password vide ou invalide"});
            } else if ( password.length < 6 ) {
                res.status(400).json({code:20004,message:"password trop court"});
            } else {
                const saltRound = 10;
                const salt = await bcrypt.genSalt(saltRound);
                const bcryptPassword = await bcrypt.hash(password,salt);
    
                await Admin.update({ 
                        username: username,
                        email:email,
                        password: bcryptPassword,
                    },
                    {
                        where:{id:admin.id}
                    }
                );

                res.status(200).json({code:20056,callBack:"admin modifié avec success"});
            }

        }

    } catch (error) {
        console.error(error.message);
        res.status(500).json({code:20050,message:"serveur erreur"});
    }
}

exports.delete = async (req, res) => {
    try {
        const idAdmin = req.params.idAdmin;

        const admin = await Admin.findOne({
            where: { id: req.cookies.userId }
        });

        if (admin == null || admin.role !== "root") {
            res.status(403).json({ code: 20071, callBack: "Vous n'etes pas un admin" });
        } else {
            // Assuming Admin model has a proper association with other models, 
            // you may need to adjust the deletion logic based on your model relationships.
            await Admin.destroy({
                where: { id: idAdmin }
            });

            res.status(200).json({ code: 20072, callBack: "Admin supprimé avec succès" });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ code: 20070, callBack: "Erreur du serveur" });
    }
};

exports.get = async (req, res) => {
    try {
        const idAdmin = req.params.idAdmin;

        const admin = await Admin.findOne({
            where: { id: req.cookies.userId }
        });

        if (admin == null || (admin.role !== "admin" && admin.role !== "root")) {
            res.status(403).json({ code: 20061, message: "Vous n'etes pas un admin" });
        } else {
            const admin = await Admin.findOne({
                where: { id: idAdmin }
            });

            if (admin == null) {
                res.status(404).json({ code: 20061.6, callBack: "Admin introuvable" });
            } else {
                res.status(200).json({ code: 20062, callBack: admin });
            }
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ code: 20060, admin: "Erreur du serveurrr" });
    }
};
exports.getOne = async (req, res) => {
    try {

        const admin = await Admin.findOne({
            where: { id: req.cookies.userId }
        });
        //res.json(admin)
        
        if (admin == null || (admin.role !== "admin" && admin.role !== "root")) {
            res.status(403).json({ code: 20061, message: "Vous n'etes pas un admin" });
        } else {
            const targetAdmin = await Admin.findOne({
                where: { id: admin.id }
            });
            if (targetAdmin == null) {
                res.status(404).json({ code: 20061.6, callBack: "Admin introuvable" });
            } else {
                res.status(200).json({ code: 20062, callBack: targetAdmin });
            }
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ code: 20060, admin: "Erreur du serveur" });
    }
};

exports.getAll = async (req, res) => {
    try {
        const admin = await Admin.findOne({
            where: { id: req.cookies.userId }
        });

        if (admin == null || admin.role !== "root") {
            res.status(403).json({ code: 20081, message: "Vous n'etes pas un admin" });
        } else {
            const admins = await Admin.findAll();

            if (admins == null || admins.length === 0) {
                res.status(404).json({ code: 20081.6, callBack: "Aucun admin disponible" });
            } else {
                res.status(200).json({ code: 20082, callBack: admins });
            }
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ code: 20080, message: "Erreur du serveur" });
    }
};