const customerRouter = require("express").Router();
//const validInfo = require("../middlewares/validInfo");
const customerController = require("../../../controllers/users/customer/customerController");

//CRUD
customerRouter.route("/register").post(customerController.create);
customerRouter.route("/edit").put(customerController.update);
customerRouter.route("/").get(customerController.get);
customerRouter.route("/delete").delete(customerController.delete);

module.exports = customerRouter;