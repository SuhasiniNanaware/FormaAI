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

router.get("/", formController.getAllForms);

// AI generation: must be signed in (so the rate limiter can key on user id
// and forms are attributed to an owner), rate-limited (it costs real API
// spend per call), and prompt-length validated before it ever reaches Gemini.
router.post(
  "/generate",
  requireAuth,
  aiGenerateLimiter,
  generateFormValidation,
  formController.generateFormWithAI
);

router.post("/", requireAuth, createFormValidation, formController.createForm);

router.get("/:id", formController.getFormById);

router.put("/:id", requireAuth, formController.updateForm);

router.delete("/:id", requireAuth, formController.deleteForm);

router.get("/:id/responses", formController.getFormResponses);

router.post("/:id/responses", submitResponseValidation, formController.submitFormResponse);

module.exports = router;
