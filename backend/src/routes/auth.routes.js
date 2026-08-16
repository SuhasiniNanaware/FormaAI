const express = require("express");

const router = express.Router();

const authController = require("../controllers/auth_controller");

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

// Profile endpoints
const authMiddleware = require('../middleware/auth.middleware');

router.get('/me', authMiddleware, authController.getProfile);
router.put('/me', authMiddleware, authController.updateProfile);

module.exports = router;