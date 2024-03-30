const { CU_IDRESTO_NULL, DISH_NOT_FOUND } = require("../../../errors/customer-errors/restaurants");
const User = require("../../../models/users/User");
const Customer = require("../../../models/users/customer/Customer");
const Favorite = require("../../../models/users/customer/Favorite");
const Dish = require("../../../models/users/seller/Dish");
const Restaurant = require("../../../models/users/seller/Restaurant");
const Seller = require("../../../models/users/seller/Seller");
const { RESTO_FETCHED, RESTO_UNAVAILABLE, DISH_UNAVAILABLE, DISH_FETCHED } = require("../../../success/customer-success/restaurants");

exports.getRestaurant = async (req, res) => {
    try {
        
        const idRestaurant = req.params.idResto;

        if (idRestaurant == null) {
            throw new Error('Id introuvable');
        }
        
        const restaurant = await Restaurant.findOne({
            where:{id:idRestaurant},
        });

        if(restaurant == null || restaurant.length == 0){
           res.status(404).json({code:RESTO_UNAVAILABLE,callback:"Restaurant introuvable"});
        }else{
            res.status(200).json({code:RESTO_FETCHED,callback:restaurant});
        }


    } catch (error) {
        let statusCode = 500;
        let errorCode = "SERVEUR_000";
        let errorMessage = error.message;
        
        if (error.message === 'Id indisponible') {
            statusCode = 404;
            errorCode = CU_IDRESTO_NULL;
            errorMessage = error.message;
        }
    
        res.status(statusCode).json({ code: errorCode, callback: errorMessage });
    }
};

exports.getAllRestaurant = async (req, res) => {
    try {
        
        const restaurants = await Restaurant.findAll({});

        if(restaurants == null || restaurants.length == 0){
           res.status(404).json({code:RESTO_UNAVAILABLE,callback:"Aucun restaurant disponible"});
        }else{
            res.status(200).json({code:RESTO_FETCHED,callback:restaurants});
        }


    } catch (error) {
        let statusCode = 500;
        let errorCode = "SERVEUR_000";
        let errorMessage = error.message;
    
        res.status(statusCode).json({ code: errorCode, callback: errorMessage });
    }
};


exports.getAllDishesByIdResto = async (req, res) => {
    try {
        const idResto = req.params.idResto;

        if (idResto == null) {
            throw new Error('Id introuvable');
        }

        const restaurant = await Restaurant.findOne(
            {where: {id: idResto}}
        );

        if (restaurant == null) {
            throw new Error('Restaurant introuvable');
        }

        const dishes = await Dish.findAll(
            {where: {idResto: idResto}}
        );

        if(dishes == null || dishes.length == 0){
            res.status(404).json({code:DISH_UNAVAILABLE,callback:"Aucun plat disponible"});
        }else{
            res.status(200).json({code:DISH_FETCHED,callback:dishes});
        }

    } catch (error) {
        let statusCode = 500;
        let errorCode = "SERVEUR_000";
        let errorMessage = error.message;

        if (error.message === 'Id introuvable') {
            statusCode = 404;
            errorCode = CU_IDRESTO_NULL;
            errorMessage = error.message;
        } else if (error.message === 'Restaurant introuvable') {
            statusCode = 404;
            errorCode = RESTO_UNAVAILABLE;
            errorMessage = error.message;
        }
    
        res.status(statusCode).json({ code: errorCode, callback: errorMessage });
    }
};

exports.getDish = async (req, res) => {
    try {
        const idDish = req.params.idDish;

        if (idDish == null) {
            throw new Error('Id introuvable');
        }

        const dish = await Dish.findOne(
            {where: {idResto: idDish}}
        );

        if (dish == null || dish.length == 0) {
            throw new Error('Plat introuvable');
        }

        
        res.status(200).json({code:DISH_FETCHED,callback:dish});
        

    } catch (error) {
        let statusCode = 500;
        let errorCode = "SERVEUR_000";
        let errorMessage = error.message;

        if (error.message === 'Id introuvable') {
            statusCode = 404;
            errorCode = CU_IDRESTO_NULL;
            errorMessage = error.message;
        } else if (error.message === 'Plat introuvable') {
            statusCode = 404;
            errorCode = DISH_NOT_FOUND;
            errorMessage = error.message;
        }
    
        res.status(statusCode).json({ code: errorCode, callback: errorMessage });
    }
};


exports.getAllRestoByAdress = async (req, res) => {
    try {

    const {adress} = req.body;
    const customer = await Customer.findOne(
        {
            include:[
                {
                    model: User,
                    where: {id: req.cookies.userId},
                }
            ] 
        }
    );

    if(customer == null || customer.user.userType != "customer"){
        res.status(403).json({code:10090.5,message:"Vous n'etes pas un client"});
    }else if(customer != null){
        const restaurants = await Restaurant.findAll({
            include: [
                {
                    model: Seller,
                    include: [
                        {
                            model: User,
                            where: {
                                adress: adress
                            }
                        }
                    ]
                }
            ]
        });

        if(restaurants == null || restaurants.length==0){
            res.status(404).json({code:10090.6,message:"Aucun restaurant disponible a cet adresse"})
        }else{
            res.status(200).json({code:10091,restaurants:restaurants});
        }
    }
    } catch (error) {
      console.error(error.message);
      res.status(500).json({code:10090,message:"Erreur serveur"});
    }
};


