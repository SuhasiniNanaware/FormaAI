const User = require("../models/User");
const VerificationToken = require("../models/VerificationToken");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const mailService = require("./mail.service");

const registerUser = async (username, email, password) => {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new Error("Email already registered");
    }

    const user = await User.create({
        username,
        email,
        password
    });

    const token = crypto.randomBytes(32).toString("hex");

    await VerificationToken.create({
        userId: user._id,
        token,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    const verificationLink =
        `http://localhost:5000/api/auth/verify/${token}`;

    await mailService.sendVerificationEmail(
        user.email,
        user.username,
        verificationLink
    );

    return user;
};

// Generate JWT containing the authenticated user's ID
const generateAuthToken = (user) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not configured on the server");
    }

    return jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "7d"
        }
    );
};

const loginUser = async (email, password) => {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        throw new Error("Invalid email or password");
    }

    if (!user.isVerified) {
        throw new Error("Please verify your email before logging in");
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        throw new Error("Invalid email or password");
    }

    const token = generateAuthToken(user);

    return {
        id: user._id,
        username: user.username,
        email: user.email,
        verified: user.isVerified,
        token
    };
};

module.exports = {
    registerUser,
    loginUser,
    generateAuthToken,
};