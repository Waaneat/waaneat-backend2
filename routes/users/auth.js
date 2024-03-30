const authRouter = require("express").Router();
const userController = require("../../controllers/users/authController");

//logins route
authRouter.route("/seller").post(userController.loginSeller);
authRouter.route("/seller/logout").get(userController.logout);
authRouter.route("/customer").post(userController.loginCustomer);
//authRouter.route("/loginDeliver").post(userController.loginDeliver);


module.exports = authRouter;