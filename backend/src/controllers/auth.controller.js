const { validationResult } = require("express-validator");

const ApiResponse = require("../utils/ApiResponse");

const authService = require("../services/auth.service");

const VerificationToken = require("../models/VerificationToken");

exports.register = async (req, res) => {

    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            return res.status(400).json(

                new ApiResponse(

                    false,

                    "Validation Failed",

                    errors.array()

                )

            );

        }

        const { username, email, password } = req.body;

        const user = await authService.registerUser(

            username,

            email,

            password

        );

        return res.status(201).json(

            new ApiResponse(

                true,

                "User Registered Successfully",

                {

                    id: user._id,

                    username: user.username,

                    email: user.email,

                    verified: user.isVerified

                }

            )

        );

    }

    catch (error) {

        return res.status(400).json(

            new ApiResponse(

                false,

                error.message

            )

        );

    }

};

exports.verifyEmail = async (req, res) => {

    try {

        const { token } = req.params;

        const verifyToken =
            await VerificationToken.findOne({ token });

        if (!verifyToken) {

            return res.status(400).json({

                success: false,

                message: "Invalid Token",

            });

        }

        if (verifyToken.expiresAt < Date.now()) {

            return res.status(400).json({

                success: false,

                message: "Token Expired",

            });

        }

        const User = require("../models/User");

        const user =
            await User.findById(verifyToken.userId);

        user.isVerified = true;

        await user.save();

        await VerificationToken.deleteOne({

            _id: verifyToken._id,

        });

        return res.redirect(
            `${process.env.CLIENT_URL}/email-verified`
        );

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};