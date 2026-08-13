const { validationResult } = require("express-validator");

const ApiResponse = require("../utils/ApiResponse");
const formService = require("../services/form.service");

exports.getAllForms = async (req, res) => {
  try {
    const forms = await formService.getAllForms();
    return res.status(200).json(new ApiResponse(true, "Forms fetched successfully", forms));
  } catch (error) {
    return res.status(500).json(new ApiResponse(false, error.message));
  }
};

exports.getFormById = async (req, res) => {
  try {
    const form = await formService.getFormById(req.params.id, { registerView: true });
    return res.status(200).json(new ApiResponse(true, "Form fetched successfully", form));
  } catch (error) {
    return res.status(404).json(new ApiResponse(false, error.message));
  }
};

exports.createForm = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(new ApiResponse(false, "Validation Failed", errors.array()));
    }

    const form = await formService.createForm(req.body, req.user?.id);
    return res.status(201).json(new ApiResponse(true, "Form created successfully", form));
  } catch (error) {
    return res.status(400).json(new ApiResponse(false, error.message));
  }
};

exports.updateForm = async (req, res) => {
  try {
    const form = await formService.updateForm(req.params.id, req.body);
    return res.status(200).json(new ApiResponse(true, "Form updated successfully", form));
  } catch (error) {
    return res.status(400).json(new ApiResponse(false, error.message));
  }
};

exports.deleteForm = async (req, res) => {
  try {
    await formService.deleteForm(req.params.id);
    return res.status(200).json(new ApiResponse(true, "Form deleted successfully"));
  } catch (error) {
    return res.status(400).json(new ApiResponse(false, error.message));
  }
};

exports.getFormResponses = async (req, res) => {
  try {
    const responses = await formService.getFormResponses(req.params.id);
    return res.status(200).json(new ApiResponse(true, "Responses fetched successfully", responses));
  } catch (error) {
    return res.status(404).json(new ApiResponse(false, error.message));
  }
};

exports.submitFormResponse = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(new ApiResponse(false, "Validation Failed", errors.array()));
    }

    const submission = await formService.submitFormResponse(req.params.id, req.body);
    return res.status(201).json(new ApiResponse(true, "Response submitted successfully", submission));
  } catch (error) {
    return res.status(400).json(new ApiResponse(false, error.message));
  }
};

exports.generateFormWithAI = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(new ApiResponse(false, "Validation Failed", errors.array()));
    }

    const { prompt } = req.body;
    const form = await formService.generateFormWithAI(prompt, req.user?.id);
    return res.status(201).json(new ApiResponse(true, "Form generated successfully", form));
  } catch (error) {
    return res.status(400).json(new ApiResponse(false, error.message));
  }
};
