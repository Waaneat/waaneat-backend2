const dishRouter = require("express").Router();
const auth = require("../../../middlewares/authorisation");
const dishController = require("../../../controllers/users/seller/dishController");

//CRUD
dishRouter.route("/updateDishAvailability/:idDish").put(auth , dishController.available);
dishRouter.route("/create").post(auth , dishController.create);
dishRouter.route("/edit/:idDish").put(auth , dishController.update);
dishRouter.route("/delete/:idDish").delete(auth , dishController.delete);
dishRouter.route("/all").get(auth , dishController.getAllForSeller);
dishRouter.route("/customer/all").get(dishController.getAllForCustomer);
dishRouter.route("/customer/all/:idResto").get(dishController.getAllDishesByIdForCustomer);
dishRouter.route("/:idDish").get(auth , dishController.get);
dishRouter.route("/customer/:idDish").get( dishController.getDishDataForCustomer);


module.exports = dishRouter;