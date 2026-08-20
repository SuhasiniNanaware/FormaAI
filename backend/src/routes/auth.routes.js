const express = require("express");

const router = express.Router();

const authController = require("../controllers/auth.controller");

const {
    registerValidation,
    loginValidation,
} = require("../validators/auth.validator");

router.post(
    "/register",
    registerValidation,
    authController.register
);

router.post(
    "/login",
    loginValidation,
    authController.login
);

router.get(
    "/verify/:token",
    authController.verifyEmail
);

router.post(
  "/forgot-password",
  authController.forgotPassword
);

router.post(
    "/reset-password",
    authController.resetPassword
);

module.exports = router;