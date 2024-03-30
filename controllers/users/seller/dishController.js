const Dish = require("../../../models/users/seller/Dish");
const Restaurant = require("../../../models/users/seller/Restaurant");
const User = require("../../../models/users/User");
const Seller = require("../../../models/users/seller/Seller");
const { CU_IDRESTO_NULL, DISH_NOT_FOUND } = require("../../../errors/customer-errors/restaurants");
const { SL_IDRESTO_NULL, SL_IDDISH_NULL, SL_DISH_NOT_FOUND } = require("../../../errors/seller-errors/restaurants");
const { SL_DISH_FETCHED } = require("../../../success/seller-success/restaurants");
const isValidString = require("../../../utils/isValidString");
const isValidImageFormat = require("../../../utils/isValidImageFormat");
const isValidNumeric = require("../../../utils/isValidNumeric");
const { NOT_SELLER, SL_NOT_AUTHENTICATED } = require("../../../errors/seller-errors/auth");
const { DISHNAME_NULL, DISHNAME_INVALID, DISHPRICE_INVALID, DISHDESC_INVALID, DISHIMG_INVALID, IDDISH_NOT_FOUND } = require("../../../errors/seller-errors/dish");
const { RESTO_UNAVAILABLE, DISH_FETCHED, DISH_UNAVAILABLE } = require("../../../success/customer-success/restaurants");
const { DISH_UPDATED, DISH_CREATED, DISH_DELETED, DISH_AVAILABLE } = require("../../../success/seller-success/dish");
const cloudinary = require("../../../utils/cloudinary");


exports.available = async (req, res) => {
    try {
        const idDish = req.params.idDish;
        const idUser = req.userId;

        const {availability} = req.body

        
        if (!idUser) {
            throw new Error('Vous n\'êtes pas authentifié');
        }

        const seller = await Seller.findOne({
            include: [{
                model: User,
                where: { id: `${idUser}` },
            }]
        });
        
        if (!seller || seller.user.userType !== "seller") {
            throw new Error('Vous n\'êtes pas un vendeur');
        }
        
        
        const dish = await Dish.findOne({
            include: [{
                model: Restaurant
            }],
            where: { id: `${idDish}` }
        });
        
        if (dish == null) {
            throw new Error('Plat introuvable');
        }

        const tru= await Dish.update(
            { isAvailable: availability },
            { where: { id: `${idDish}` } }
        );

        console.log("isTure:",tru)

        res.status(200).json({ code: DISH_AVAILABLE, callBack: "Disponibilité changée avec success" });

    } catch (error) {
        let statusCode = 500;
        let errorCode = 'SERVEUR_000';
        let errorMessage = error.message;

        if (error.message === 'Vous n\'êtes pas authentifié') {
            statusCode = 403;
            errorCode = SL_NOT_AUTHENTICATED;
            errorMessage = error.message;
        } else if (error.message === 'Vous n\'êtes pas un vendeur') {
            statusCode = 403;
            errorCode = NOT_SELLER;
            errorMessage = error.message;
        } else if (error.message === 'Plat introuvable') {
            statusCode = 404;
            errorCode = DISH_UNAVAILABLE;
            errorMessage = error.message;
        }

        res.status(statusCode).json({ code: errorCode, message: errorMessage });
    }
};

exports.create = async(req,res)=>{
    try {
        const idUser = req.userId;
        const {dishName,dishPrice,dishDesc,dishImg} = req.body;
        
        const seller = await Seller.findOne(
            {
                include:[
                    {
                        model: User,
                        where: {id: idUser},
                        
                    }
                ] 
            }
        );

        if (seller == null || seller.user.userType != "seller"){
            throw new Error("Vous n'etes pas un vendeur");
        }

        if ((!dishName)) {
            throw new Error('Nom du plat vide ou invalide');
        }
        
        if ((!dishPrice)) {
            throw new Error('Prix du plat vide ou invalide');
        }
    
        if ((!dishDesc)) {
            throw new Error('Description du plat vide ou invalide');
        }
        
        if (!isValidImageFormat(dishImg)) {
            throw new Error('Image du plat vide ou invalide');
        }

        const restaurant = await Restaurant.findOne({
            where:{idSeller:seller.id}
        });

        if (restaurant == null){
            throw new Error('Restaurant introuvable');
        }
        console.log("c ets iciiiiiiiiiiiiiiii",dishImg)
        const dishImgFolder = `assets/${dishImg}`

        const result = await cloudinary.uploader.upload(dishImgFolder, {
            folder: "plats",
        })


        const dish = await Dish.create({
            dishName: dishName,
            dishPrice: dishPrice,
            dishDesc: dishDesc,
            dishImg: dishImg,
            dishUrl: result.secure_url,
            idResto: restaurant.id,
        });

        res.status(200).json({code:DISH_CREATED,callBack:dish});

    } catch (error) {
        let statusCode = 500;
        let errorCode = "SERVEUR_000";
        let errorMessage = error.message;
        console.log(error)
    
        if (error.message === 'Vous n\'etes pas un vendeur') {
            statusCode = 403;
            errorCode = NOT_SELLER;
            errorMessage = error.message;
        } else if(error.message === 'Nom du plat vide ou invalide'){
            statusCode = 403;
            errorCode = DISHNAME_INVALID;
            errorMessage = error.message;
        } else if(error.message === 'Prix du plat vide ou invalide'){
            statusCode = 403;
            errorCode = DISHPRICE_INVALID;
            errorMessage = error.message;
        } else if(error.message === 'Description du plat vide ou invalide'){
            statusCode = 403;
            errorCode = DISHDESC_INVALID;
            errorMessage = error.message;
        } else if(error.message === 'Image du plat vide ou invalide'){
            statusCode = 403;
            errorCode = DISHIMG_INVALID;
            errorMessage = error.message;
        } else if(error.message === 'Restaurant introuvable'){
            statusCode = 404;
            errorCode = RESTO_UNAVAILABLE;
            errorMessage = error.message;
        }
    
        res.status(statusCode).json({ code: errorCode, callback: errorMessage });
    }
}

exports.update = async(req,res)=>{
    try {
        const idUser = req.userId;
        const idDish = req.params.idDish;
        
        console.log("hayyyyyyyyyyyyyyyyy",idUser)
        
        if (!idUser){
            throw new Error("Vous n'etes pas authentifié");
        }

        const {dishName,dishPrice,dishDesc,dishImg} = req.body;
        console.log("dishname:",dishName);
        console.log("dishprice:",dishPrice);
        console.log("dishDESC:",dishDesc);
        console.log("dishImg:",dishImg);

        const seller = await Seller.findOne(
            {
                include:[
                    {
                        model: User,
                        where: {id: `${idUser}`},
                        
                    }
                ] 
            }
        );
        console.log(seller)

        if (seller == null || seller.user.userType != "seller"){
            throw new Error("Vous n'etes pas un vendeur");
        }

        if (idDish == null){
            throw new Error('Id introuvable');
        }

        if ((!dishName)) {
            throw new Error('Nom du plat vide ou invalide');
        }
        
        if ((!dishPrice)) {
            throw new Error('Prix du plat vide ou invalide');
        }
    
        if ((!dishDesc)) {
            throw new Error('Description du plat vide ou invalide');
        }
        
        if (!isValidImageFormat(dishImg)) {
            throw new Error('Image du plat vide ou invalide');
        }

        const restaurant = await Restaurant.findOne(
            {where: {idSeller: seller.id}}
        );

        if (restaurant == null){
            throw new Error('Restaurant introuvable');
        }

        const dish = await Dish.findOne({
            where:{id:idDish}
        });

        if (dish == null){
            throw new Error('Plat introuvable');
        }

        await Dish.update({
                dishName: dishName,
                dishPrice: dishPrice,
                dishDesc: dishDesc,
                dishImg: dishImg,
            }, {where: {id: idDish}}
        );
    
    res.status(200).json({code:DISH_UPDATED,callback:"plat modifié avec success"});

    } catch (error) {
        let statusCode = 500;
        let errorCode = "SERVEUR_000";
        let errorMessage = error.message;
    
        if (error.message === 'Vous n\'etes pas un vendeur') {
            statusCode = 403;
            errorCode = NOT_SELLER;
            errorMessage = error.message;
        } else if(error.message === 'Nom du plat vide ou invalide'){
            statusCode = 403;
            errorCode = DISHNAME_INVALID;
            errorMessage = error.message;
        } else if(error.message === 'Prix du plat vide ou invalide'){
            statusCode = 403;
            errorCode = DISHPRICE_INVALID;
            errorMessage = error.message;
        } else if(error.message === 'Description du plat vide ou invalide'){
            statusCode = 403;
            errorCode = DISHDESC_INVALID;
            errorMessage = error.message;
        } else if(error.message === 'Image du plat vide ou invalide'){
            statusCode = 403;
            errorCode = DISHIMG_INVALID;
            errorMessage = error.message;
        } else if(error.message === 'Restaurant introuvable'){
            statusCode = 404;
            errorCode = RESTO_UNAVAILABLE;
            errorMessage = error.message;
        } else if(error.message === 'Plat introuvable'){
            statusCode = 404;
            errorCode = DISH_NOT_FOUND;
            errorMessage = error.message;
        } else if(error.message === 'Id introuvable'){
            statusCode = 404;
            errorCode = IDDISH_NOT_FOUND;
            errorMessage = error.message;
        }
    
        res.status(statusCode).json({ code: errorCode, callback: errorMessage });
    }
}

exports.delete = async(req,res)=>{
    try {
        const idUser = req.userId;
        const idDish = req.params.idDish;

        if(!idUser){
            throw new Error("Vous n'etes pas authentifié")
        }

        const seller = await Seller.findOne(
            {
                include:[
                    {
                        model: User,
                        where: {id: idUser},
                        
                    }
                ] 
            }
        );

        if (seller == null || seller.user.userType != "seller"){
            throw new Error("Vous n'etes pas un vendeur");
        }

        if (idDish == null){
            throw new Error('Id introuvable');
        }

        const restaurant = await Restaurant.findOne(
            {where: {idSeller: seller.id}}
        );

        if (restaurant == null){
            throw new Error('Restaurant introuvable');
        }

        const dish = await Dish.findOne({
            where:{id:idDish}
        });

        if (dish == null){
            throw new Error('Plat introuvable');
        }

        await Dish.destroy(
            {where: {id: idDish}}
        );
        
        res.status(200).json({code:DISH_DELETED,callBack:"plat supprimé avec succes"});
        
        
        
    } catch (error) {
        let statusCode = 500;
        let errorCode = "SERVEUR_000";
        let errorMessage = error.message;
    
        if (error.message === 'Vous n\'etes pas un vendeur') {
            statusCode = 403;
            errorCode = NOT_SELLER;
            errorMessage = error.message;
        } else if(error.message === 'Restaurant introuvable'){
            statusCode = 404;
            errorCode = RESTO_UNAVAILABLE;
            errorMessage = error.message;
        } else if(error.message === 'Plat introuvable'){
            statusCode = 404;
            errorCode = DISH_NOT_FOUND;
            errorMessage = error.message;
        } else if(error.message === 'Id introuvable'){
            statusCode = 404;
            errorCode = IDDISH_NOT_FOUND;
            errorMessage = error.message;
        }
    
        res.status(statusCode).json({ code: errorCode, callback: errorMessage });
    }
}

exports.get = async(req,res)=>{
    try {
        const idDish = req.params.idDish;
        console.log("hereeeeeeeeeeeeeeeeeeeeeeee")
        
        if (idDish == null) {
            throw new Error('Id introuvable');
        }

        const dish = await Dish.findOne({
            where:{id:idDish},
        });
        
        if(dish == null){
            res.status(404).json({code:SL_DISH_NOT_FOUND,callback:"Plat introuvable"});
        }else{
            res.status(200).json({code:SL_DISH_FETCHED,callback:dish});
        }
        
        
    } catch (error) {
        let statusCode = 500;
        let errorCode = "SERVEUR_000";
        let errorMessage = 'Serveur erreur';
        
        if (error.message === 'Id introuvable') {
            statusCode = 404;
            errorCode = SL_IDDISH_NULL;
            errorMessage = 'Id indisponible';
        } else if (error.message === 'Restaurant introuvable') {
            statusCode = 404;
            errorCode = SL_IDRESTO_NULL;
            errorMessage = 'Restaurant introuvable';
        }
    
        res.status(statusCode).json({ code: errorCode, callback: errorMessage });
    }
}

exports.getAllDishesById = async(req,res)=>{
    try {
        const idResto = req.params.idResto;
        
        if (idResto == null) {
            throw new Error('Id introuvable');
        }

        const dishes = await Dish.findAll({
            where:{idResto:idResto},
        });
        
        if(dishes == null){
            res.status(404).json({code:SL_DISH_NOT_FOUND,callBack:"Plats indisponible"});
        }else{
            res.status(200).json({code:SL_DISH_FETCHED,callBack:dishes});
        }
        
        
    } catch (error) {
        let statusCode = 500;
        let errorCode = "SERVEUR_000";
        let errorMessage = error.message;
        
        if (error.message === 'Id introuvable') {
            statusCode = 404;
            errorCode = SL_IDDISH_NULL;
            errorMessage = error.message;
        }
    
        res.status(statusCode).json({ code: errorCode, callback: errorMessage });
    }
}

exports.getAllForSeller = async (req, res) => {
    try {
        const userId = req.userId;

        if (!userId || userId == ""){
            throw new Error('Vous n\'êtes pas authentifié');
        }

        const seller = await Seller.findOne(
            {
                include:[
                    {
                        model: User,
                        where: {id: `${userId}`},
                        
                    }
                ] 
            }
        );
        
        if (seller.user.userType !== "seller") {
            throw new Error('Vous n\'êtes pas un vendeur');
        }

        const restaurant = await Restaurant.findOne({
            where: { idSeller: seller.id }
        });

        if (!restaurant) {
            throw new Error('Restaurant introuvable');
        }

        const dishes = await Dish.findAll({
            where: { idResto: restaurant.id }
        });

        if (!dishes || dishes.length === 0) {
            res.status(200).json({ code: "333", callback: ["Aucun plat disponible"] });
        }else if(dishes.length > 0) {
            res.status(200).json({ code: DISH_FETCHED, callback: dishes });
        }

    } catch (error) {
        let statusCode = 500;
        let errorCode = 'SERVEUR_000';
        let errorMessage = error.message;

        if (error.message === 'Vous n\'êtes pas authentifié') {
            statusCode = 403;
            errorCode = SL_NOT_AUTHENTICATED;
            errorMessage = error.message;
        } else if (error.message === 'Vous n\'êtes pas un vendeur') {
            statusCode = 403;
            errorCode = NOT_SELLER;
            errorMessage = error.message;
        } else if (error.message === 'Restaurant introuvable') {
            statusCode = 404;
            errorCode = RESTO_UNAVAILABLE;
            errorMessage = error.message;
        } else if (error.message === 'Aucun plat disponible') {
            statusCode = 404;
            errorCode = DISH_UNAVAILABLE;
            errorMessage = error.message;
        }

        res.status(statusCode).json({ code: errorCode, callback: errorMessage });
    }
};

exports.getAllForCustomer = async (req, res) => {
    try {

        const dishes = await Dish.findAll({});
        res.status(200).json({ code: DISH_FETCHED, callback: dishes });

    } catch (error) {
        let statusCode = 500;
        let errorCode = 'SERVEUR_000';
        let errorMessage = error.message;

        if (error.message === 'Vous n\'êtes pas authentifié') {
            statusCode = 403;
            errorCode = SL_NOT_AUTHENTICATED;
            errorMessage = error.message;
        } else if (error.message === 'Vous n\'êtes pas un vendeur') {
            statusCode = 403;
            errorCode = NOT_SELLER;
            errorMessage = error.message;
        } else if (error.message === 'Restaurant introuvable') {
            statusCode = 404;
            errorCode = RESTO_UNAVAILABLE;
            errorMessage = error.message;
        } else if (error.message === 'Aucun plat disponible') {
            statusCode = 404;
            errorCode = DISH_UNAVAILABLE;
            errorMessage = error.message;
        }

        res.status(statusCode).json({ code: errorCode, callback: errorMessage });
    }
};

exports.getAllDishesByIdForCustomer = async (req, res) => {
    try {

        const idResto = req.params.idResto;

        const dishes = await Dish.findAll({where:{idResto:`${idResto}`}});
        res.status(200).json({ code: DISH_FETCHED, callback: dishes });

    } catch (error) {
        let statusCode = 500;
        let errorCode = 'SERVEUR_000';
        let errorMessage = error.message;

        if (error.message === 'Vous n\'êtes pas authentifié') {
            statusCode = 403;
            errorCode = SL_NOT_AUTHENTICATED;
            errorMessage = error.message;
        } else if (error.message === 'Vous n\'êtes pas un vendeur') {
            statusCode = 403;
            errorCode = NOT_SELLER;
            errorMessage = error.message;
        } else if (error.message === 'Restaurant introuvable') {
            statusCode = 404;
            errorCode = RESTO_UNAVAILABLE;
            errorMessage = error.message;
        } else if (error.message === 'Aucun plat disponible') {
            statusCode = 404;
            errorCode = DISH_UNAVAILABLE;
            errorMessage = error.message;
        }

        res.status(statusCode).json({ code: errorCode, callback: errorMessage });
    }
};

exports.getDishDataForCustomer = async(req,res)=>{
    try {
        const idDish = req.params.idDish;
        
        if (idDish == null) {
            throw new Error('Id introuvable');
        }

        const dish = await Dish.findOne({
            where:{id:idDish},
        });

        data = {
            id:dish.id,
            dishName:dish.dishName,
            dishDesc:dish.dishDesc,
            dishPrice:dish.dishPrice,
            dishImg:dish.dishImg,
            idResto:dish.idResto
          }
        
        res.status(200).json({code:SL_DISH_FETCHED,callback:{"data":data}});
        
        
    } catch (error) {
        let statusCode = 500;
        let errorCode = "SERVEUR_000";
        let errorMessage = 'Serveur erreur';
        
        if (error.message === 'Id introuvable') {
            statusCode = 404;
            errorCode = SL_IDDISH_NULL;
            errorMessage = 'Id indisponible';
        } else if (error.message === 'Restaurant introuvable') {
            statusCode = 404;
            errorCode = SL_IDRESTO_NULL;
            errorMessage = 'Restaurant introuvable';
        }
    
        res.status(statusCode).json({ code: errorCode, callback: errorMessage });
    }
}