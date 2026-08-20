const { validationResult } = require("express-validator");

const ApiResponse = require("../utils/ApiResponse");
const formService = require("../services/form.service");

// ============================================================
// GET ALL FORMS
// Public endpoint
// ============================================================
exports.getAllForms = async (req, res) => {
  try {
    const forms = await formService.getAllForms();

    return res.status(200).json(
      new ApiResponse(
        true,
        "Forms fetched successfully",
        forms
      )
    );
  } catch (error) {
    console.error("[GET ALL FORMS]", error);

    return res.status(500).json(
      new ApiResponse(
        false,
        error.message || "Failed to fetch forms"
      )
    );
  }
};

// ============================================================
// GET MY FORMS
// Authenticated user only
// ============================================================
exports.getMyForms = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json(
        new ApiResponse(
          false,
          "Authentication required"
        )
      );
    }

    const forms = await formService.getMyForms(
      req.user.id
    );

    return res.status(200).json(
      new ApiResponse(
        true,
        "User forms fetched successfully",
        forms
      )
    );
  } catch (error) {
    console.error("[GET MY FORMS]", error);

    return res.status(500).json(
      new ApiResponse(
        false,
        error.message || "Failed to fetch user forms"
      )
    );
  }
};

// ============================================================
// GET FORM BY ID OR SLUG
// ============================================================
exports.getFormById = async (req, res) => {
  try {
    const form = await formService.getFormById(
      req.params.id,
      {
        registerView: true,
      }
    );

    return res.status(200).json(
      new ApiResponse(
        true,
        "Form fetched successfully",
        form
      )
    );
  } catch (error) {
    console.error("[GET FORM]", error);

    return res.status(404).json(
      new ApiResponse(
        false,
        error.message || "Form not found"
      )
    );
  }
};

// ============================================================
// CREATE FORM
// ============================================================
exports.createForm = async (req, res) => {
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

    if (!req.user?.id) {
      return res.status(401).json(
        new ApiResponse(
          false,
          "Authentication required"
        )
      );
    }

    const form = await formService.createForm(
      req.body,
      req.user.id
    );

    return res.status(201).json(
      new ApiResponse(
        true,
        "Form created successfully",
        form
      )
    );
  } catch (error) {
    console.error("[CREATE FORM]", error);

    return res.status(400).json(
      new ApiResponse(
        false,
        error.message || "Failed to create form"
      )
    );
  }
};

// ============================================================
// UPDATE FORM
// ============================================================
exports.updateForm = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json(
        new ApiResponse(
          false,
          "Authentication required"
        )
      );
    }

    const form = await formService.updateForm(
      req.params.id,
      req.body,
      req.user.id
    );

    return res.status(200).json(
      new ApiResponse(
        true,
        "Form updated successfully",
        form
      )
    );
  } catch (error) {
    console.error("[UPDATE FORM]", error);

    return res.status(400).json(
      new ApiResponse(
        false,
        error.message || "Failed to update form"
      )
    );
  }
};

// ============================================================
// DELETE FORM
// ============================================================
exports.deleteForm = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json(
        new ApiResponse(
          false,
          "Authentication required"
        )
      );
    }

    await formService.deleteForm(
      req.params.id,
      req.user.id
    );

    return res.status(200).json(
      new ApiResponse(
        true,
        "Form deleted successfully"
      )
    );
  } catch (error) {
    console.error("[DELETE FORM]", error);

    return res.status(400).json(
      new ApiResponse(
        false,
        error.message || "Failed to delete form"
      )
    );
  }
};

// ============================================================
// GET FORM RESPONSES
// ============================================================
exports.getFormResponses = async (req, res) => {
  try {
    const responses =
      await formService.getFormResponses(
        req.params.id
      );

    return res.status(200).json(
      new ApiResponse(
        true,
        "Responses fetched successfully",
        responses
      )
    );
  } catch (error) {
    console.error("[GET RESPONSES]", error);

    return res.status(404).json(
      new ApiResponse(
        false,
        error.message || "Failed to fetch responses"
      )
    );
  }
};

// ============================================================
// SUBMIT FORM RESPONSE
// Public endpoint
// ============================================================
exports.submitFormResponse = async (req, res) => {
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

    const submission =
      await formService.submitFormResponse(
        req.params.id,
        req.body
      );

    return res.status(201).json(
      new ApiResponse(
        true,
        "Response submitted successfully",
        submission
      )
    );
  } catch (error) {
    console.error("[SUBMIT RESPONSE]", error);

    return res.status(400).json(
      new ApiResponse(
        false,
        error.message || "Failed to submit response"
      )
    );
  }
};

// ============================================================
// GENERATE FORM WITH AI
// Authenticated endpoint
// ============================================================
exports.generateFormWithAI = async (req, res) => {
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

    if (!req.user?.id) {
      return res.status(401).json(
        new ApiResponse(
          false,
          "Authentication required"
        )
      );
    }

    const { prompt } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json(
        new ApiResponse(
          false,
          "AI prompt is required"
        )
      );
    }

    console.log(
      `[AI] Request from user ${req.user.id}`
    );

    const form =
      await formService.generateFormWithAI(
        prompt.trim(),
        req.user.id
      );

    return res.status(201).json(
      new ApiResponse(
        true,
        "Form generated successfully",
        form
      )
    );
  } catch (error) {
    console.error(
      "[AI GENERATE FORM]",
      error
    );

    return res.status(400).json(
      new ApiResponse(
        false,
        error.message ||
          "Failed to generate form"
      )
    );
  }
};