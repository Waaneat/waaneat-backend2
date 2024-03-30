const jwtGenerator = require("../../../utils/jwtGenerator");
const bcrypt = require("bcrypt");
const Restaurant = require("../../../models/users/seller/Restaurant");
const { Op } = require("sequelize");
const isValidImageFormat = require("../../../utils/isValidImageFormat");
const isValidString = require("../../../utils/isValidString");
const User = require("../../../models/users/User");
const Seller = require("../../../models/users/seller/Seller");
const { isValidGmail } = require("../../../utils/isValidIdentifier");
const isValidPassword = require("../../../utils/isValidPassword");
const { SL_USERNAME_INVALID, SL_EMAIL_INVALID, SL_TEL_INVALID, SL_PASSWORD_INVALID, SL_ADRESS_INVALID, SL_COMPANY_INVALID, SL_CI_INVALID, SL_CATEGORY_INVALID, SL_HOURSTART_INVALID, SL_HOUREND_INVALID, SL_ALREADY_EXISTS, SL_HOURENDSUP_INVALID, SL_NOT_AUTHENTICATED, SL_NULL_UPDATE, SL_NOT_FOUND } = require("../../../errors/seller-errors/auth");
const { SL_CREATED, SL_UPDATED, SL_DELETED, SL_FETCHED } = require("../../../success/seller-success/auth");
const isValidTime = require("../../../utils/isValidTime");
const isHourEndLaterThanStart = require("../../../utils/isHourEndLaterThanHourStart");


exports.create = async(req,res)=>{
    try {
        
        const { username , email , tel , password , adress , companyName , identityCard , category , hourStart , hourEnd } = req.body;
        
        console.log("hourStart:",hourStart);
        console.log("hourEnd:",hourEnd);

        if (!isValidString(username)) {
            throw new Error('Username vide ou invalide');
        }
      
        if (!isValidGmail(email)) {
            throw new Error('Email vide ou invalide');
        }
      
        if (!isValidString(tel)) {
            throw new Error('Telephone vide ou invalide');
        }
      
        if (!isValidPassword(password)) {
            throw new Error('Password vide , invalide ou trop court');
        }
      
        if (!isValidString(adress)) {
            throw new Error('Adresse vide ou invalide');
        }

        if (!isValidString(companyName)) {
            throw new Error('Entreprise vide ou invalide');
        }

        if (!isValidImageFormat(identityCard)) {
            throw new Error('carte d\'identité vide ou invalide');
        }

        if (!isValidString(category)) {
            throw new Error('categorie vide ou invalide');
        }
        
        if (!isValidTime(hourStart)) {
            throw new Error('heure d\'ouverture vide ou invalide'); 
        }

        if (!isValidTime(hourEnd)) {
            throw new Error('heure de fermeture vide ou invalide');
        }

        if (!isHourEndLaterThanStart(hourStart,hourEnd)) {
            throw new Error('L\'heure de fermeture doit etre supperieure');
        }


        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { username: username },
                    { email: email }
                ]
            }
        });

        if(user){
            throw new Error('Vendeur existe deja');
        }

        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const bcryptPassword = await bcrypt.hash(password,salt);

        const newUser = await User.create({ 
            username: username,
            email:email,
            tel: tel,
            password: bcryptPassword,
            adress: adress,
            userType: "seller"
        });

        const newSeller = await Seller.create({
            companyName:companyName,
            identityCard:identityCard,
            category:category,
            idUser:newUser.id
        })
        
        const token = jwtGenerator(res,newUser.id);

        await Restaurant.create({
            restoName:newSeller.companyName,
            restoDesc:"pas de description",
            hourStart:hourStart,
            hourEnd:hourEnd,
            idSeller:newSeller.id
        })
        
        const seller = await Seller.findOne({
            where: { idUser: newUser.id }, // Assure-toi de fournir une condition appropriée ici
            include: User
        });
        
        if(!seller){
            throw new Error('Vendeur introuvable'); 
        }

        res.status(200).json({code:SL_CREATED,callback:{"token":token}});
        
    } catch (error) {
        let statusCode = 500;
        let errorCode = "SERVEUR_000";
        let errorMessage = error.message;
    
        
        if (error.message === 'Username vide ou invalide') {
            statusCode = 400;
            errorCode = SL_USERNAME_INVALID;
            errorMessage = error.message;
        } else if (error.message === 'Email vide ou invalide') {
            statusCode = 400;
            errorCode = SL_EMAIL_INVALID;
            errorMessage = error.message;
        } else if (error.message === 'Telephone vide ou invalide') {
            statusCode = 400;
            errorCode = SL_TEL_INVALID;
            errorMessage = error.message;
        } else if (error.message === 'Password vide , invalide ou trop court') {
            statusCode = 400;
            errorCode = SL_PASSWORD_INVALID;
            errorMessage = error.message;
        } else if (error.message === 'Adresse vide ou invalide') {
            statusCode = 400;
            errorCode = SL_ADRESS_INVALID;
            errorMessage = error.message;
        } else if (error.message === 'Entreprise vide ou invalide') {
            statusCode = 400;
            errorCode = SL_COMPANY_INVALID;
            errorMessage = error.message;
        } else if (error.message === 'carte d\'identité vide ou invalide') {
            statusCode = 400;
            errorCode = SL_CI_INVALID;
            errorMessage = error.message;
        } else if (error.message === 'categorie vide ou invalide') {
            statusCode = 400;
            errorCode = SL_CATEGORY_INVALID;
            errorMessage = error.message;
        } else if (error.message === 'heure d\'ouverture vide ou invalide') {
            statusCode = 400;
            errorCode = SL_HOURSTART_INVALID;
            errorMessage = error.message;
        } else if (error.message === 'heure de fermeture vide ou invalide') {
            statusCode = 400;
            errorCode = SL_HOUREND_INVALID;
            errorMessage = error.message;
        } else if (error.message === 'L\'heure de fermeture doit etre supperieure') {
            statusCode = 400;
            errorCode = SL_HOURENDSUP_INVALID;
            errorMessage = error.message;
        } else if (error.message === 'Vendeur existe deja') {
            statusCode = 409;
            errorCode = SL_ALREADY_EXISTS;
            errorMessage = error.message;
        }
    
        res.status(statusCode).json({ code: errorCode, callback: errorMessage });
    }
}

exports.update = async (req, res) => {
    try {
        const userIdFromStorage = req.params.idUser;

        const { username , email , tel , adress , companyName , hourStart, hourEnd } = req.body;

        const seller = await Seller.findOne({
            where: { idUser: `${userIdFromStorage}` },
            include: { model: User },
        });

        if (!seller) {
            throw new Error('Vendeur introuvable');
        }

        if (!userIdFromStorage) {
            throw new Error('Vous n\'etes pas authentifié');
        }

        if(username == null || email == null || tel == null || adress == null || companyName == null || hourStart == null || hourEnd == null){
            throw new Error('Veuillez remplir tous les champs');
        }

        if (!isValidString(username)) {
            throw new Error('Username vide ou invalide');
        }
      
        if (!isValidGmail(email)) {
            throw new Error('Email vide ou invalide');
        }
      
        if (!isValidString(tel)) {
            throw new Error('Telephone vide ou invalide');
        }
      
        if (!isValidString(adress)) {
            throw new Error('Adresse vide ou invalide');
        }

        if (!isValidString(companyName)) {
            throw new Error('Entreprise vide ou invalide');
        }
        
        if (!isValidTime(hourStart)) {
            throw new Error('heure d\'ouverture vide ou invalide'); 
        }

        if (!isValidTime(hourEnd)) {
            throw new Error('heure de fermeture vide ou invalide');
        }

        if (!isHourEndLaterThanStart(hourStart,hourEnd)) {
            throw new Error('L\'heure de fermeture doit etre supperieure');
        }

        await User.update(
            {
                username: username,
                email: email,
                tel: tel,
                adress: adress,
            },
            {
                where: { id: userIdFromStorage },
            }
        );

        await Seller.update(
            {
                companyName: companyName,
            },
            {
                where: { idUser: userIdFromStorage },
            }
        );

        await Restaurant.update(
            {
                restoName: companyName,
                restoDesc: "pas de description",
                hourStart: hourStart,
                hourEnd: hourEnd,
            },
            {
                where: { idSeller: seller.id },
            }
        );

        res.status(200).json({ code: SL_UPDATED, callback: 'Vendeur modifié avec succès' });
    } catch (error) {
        // Handle errors
        let statusCode = 500;
        let errorCode = 'SERVEUR_000';
        let errorMessage = error.message;

        if (error.message === 'Vous n\'etes pas authentifié') {
            statusCode = 401;
            errorCode = SL_NOT_AUTHENTICATED;
            errorMessage = 'User not authenticated';
        } else if (error.message === 'Username vide ou invalide') {
            statusCode = 400;
            errorCode = SL_USERNAME_INVALID;
            errorMessage = error.message;
        } else if (error.message === 'Email vide ou invalide') {
            statusCode = 400;
            errorCode = SL_EMAIL_INVALID;
            errorMessage = error.message;
        } else if (error.message === 'Telephone vide ou invalide') {
            statusCode = 400;
            errorCode = SL_TEL_INVALID;
            errorMessage = error.message;
        } else if (error.message === 'Adresse vide ou invalide') {
            statusCode = 400;
            errorCode = SL_ADRESS_INVALID;
            errorMessage = error.message;
        } else if (error.message === 'Entreprise vide ou invalide') {
            statusCode = 400;
            errorCode = SL_COMPANY_INVALID;
            errorMessage = error.message;
        } else if (error.message === 'heure d\'ouverture vide ou invalide') {
            statusCode = 400;
            errorCode = SL_HOURSTART_INVALID;
            errorMessage = error.message;
        } else if (error.message === 'heure de fermeture vide ou invalide') {
            statusCode = 400;
            errorCode = SL_HOUREND_INVALID;
            errorMessage = error.message;
        } else if (error.message === 'L\'heure de fermeture doit etre supperieure') {
            statusCode = 400;
            errorCode = SL_HOURENDSUP_INVALID;
            errorMessage = error.message;
        } else if (error.message === 'User not found') {
            statusCode = 404;
            errorCode = 'SL_USER_NOT_FOUND';
            errorMessage = 'User not found';
        } else if (error.message === 'Veuillez remplir tous les champs') {
            statusCode = 400;
            errorCode = SL_NULL_UPDATE;
            errorMessage = error.message;
        }

        res.status(statusCode).json({ code: errorCode, callback: errorMessage });

    }
};

exports.delete = async (req, res) => {
    try {
        const userIdFromStorage = req.params.idUser;

        const seller = await Seller.findOne({
            where: { idUser: userIdFromStorage },
        });

        if (!seller) {
            throw new Error('Vendeur introuvable');
        }

        if (!userIdFromStorage) {
            throw new Error('Vous n\'etes pas authentifié');
        }

        await Seller.destroy({
            where: { idUser: userIdFromStorage },
        });

        await User.destroy({
            where: { id: userIdFromStorage },
        });

        await Restaurant.destroy({
            where: { idSeller: seller.id },
        });

        res.status(200).json({ code: SL_DELETED, callback: 'Vendeur supprimé avec succès' });
    } catch (error) {
        // Handle errors (similar error handling as in the update method)
        let statusCode = 500;
        let errorCode = 'SERVEUR_000';
        let errorMessage = error.message;

        if (error.message === 'Vous n\'etes pas authentifié') {
            statusCode = 401;
            errorCode = SL_NOT_AUTHENTICATED;
            errorMessage = error.message;
        } else if(error.message === 'Vendeur introuvable'){
            statusCode = 404;
            errorCode = SL_NOT_FOUND;
            errorMessage = error.message;
        }

        res.status(statusCode).json({ code: errorCode, callback: errorMessage });
    }
};

exports.get = async (req, res) => {
    try {
        const userIdFromStorage = req.params.idUser;

        if (!userIdFromStorage) {
            throw new Error('Vous n\'etes pas authentifié');
        }

        const seller = await Seller.findOne({
            where: { idUser: userIdFromStorage }
        });

        if (!seller) {
            throw new Error('Vendeur introuvable');
        }

        res.status(200).json({ code: SL_FETCHED, callback: seller });
    } catch (error) {
        // Handle errors
        let statusCode = 500;
        let errorCode = 'SERVEUR_000';
        let errorMessage = error.message;

        if (error.message === 'Vous n\'etes pas authentifié') {
            statusCode = 401;
            errorCode = SL_NOT_AUTHENTICATED;
            errorMessage = error.message;
        } else if(error.message === 'Vendeur introuvable'){
            statusCode = 404;
            errorCode = SL_NOT_FOUND;
            errorMessage = error.message;
        }

        res.status(statusCode).json({ code: errorCode, callback: errorMessage });
    }
};
