const jwt = require("jsonwebtoken");
const User = require("../models/User");
const VerificationToken = require("../models/VerificationToken");
const crypto = require("crypto");
const mailService = require("./mail.service");

const generateAuthToken = (user) => {
 const jwtSecret = process.env.JWT_SECRET || "forma-ai-local-dev-secret";

 return jwt.sign({ id: user._id }, jwtSecret, {
   expiresIn: process.env.JWT_EXPIRES_IN || "7d",
 });
};

const registerUser = async (username, email, password) => {
 const normalizedEmail = String(email).trim().toLowerCase();

 const existingUser = await User.findOne({ email: normalizedEmail });

 if (existingUser) {
   throw new Error("Email already registered");
 }

 const user = await User.create({
   username: String(username).trim(),
   email: normalizedEmail,
   password,
 });

 const token = crypto.randomBytes(32).toString("hex");

 await VerificationToken.create({
   userId: user._id,
   token,
   expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
 });

 const verificationLink = `http://localhost:5000/api/auth/verify/${token}`;

 try {
   await mailService.sendVerificationEmail(user.email, user.username, verificationLink);
 } catch (error) {
   console.error("Verification email failed:", error.message);
 }

 return user;
};

const loginUser = async (email, password) => {
 const normalizedEmail = String(email).trim().toLowerCase();
 const user = await User.findOne({ email: normalizedEmail }).select("+password");

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
   token,
 };
};

module.exports = {
 registerUser,
 loginUser,
 generateAuthToken,
};