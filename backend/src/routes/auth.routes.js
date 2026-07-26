const express = require("express");

const router = express.Router();

const authController = require("../controllers/auth.controller");

const {

    registerValidation

} = require("../validators/auth.validator");

router.post(

    "/register",

    registerValidation,

    authController.register

);

router.get(

    "/verify/:token",

    authController.verifyEmail

);

module.exports = router;