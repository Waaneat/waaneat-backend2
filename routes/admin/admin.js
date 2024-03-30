const adminRouter = require("express").Router();
//const validInfo = require("../middlewares/validInfo");
const adminController = require("../../controllers/admin/adminController");
//const authorisation = require("../middlewares/authorisation");

//CRUD
adminRouter.route("/create").post(adminController.create);
adminRouter.route("/edit/:idAdmin").put(adminController.update);
adminRouter.route("/edit").put(adminController.updateOne);
adminRouter.route("/delete/:idAdmin").delete(adminController.delete);
adminRouter.route("/inf").get(adminController.getOne);
adminRouter.route("/:idAdmin").get(adminController.get);
adminRouter.route("/").get(adminController.getAll);


module.exports = adminRouter;