const { body } = require("express-validator");

exports.createFormValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required"),

  body("questions")
    .optional()
    .isArray()
    .withMessage("questions must be an array"),
];

exports.submitResponseValidation = [
  body("answers")
    .notEmpty()
    .withMessage("answers is required")
    .custom((value) => typeof value === "object" && !Array.isArray(value))
    .withMessage("answers must be an object keyed by question id"),

  body("respondentEmail")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Invalid email"),

  body("device")
    .optional()
    .isIn(["desktop", "mobile", "tablet"])
    .withMessage("device must be desktop, mobile or tablet"),
];
