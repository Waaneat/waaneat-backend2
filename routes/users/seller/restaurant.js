const restaurantRouter = require("express").Router();
const auth = require("../../../middlewares/authorisation");
const restaurantController = require("../../../controllers/users/seller/restaurantController");


restaurantRouter.route("/updateAvailability/:idResto").put(auth , restaurantController.available);
restaurantRouter.route("/getRestaurantData").get(auth , restaurantController.getRestaurantDatas);
restaurantRouter.route("/someRestos").get(restaurantController.getSomeResto);
restaurantRouter.route("/all").get(restaurantController.getAllResto);
restaurantRouter.route("/updateRestaurantData/:idResto").put(auth , restaurantController.updateRestaurantDatas);
restaurantRouter.route("/updateRestoDesc/:idResto").put(auth , restaurantController.updateRestoDesc);
restaurantRouter.route("/:idResto").get(restaurantController.getRestaurantDataForCustomer);


module.exports = restaurantRouter;