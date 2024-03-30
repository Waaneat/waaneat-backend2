const clientRouter = require("express").Router();
// const validInfo = require("../middlewares/validInfo");
const clientController = require("../../../controllers/users/customer/clientController");
// const authorisation = require("../middlewares/authorisation");

clientRouter.route("/restaurants/:idResto").get(clientController.getRestaurant);
clientRouter.route("/restaurants").get(clientController.getAllRestaurant);
clientRouter.route("/dishes/:idResto").get(clientController.getAllDishesByIdResto);
clientRouter.route("/dish/:idDish").get(clientController.getDish);
// clientRouter.route("/getAllOrders").get(authorisation,clientController.getAllOrders);

module.exports = clientRouter;