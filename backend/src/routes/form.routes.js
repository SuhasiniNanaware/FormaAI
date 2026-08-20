const express = require("express");

const router = express.Router();

const formController = require("../controllers/form.controller");
const requireAuth = require("../middlewares/auth.middleware");
const { aiGenerateLimiter } = require("../middlewares/rateLimiters");

const {
  createFormValidation,
  submitResponseValidation,
  generateFormValidation,
} = require("../validators/form.validator");

// Get all forms
router.get(
  "/",
  formController.getAllForms
);

// Get forms belonging to logged-in user
router.get(
  "/my-forms",
  requireAuth,
  formController.getMyForms
);

// Generate form using AI
router.post(
  "/generate",
  requireAuth,
  aiGenerateLimiter,
  generateFormValidation,
  formController.generateFormWithAI
);

// Create form
router.post(
  "/",
  requireAuth,
  createFormValidation,
  formController.createForm
);

// Get form by ID / slug
router.get(
  "/:id",
  formController.getFormById
);

// Update form
router.put(
  "/:id",
  requireAuth,
  formController.updateForm
);

// Delete form
router.delete(
  "/:id",
  requireAuth,
  formController.deleteForm
);

// Get responses
router.get(
  "/:id/responses",
  formController.getFormResponses
);

// Submit response
router.post(
  "/:id/responses",
  submitResponseValidation,
  formController.submitFormResponse
);

module.exports = router;