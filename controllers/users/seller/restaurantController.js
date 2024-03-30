const User = require("../../../models/users/User");
const Seller = require("../../../models/users/seller/Seller");
const Restaurant = require("../../../models/users/seller/Restaurant");
const { RESTAURANT_AVAILABLE } = require("../../../success/seller-success/restaurants");
const { SL_NOT_AUTHENTICATED, NOT_SELLER } = require("../../../errors/seller-errors/auth");
const { RESTO_UNAVAILABLE } = require("../../../success/customer-success/restaurants");

exports.available = async (req, res) => {
    try {
        const idUser = req.userId;
        const idResto = req.params.idResto
        
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
        
        const restaurant = await Restaurant.findOne({
            where: { id: `${idResto}` }
        });
        
        if (!restaurant) {
            throw new Error('Restaurant introuvable');
        }

        await Restaurant.update(
            { isAvailable: !restaurant.isAvailable },
            { where: { id: `${idResto}` } }
        );

        res.status(200).json({ code: RESTAURANT_AVAILABLE, callback: "Disponibilité changée" });

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
        }

        res.status(statusCode).json({ code: errorCode, message: errorMessage });
    }
};

exports.getRestaurantDataForCustomer = async (req,res)=>{
    try {
        const idResto = req.params.idResto;

        if (idResto==null) {
            throw new Error('Requete incorrecte');
        }

        const restaurant = await Restaurant.findOne({
            include: [{
                model: Seller,
                
                include: [{
                    model: User,
                }],
            }],
            where: { id: `${idResto}` },
        });

        const data = {
            id:restaurant.id,
            restoName:restaurant.restoName,
            tel:restaurant.seller.user.tel,
            adress:restaurant.seller.user.adress,
            restoDesc:restaurant.restoDesc,
            hourStart:restaurant.hourStart,
            hourEnd:restaurant.hourEnd,
            isAvailable:restaurant.isAvailable
        }


        res.status(200).json({ code: RESTAURANT_AVAILABLE, callback: {"data":data} });

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
        }

        res.status(statusCode).json({ code: errorCode, message: errorMessage });
    }
}

exports.getRestaurantDatas = async (req,res)=>{
    try {
        const idUser = req.userId;

        if (!idUser) {
            throw new Error('Vous n\'êtes pas authentifié');
        }

        const restaurant = await Restaurant.findOne({
            include: [{
                model: Seller,
                where: { idUser: `${idUser}` },
                
                include: [{
                    model: User,
                }],
            }]
        });

        // console.log(restaurant)

        if (!restaurant || restaurant.seller.user.userType !== "seller") {
            throw new Error('Vous n\'êtes pas un vendeur');
        }

        const data = {
            id:restaurant.id,
            restoName:restaurant.restoName,
            username: restaurant.seller.user.username,
            email:restaurant.seller.user.email,
            tel:restaurant.seller.user.tel,
            restoDesc:restaurant.restoDesc,
            hourStart:restaurant.hourStart,
            hourEnd:restaurant.hourEnd,
            isAvailable:restaurant.isAvailable
        }


        res.status(200).json({ code: RESTAURANT_AVAILABLE, callback: {"data":data} });

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
        }

        res.status(statusCode).json({ code: errorCode, message: errorMessage });
    }
}

exports.updateRestaurantDatas = async (req,res)=>{
    try {
        const idUser = req.userId;
        const idResto = req.params.idResto;

        const { restoName , username , email , tel , restoDesc , hourStart , hourEnd } = req.body;

        if (!idUser) {
            throw new Error('Vous n\'êtes pas authentifié');
        }
        
        const restaurant = await Restaurant.findOne({
            where: {id:`${idResto}`}
        });
        
        if (!restaurant) {
            throw new Error('Vous n\'êtes pas un vendeur');
        }
        
        
        await Restaurant.update(
            { restoName , restoDesc , hourStart , hourEnd },
            { where:{id: `${restaurant.id}` }}
        );
        
        console.log("c deja la ")
        await User.update(
            { username , email , tel } ,
            { where:{id: `${idUser}` }}
        );


        res.status(200).json({ code: RESTAURANT_AVAILABLE, callback: "modifié avec success" });

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
        }

        res.status(statusCode).json({ code: errorCode, message: errorMessage });
    }
}

exports.updateRestoDesc = async (req,res)=>{
    try {
        const idUser = req.userId;
        const idResto = req.params.idResto;

        
        const { restoDesc } = req.body;
        console.log("resto description:",restoDesc)


        if (!idUser) {
            throw new Error('Vous n\'êtes pas authentifié');
        }
        
        const restaurant = await Restaurant.findOne({
            where: {id:`${idResto}`}
        });
        
        if (!restaurant) {
            throw new Error('Vous n\'êtes pas un vendeur');
        }
        
        
        const v = await Restaurant.update(
            { restoDesc },
            { where:{id: `${restaurant.id}` }}
        );
            
        res.status(200).json({ code: RESTAURANT_AVAILABLE, callback: "modifié avec success" });

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
        }

        res.status(statusCode).json({ code: errorCode, message: errorMessage });
    }
}
exports.getSomeResto = async (req,res)=>{
    try {

        const restaurant = await Restaurant.findAll({
            limit: 8,
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json({ code: RESTAURANT_AVAILABLE, callback: restaurant });

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
        }

        res.status(statusCode).json({ code: errorCode, message: errorMessage });
    }
}

exports.getAllResto = async (req,res)=>{
    try {

        const restaurant = await Restaurant.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json({ code: RESTAURANT_AVAILABLE, callback: restaurant });

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
        }

        res.status(statusCode).json({ code: errorCode, message: errorMessage });
    }
}