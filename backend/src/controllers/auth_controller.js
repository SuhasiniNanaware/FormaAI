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
    const verifyToken = await VerificationToken.findOne({ token });

    if (!verifyToken) {
      return res.status(400).json({ success: false, message: "Invalid Token" });
    }

    if (verifyToken.expiresAt < Date.now()) {
      return res.status(400).json({ success: false, message: "Token Expired" });
    }

    const User = require("../models/User");
    const user = await User.findById(verifyToken.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.isVerified = true;
    await user.save();
    await VerificationToken.deleteOne({ _id: verifyToken._id });

    const frontendUrl = (process.env.CLIENT_URL || "http://localhost:5173").replace(/\/+$/, "");
    return res.redirect(`${frontendUrl}/email-verified`);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await authService.loginUser(
            email,
            password
        );

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

exports.getProfile = async (req, res) => {
  try {
    const user = req.user;
    return res.status(200).json(new ApiResponse(true, 'Profile fetched', {
      id: user._id,
      username: user.username,
      email: user.email,
      verified: user.isVerified,
      role: user.role,
      avatar: user.avatar,
      bio: user.bio || ''
    }));
  } catch (error) {
    return res.status(400).json(new ApiResponse(false, error.message));
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { username, email, bio, avatar } = req.body;
    const user = req.user;

    if (username) user.username = String(username).trim();
    if (email) user.email = String(email).trim().toLowerCase();
    if (typeof bio !== 'undefined') user.bio = bio;
    if (typeof avatar !== 'undefined') user.avatar = avatar;

    await user.save();

    return res.status(200).json(new ApiResponse(true, 'Profile updated', {
      id: user._id,
      username: user.username,
      email: user.email,
      verified: user.isVerified,
      role: user.role,
      avatar: user.avatar,
      bio: user.bio || ''
    }));
  } catch (error) {
    return res.status(400).json(new ApiResponse(false, error.message));
  }
};