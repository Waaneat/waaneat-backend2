const adminAuthRouter = require("express").Router();
//const validInfo = require("../middlewares/validInfo");
const adminAuthController = require("../../controllers/admin/adminAuthController");

//logins route
adminAuthRouter.route("/admin").post(adminAuthController.loginAdmin);


module.exports = adminAuthRouter;