const express = require("express");

const router = express.Router();

const formController = require("../controllers/form.controller");

const {
  createFormValidation,
  submitResponseValidation,
} = require("../validators/form.validator");

router.get("/", formController.getAllForms);

router.post("/generate", formController.generateFormWithAI);

router.post("/", createFormValidation, formController.createForm);

router.get("/:id", formController.getFormById);

router.put("/:id", formController.updateForm);

router.delete("/:id", formController.deleteForm);

router.get("/:id/responses", formController.getFormResponses);

router.post("/:id/responses", submitResponseValidation, formController.submitFormResponse);

module.exports = router;
