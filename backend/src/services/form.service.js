const Form = require("../models/Form");
const FormSubmission = require("../models/FormSubmission");
const AIGenerationLog = require("../models/AIGenerationLog");
const aiService = require("./ai.service");
const logger = require("../utils/logger");

const slugify = (text = "") =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

// ============================================================
// GET ALL FORMS
// ============================================================

const getAllForms = async (ownerId = null) => {
  const filter = ownerId ? { owner: ownerId } : {};

  return await Form.find(filter).sort({ createdAt: -1 });
};

// ============================================================
// FIND FORM BY ID OR SLUG
// ============================================================

const findFormByIdOrSlug = async (idOrSlug) => {
  if (!idOrSlug) {
    throw new Error("Form ID or slug is required");
  }

  const isObjectId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);

  return isObjectId
    ? await Form.findById(idOrSlug)
    : await Form.findOne({ slug: idOrSlug });
};

// ============================================================
// GET FORM
// ============================================================

const getFormById = async (
  idOrSlug,
  { registerView = false } = {}
) => {
  const form = await findFormByIdOrSlug(idOrSlug);

  if (!form) {
    throw new Error("Form not found");
  }

  if (registerView) {
    form.viewsCount = (form.viewsCount || 0) + 1;
    await form.save();
  }

  return form;
};

// ============================================================
// CREATE FORM
// ============================================================

const createForm = async (payload, ownerId) => {
  if (!payload.title) {
    throw new Error("Form title is required");
  }

  const baseSlug =
    payload.slug
      ? slugify(payload.slug)
      : slugify(payload.title);

  let slug = baseSlug || `form-${Date.now()}`;
  let suffix = 1;

  while (await Form.exists({ slug })) {
    slug = `${baseSlug}-${suffix++}`;
  }

  const form = await Form.create({
    ...payload,
    slug,
    owner: ownerId || undefined,
  });

  return form;
};

// ============================================================
// UPDATE FORM
// ============================================================

const updateForm = async (idOrSlug, updates, ownerId = null) => {
  const form = await findFormByIdOrSlug(idOrSlug);

  if (!form) {
    throw new Error("Form not found");
  }

  // If ownerId is supplied, prevent editing another user's form.
  if (
    ownerId &&
    form.owner &&
    form.owner.toString() !== ownerId.toString()
  ) {
    throw new Error("You are not allowed to modify this form");
  }

  Object.assign(form, updates);

  await form.save();

  return form;
};

// ============================================================
// DELETE FORM
// ============================================================

const deleteForm = async (idOrSlug, ownerId = null) => {
  const form = await findFormByIdOrSlug(idOrSlug);

  if (!form) {
    throw new Error("Form not found");
  }

  if (
    ownerId &&
    form.owner &&
    form.owner.toString() !== ownerId.toString()
  ) {
    throw new Error("You are not allowed to delete this form");
  }

  await FormSubmission.deleteMany({
    formId: form._id,
  });

  await form.deleteOne();

  return true;
};

// ============================================================
// GET RESPONSES
// ============================================================

const getFormResponses = async (idOrSlug) => {
  const form = await findFormByIdOrSlug(idOrSlug);

  if (!form) {
    throw new Error("Form not found");
  }

  return await FormSubmission.find({
    formId: form._id,
  }).sort({ submittedAt: -1 });
};

// ============================================================
// SUBMIT RESPONSE
// ============================================================

const submitFormResponse = async (
  idOrSlug,
  {
    answers,
    respondentEmail,
    completionTimeSeconds,
    device,
  }
) => {
  const form = await findFormByIdOrSlug(idOrSlug);

  if (!form) {
    throw new Error("Form not found");
  }

  if (form.status === "archived") {
    throw new Error("This form is no longer accepting responses");
  }

  const submission = await FormSubmission.create({
    formId: form._id,
    answers: answers || {},
    respondentEmail,
    completionTimeSeconds,
    device,
  });

  const totalResponses =
    (form.responsesCount || 0) + 1;

  const previousResponses =
    form.responsesCount || 0;

  const previousCompletionRate =
    form.completionRate || 0;

  const previousCompleted =
    (previousCompletionRate / 100) *
    previousResponses;

  const completionRate =
    totalResponses > 0
      ? ((previousCompleted + 1) / totalResponses) * 100
      : 100;

  form.responsesCount = totalResponses;

  form.completionRate =
    Math.round(completionRate * 10) / 10;

  await form.save();

  return submission;
};

// ============================================================
// AI FORM GENERATION
// ============================================================

const generateFormWithAI = async (
  prompt,
  ownerId
) => {
  if (!prompt || !prompt.trim()) {
    throw new Error("AI prompt is required");
  }

  const cleanPrompt = prompt.trim();

  console.log(
    `[AI] Generating form from prompt: "${cleanPrompt}"`
  );

  const genResult =
    await aiService.generateFormFromPrompt(
      cleanPrompt
    );

  console.log(
    `[AI] Provider: ${genResult.provider}, fallback: ${genResult.fallback}, latency: ${genResult.latencyMs}ms`
  );

  // Save AI generation analytics.
  try {
    await AIGenerationLog.create({
      user: ownerId || undefined,
      prompt: cleanPrompt.slice(0, 2000),
      provider: genResult.provider,
      model: genResult.model || undefined,
      success: !genResult.fallback,
      fallbackUsed: genResult.fallback,
      latencyMs: genResult.latencyMs,
      errorMessage: genResult.error,
    });
  } catch (logError) {
    logger.error(
      `Failed to write AIGenerationLog: ${logError.message}`
    );
  }

  // Create actual MongoDB form.
  const form = await createForm(
    {
      title: genResult.title,
      description: genResult.description,
      status: "draft",
      questions: genResult.questions,

      generatedBy: {
        provider: genResult.provider,
        model: genResult.model || undefined,
        prompt: cleanPrompt.slice(0, 500),
      },
    },
    ownerId
  );

  console.log(
    `[AI] Form created successfully: ${form._id}`
  );

  return form;
};



const getMyForms = async (ownerId) => {
  if (!ownerId) {
    throw new Error("Owner ID is required");
  }

  return await Form.find({
    owner: ownerId,
  }).sort({
    createdAt: -1,
  });
};

module.exports = {
  getAllForms,
  getFormById,
  createForm,
  updateForm,
  deleteForm,
  getFormResponses,
  submitFormResponse,
  generateFormWithAI,
};