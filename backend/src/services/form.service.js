const Form = require("../models/Form");
const FormSubmission = require("../models/FormSubmission");
const AIGenerationLog = require("../models/AIGenerationLog");
const aiService = require("./ai.service");
const logger = require("../utils/logger");

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const getAllForms = async () => {
  return await Form.find().sort({ createdAt: -1 });
};

// Accepts either a Mongo _id or a slug, same lookup contract the frontend's
// mock formService already uses: f.id === id || f.slug === id
const findFormByIdOrSlug = async (idOrSlug) => {
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
  const form = isObjectId
    ? await Form.findById(idOrSlug)
    : await Form.findOne({ slug: idOrSlug });
  return form;
};

const getFormById = async (idOrSlug, { registerView = false } = {}) => {
  const form = await findFormByIdOrSlug(idOrSlug);
  if (!form) {
    throw new Error("Form not found");
  }
  if (registerView) {
    form.viewsCount += 1;
    await form.save();
  }
  return form;
};

const createForm = async (payload, ownerId) => {
  const baseSlug = payload.slug ? slugify(payload.slug) : slugify(payload.title);
  let slug = baseSlug;
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

const updateForm = async (idOrSlug, updates) => {
  const form = await findFormByIdOrSlug(idOrSlug);
  if (!form) {
    throw new Error("Form not found");
  }

  Object.assign(form, updates);
  await form.save();
  return form;
};

const deleteForm = async (idOrSlug) => {
  const form = await findFormByIdOrSlug(idOrSlug);
  if (!form) {
    throw new Error("Form not found");
  }
  await FormSubmission.deleteMany({ formId: form._id });
  await form.deleteOne();
  return true;
};

const getFormResponses = async (idOrSlug) => {
  const form = await findFormByIdOrSlug(idOrSlug);
  if (!form) {
    throw new Error("Form not found");
  }
  return await FormSubmission.find({ formId: form._id }).sort({ submittedAt: -1 });
};

const submitFormResponse = async (idOrSlug, { answers, respondentEmail, completionTimeSeconds, device }) => {
  const form = await findFormByIdOrSlug(idOrSlug);
  if (!form) {
    throw new Error("Form not found");
  }

  const submission = await FormSubmission.create({
    formId: form._id,
    answers,
    respondentEmail,
    completionTimeSeconds,
    device,
  });

  // Keep the aggregate counters on the form document roughly in sync, the
  // same bookkeeping the old frontend-only mock never did but a real
  // dashboard (AnalyticsPage / ResponsesPage) depends on.
  const totalResponses = form.responsesCount + 1;
  const priorCompleted = (form.completionRate / 100) * form.responsesCount;
  const completionRate = ((priorCompleted + 1) / totalResponses) * 100;

  form.responsesCount = totalResponses;
  form.completionRate = Math.round(completionRate * 10) / 10;
  await form.save();

  return submission;
};

// Real AI-backed form generation: calls Gemini (via ai.service, with its own
// timeout/retry/heuristic-fallback baked in), writes an audit row regardless
// of outcome, then saves whatever came back as a normal draft Form. The
// caller never has to know whether the result came from the model or the
// offline fallback - it always gets a valid Form back.
const generateFormWithAI = async (prompt, ownerId) => {
  const genResult = await aiService.generateFormFromPrompt(prompt);

  try {
    await AIGenerationLog.create({
      user: ownerId || undefined,
      prompt: prompt.slice(0, 2000),
      provider: genResult.provider,
      model: genResult.model || undefined,
      success: !genResult.fallback,
      fallbackUsed: genResult.fallback,
      latencyMs: genResult.latencyMs,
      errorMessage: genResult.error,
    });
  } catch (logError) {
    // Logging must never take down the actual feature.
    logger.error(`Failed to write AIGenerationLog: ${logError.message}`);
  }

  const form = await createForm(
    {
      title: genResult.title,
      description: genResult.description,
      status: "draft",
      questions: genResult.questions,
      generatedBy: {
        provider: genResult.provider,
        model: genResult.model || undefined,
        prompt: prompt.slice(0, 500),
      },
    },
    ownerId
  );

  return form;
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
