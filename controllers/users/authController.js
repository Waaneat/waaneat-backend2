const jwtGenerator = require("../../utils/jwtGenerator");
const bcrypt = require("bcrypt");
const User = require("../../models/users/User");
const Seller = require("../../models/users/seller/Seller");
const Deliver = require("../../models/users/deliver/Deliver");
const Customer = require("../../models/users/customer/Customer");
const isValidString = require("../../utils/isValidString");
const isValidPassword = require("../../utils/isValidPassword");
const { CU_LOGGED_IN } = require("../../success/customer-success/auth");
const { CU_MISSING_FIELDS, CU_INVALID_CREDENTIALS, CU_DENIED_CREDENTIALS, NOT_CUSTOMER } = require("../../errors/customer-errors/auth");
const { Op } = require("sequelize");
const { isValidIdentifier } = require("../../utils/isValidIdentifier");
const { SL_LOGGED_IN } = require("../../success/seller-success/auth");
const { SL_MISSING_FIELDS, SL_INVALID_CREDENTIALS, SL_DENIED_CREDENTIALS, NOT_SELLER } = require("../../errors/seller-errors/auth");


exports.loginSeller = async(req,res)=>{
    try {
        const { identifier, password } = req.body;
        console.log("identifier: ",identifier," password: ",password)

        if (!identifier || !password) {
            throw new Error('Email ou nom d\'utilisateur et/ou mot de passe manquant');
        }

        if (!isValidIdentifier(identifier) || !isValidPassword(password)) {
            throw new Error('Le mot de passe ou l\'identifiant n\'est pas validee');
        }


        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { email: identifier },
                    { username: identifier }
                ]
            }
        });

        if (!user) {
            throw new Error('Identifiant ou mot de passe incorrect');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new Error('Identifiant ou mot de passe incorrect');
        }

        // Générer le jeton JWT
        const token = jwtGenerator(res, user.id);

        const seller = await Seller.findOne({
            where: { idUser: user.id },
            include: User
        });

        if (!seller) {
            throw new Error("Vendeur introuvable");
        }

        res.status(200).json({ code: SL_LOGGED_IN, callback: {"token":token} });

    } catch (error) {
        let statusCode = 500;
        let errorCode = "SERVEUR_000";
        let errorMessage = error.message;

        if (error.message === 'Email ou nom d\'utilisateur et/ou mot de passe manquant') {
            statusCode = 400;
            errorCode = SL_MISSING_FIELDS;
            errorMessage = 'Email ou nom d\'utilisateur et/ou mot de passe manquant';
        } else if (error.message === 'Identifiant ou mot de passe incorrect') {
            statusCode = 401;
            errorCode = SL_INVALID_CREDENTIALS;
            errorMessage = 'Identifiant ou mot de passe incorrect';
        } else if (error.message === 'Le mot de passe ou l\'identifiant n\'est pas valide') {
            statusCode = 403;
            errorCode = SL_DENIED_CREDENTIALS;
            errorMessage = 'Le mot de passe ou l\'identifiant n\'est pas valide';
        } else if (error.message === 'Customer introuvable') {
            statusCode = 403;
            errorCode = NOT_SELLER;
            errorMessage = 'Vendeur introuvable';
        }
        

        res.status(statusCode).json({ code: errorCode, callback: errorMessage });
    }
}

exports.logout = async (req, res) => {
    try {

        res.clearCookie('jwt');
        res.removeHeader('Authorization');

        res.status(200).json({ callback: "Déconnexion réussie" });
    } catch (error) {
        // En cas d'erreur, renvoyer une réponse d'erreur
        console.error("Erreur lors de la déconnexion :", error);
        res.status(500).json({ message: "Une erreur s'est produite lors de la déconnexion" });
    }
};



exports.loginCustomer = async (req, res) => {
    try {
        const { identifier, password } = req.body;
        console.log("identifier: ",identifier," password: ",password)

        if (!identifier || !password) {
            throw new Error('Email ou nom d\'utilisateur et/ou mot de passe manquant');
        }

        if (!isValidIdentifier(identifier) || !isValidPassword(password)) {
            throw new Error('Le mot de passe ou l\'identifiant n\'est pas validee');
        }


        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { email: identifier },
                    { username: identifier }
                ]
            }
        });

        if (!user) {
            throw new Error('Identifiant ou mot de passe incorrect');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new Error('Identifiant ou mot de passe incorrect');
        }

        // Générer le jeton JWT
        jwtGenerator(res, user.id);

        const customer = await Customer.findOne({
            where: { idUser: user.id },
            include: User
        });

        if (!customer) {
            throw new Error("Customer introuvable");
        }

        res.status(200).json({ code: CU_LOGGED_IN, callback: customer });

    } catch (error) {
        let statusCode = 500;
        let errorCode = "SERVEUR_000";
        let errorMessage = error.message;

        if (error.message === 'Email ou nom d\'utilisateur et/ou mot de passe manquant') {
            statusCode = 400;
            errorCode = CU_MISSING_FIELDS;
            errorMessage = 'Email ou nom d\'utilisateur et/ou mot de passe manquant';
        } else if (error.message === 'Identifiant ou mot de passe incorrect') {
            statusCode = 401;
            errorCode = CU_INVALID_CREDENTIALS;
            errorMessage = 'Identifiant ou mot de passe incorrect';
        } else if (error.message === 'Le mot de passe ou l\'identifiant n\'est pas valide') {
            statusCode = 403;
            errorCode = CU_DENIED_CREDENTIALS;
            errorMessage = 'Le mot de passe ou l\'identifiant n\'est pas valide';
        } else if (error.message === 'Customer introuvable') {
            statusCode = 403;
            errorCode = NOT_CUSTOMER;
            errorMessage = 'Customer introuvable';
        }
        

        res.status(statusCode).json({ code: errorCode, callback: errorMessage });
    }
};

exports.loginDeliver = async(req,res)=>{
    try {
        const {username,password}=req.body;

        if (username == null || username === "" || !isValidString(username)) {
            res.status(400).json({code:30011,message:"username vide ou invalide"});
        } else if (password == null || password === "" || !isValidString(password) ) {
            res.status(400).json({code:30012,message:"password vide ou invalide"});
        }else{
            const deliver = await Deliver.findOne({
                include: [
                    {
                        model: User,
                        where: {username: username}
                    }
                ]
            });
            if(!deliver){
                res.status(404).json({code:30013,message:"livreur n'existe pas"});
            }else{
                const validPassword = await bcrypt.compare(password,deliver.User.password);
                if(deliver && validPassword && deliver.User.userType == "deliver"){
    
                    jwtGenerator(res,deliver.User.id);
                    res.status(200).json({code:30014,deliver:deliver});
    
                }else{
                    res.status(404).json({code:30012.5,message:"nom d'utilisateur ou password incorrect"})
                }
    
            }
        }
    
    } catch (error) {
        console.error(error.message);
        res.status(500).send({code:30010,message:"Erreur serveur"});
    }
}