const express = require("express");
const customerRouter = require("./users/customer/customer");
const authRouter = require("./users/auth");
const clientRouter = require("./users/customer/client");
const sellerRouter = require("./users/seller/seller");
const dishRouter = require("./users/seller/dish");
const restaurantRouter = require("./users/seller/restaurant");
const adminRouter = require("./admin/admin");
const adminAuthRouter = require("./admin/adminAuth");

const router = express.Router();

router.get('/',(req,res)=>{
    res.send("welcome to our backend");
});

router.use("/api/auth",authRouter);
router.use("/api/auth",adminAuthRouter);
router.use("/api/customers",customerRouter);

router.use("/api/seller",sellerRouter);
router.use("/api/dish",dishRouter);

router.use("/api/clients",clientRouter);
router.use("/api/restaurant",restaurantRouter);
router.use("/api/admins",adminRouter);

module.exports = router;