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

exports.login = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await authService.loginUser(
            email,
            password
        );

      
        res.cookie("token", user.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json(
            new ApiResponse(
                true,
                "Login Successful",
                user
            )
        );

    } catch (error) {

        return res.status(400).json(
            new ApiResponse(
                false,
                error.message
            )
        );

    }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    await authService.createPasswordResetToken(email);

    return res.status(200).json({
      success: true,
      message:
        "If an account exists with that email, a password reset link has been sent.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json(
                new ApiResponse(
                    false,
                    "Token and new password are required"
                )
            );
        }

        await authService.resetPassword(token, newPassword);

        return res.status(200).json(
            new ApiResponse(
                true,
                "Password reset successfully"
            )
        );
    } catch (error) {
        return res.status(400).json(
            new ApiResponse(false, error.message)
        );
    }
};
