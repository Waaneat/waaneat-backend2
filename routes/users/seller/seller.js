const sellerRouter = require("express").Router();
const sellerController = require("../../../controllers/users/seller/sellerController");
const auth = require("../../../middlewares/authorisation");


sellerRouter.route("/register").post(sellerController.create);
sellerRouter.route("/:idUser/edit").put(auth , sellerController.update);
sellerRouter.route("/:idUser").get(auth , sellerController.get);
sellerRouter.route("/:idUser/delete").delete(auth , sellerController.delete);

module.exports = sellerRouter;