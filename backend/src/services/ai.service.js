const { GoogleGenerativeAI } = require("@google/generative-ai");

// Keep this in sync with backend/src/models/Form.js's QuestionSchema enum
// and frontend/src/types/form.ts's QuestionType union.
const QUESTION_TYPES = [
  "short_text",
  "long_text",
  "multiple_choice",
  "rating",
  "dropdown",
  "checkbox",
  "date",
  "file_upload",
];

const OPTION_TYPES = new Set(["multiple_choice", "dropdown", "checkbox"]);

const AI_TIMEOUT_MS = 15000;
const MAX_QUESTIONS = 12;

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";

const SYSTEM_INSTRUCTION = `You design short, practical online forms for a form-builder product called Forma AI.

Given a plain-language description of what someone needs, respond with a form: a concise title, a one-sentence description, and 3-8 well-chosen questions.

Rules:
- Only use these question "type" values, exactly as spelled: ${QUESTION_TYPES.join(", ")}.
- Use "multiple_choice", "dropdown", or "checkbox" only when you also provide 2-6 "options", each with a short "label".
- Use "rating" for satisfaction/scale questions (no options needed).
- Mark a question "required": true only when the form genuinely cannot work without an answer to it (e.g. an email needed to respond, not every single field).
- Keep question titles short and written the way a person filling the form would read them, not like a database column.
- Do not invent unrelated questions just to hit a quota — prefer fewer, better questions over padding.`;

const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string" },
    description: { type: "string" },
    questions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          type: { type: "string", enum: QUESTION_TYPES },
          title: { type: "string" },
          description: { type: "string" },
          placeholder: { type: "string" },
          required: { type: "boolean" },
          options: {
            type: "array",
            items: {
              type: "object",
              properties: {
                label: { type: "string" },
              },
              required: ["label"],
            },
          },
        },
        required: ["type", "title"],
      },
    },
  },
  required: ["title", "questions"],
};

const withTimeout = (promise, ms, label) =>
  Promise.race([
    promise,
    new Promise((_resolve, reject) => {
      const t = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
      // Prevent the timeout timer from keeping the process alive in tests/scripts.
      if (typeof t.unref === "function") t.unref();
    }),
  ]);

const slugifyValue = (label, index) =>
  (label || `option-${index}`)
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/(^_|_$)+/g, "") || `option_${index}`;

/**
 * Re-validates and coerces the model's raw JSON into something safe to save.
 * Structured-output mode makes malformed JSON rare, not impossible - the
 * model can still return an invalid enum value, skip a required field, or
 * attach options to a question type that doesn't use them. Nothing here is
 * trusted until it passes this pass.
 */
function normalizeGeneratedForm(raw, fallbackTitle) {
  if (!raw || typeof raw !== "object") {
    throw new Error("AI response was not a JSON object");
  }

  const rawQuestions = Array.isArray(raw.questions) ? raw.questions : [];

  const questions = rawQuestions
    .filter((q) => q && typeof q.title === "string" && q.title.trim() && QUESTION_TYPES.includes(q.type))
    .slice(0, MAX_QUESTIONS)
    .map((q, index) => {
      const question = {
        type: q.type,
        title: q.title.trim(),
        order: index + 1,
        validation: { required: Boolean(q.required) },
      };

      if (typeof q.description === "string" && q.description.trim()) {
        question.description = q.description.trim();
      }
      if (typeof q.placeholder === "string" && q.placeholder.trim()) {
        question.placeholder = q.placeholder.trim();
      }

      if (OPTION_TYPES.has(q.type)) {
        const rawOptions = Array.isArray(q.options) ? q.options : [];
        const options = rawOptions
          .filter((o) => o && typeof o.label === "string" && o.label.trim())
          .slice(0, 8)
          .map((o, i) => ({
            label: o.label.trim(),
            value: typeof o.value === "string" && o.value.trim() ? o.value.trim() : slugifyValue(o.label, i),
          }));

        // A choice-type question with no usable options isn't renderable -
        // drop the question rather than ship a broken field.
        if (options.length < 2) return null;
        question.options = options;
      }

      if (q.type === "long_text") {
        question.validation.maxLength = 1000;
      }
      if (q.type === "rating") {
        question.validation.min = 1;
        question.validation.max = 5;
      }

      return question;
    })
    .filter(Boolean);

  if (questions.length === 0) {
    throw new Error("AI response contained no usable questions");
  }

  const title = typeof raw.title === "string" && raw.title.trim() ? raw.title.trim() : fallbackTitle;
  const description =
    typeof raw.description === "string" && raw.description.trim()
      ? raw.description.trim()
      : "Generated by Forma AI.";

  return { title, description, questions };
}

async function callGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const err = new Error("GEMINI_API_KEY is not configured");
    err.code = "NO_API_KEY";
    throw err;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: GEMINI_MODEL,
    systemInstruction: SYSTEM_INSTRUCTION,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
      maxOutputTokens: 2048,
      temperature: 0.6,
    },
  });

  const result = await withTimeout(model.generateContent(prompt), AI_TIMEOUT_MS, "Gemini request");
  const text = result.response.text();

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (_err) {
    throw new Error("AI response was not valid JSON");
  }

  return parsed;
}

const RETRYABLE_PATTERN = /timed out|network|ECONNRESET|fetch failed|503|overloaded|ETIMEDOUT/i;

function isRetryable(error) {
  if (error.code === "NO_API_KEY") return false;
  return RETRYABLE_PATTERN.test(error.message || "");
}

// --- Heuristic fallback -----------------------------------------------------
// Used when no API key is configured, Gemini is down/over quota, or every
// live attempt failed. Keyword-matched canned templates so the "Create with
// AI" flow degrades to "still gives you something reasonable" instead of a
// dead end - the same shape of fallback the extraction engine in the earlier
// build used.

const HEURISTIC_TEMPLATES = [
  {
    keywords: ["feedback", "survey", "review", "satisfaction", "rating", "opinion"],
    build: () => ({
      title: "Feedback Survey",
      description: "Quick survey to understand how we're doing.",
      questions: [
        { type: "rating", title: "How satisfied are you overall?", order: 1, validation: { required: true, min: 1, max: 5 } },
        {
          type: "multiple_choice",
          title: "Which area matters most to you?",
          order: 2,
          validation: { required: true },
          options: [
            { label: "Product quality", value: "quality" },
            { label: "Customer support", value: "support" },
            { label: "Pricing", value: "pricing" },
          ],
        },
        { type: "long_text", title: "Any other comments?", order: 3, validation: { required: false, maxLength: 1000 } },
      ],
    }),
  },
  {
    keywords: ["registration", "enroll", "enrol", "sign up", "signup", "student", "admission"],
    build: () => ({
      title: "Registration Form",
      description: "Please fill out your registration details.",
      questions: [
        { type: "short_text", title: "Full Name", order: 1, validation: { required: true, minLength: 2 } },
        { type: "short_text", title: "Email Address", order: 2, validation: { required: true } },
        { type: "date", title: "Date of Birth", order: 3, validation: { required: false } },
        {
          type: "dropdown",
          title: "Program of Interest",
          order: 4,
          validation: { required: true },
          options: [
            { label: "Option A", value: "option_a" },
            { label: "Option B", value: "option_b" },
            { label: "Option C", value: "option_c" },
          ],
        },
      ],
    }),
  },
  {
    keywords: ["job", "application", "hiring", "resume", "cv", "candidate", "hire", "career"],
    build: () => ({
      title: "Job Application",
      description: "Application form for the open role.",
      questions: [
        { type: "short_text", title: "Full Name", order: 1, validation: { required: true } },
        { type: "short_text", title: "Email Address", order: 2, validation: { required: true } },
        { type: "file_upload", title: "Upload Resume (PDF)", order: 3, validation: { required: true } },
        {
          type: "dropdown",
          title: "Years of Experience",
          order: 4,
          validation: { required: true },
          options: [
            { label: "0-1 years", value: "0_1" },
            { label: "2-4 years", value: "2_4" },
            { label: "5+ years", value: "5_plus" },
          ],
        },
      ],
    }),
  },
  {
    keywords: ["contact", "inquiry", "enquiry", "support", "help desk", "question"],
    build: () => ({
      title: "Contact Form",
      description: "Send us a message and we'll get back to you.",
      questions: [
        { type: "short_text", title: "Your Name", order: 1, validation: { required: true } },
        { type: "short_text", title: "Email Address", order: 2, validation: { required: true } },
        { type: "long_text", title: "How can we help?", order: 3, validation: { required: true, maxLength: 1000 } },
      ],
    }),
  },
];

function heuristicGenerate(prompt) {
  const lower = prompt.toLowerCase();
  const matched = HEURISTIC_TEMPLATES.find((t) => t.keywords.some((k) => lower.includes(k)));
  if (matched) return matched.build();

  const title = prompt.length > 60 ? `${prompt.slice(0, 60)}...` : prompt || "Untitled Form";
  return {
    title,
    description: "Generated form - customize the questions below to fit your needs.",
    questions: [
      { type: "short_text", title: "Full Name", order: 1, validation: { required: true } },
      {
        type: "dropdown",
        title: "Primary Goal",
        order: 2,
        validation: { required: true },
        options: [
          { label: "Business", value: "business" },
          { label: "Academic", value: "academic" },
          { label: "Personal", value: "personal" },
        ],
      },
      { type: "rating", title: "Satisfaction Level", order: 3, validation: { required: true, min: 1, max: 5 } },
    ],
  };
}

/**
 * Generates a form from a free-text prompt. Tries Gemini (with one retry on
 * transient-looking failures), and falls back to the offline heuristic
 * generator if the key is missing, Gemini errors out, or the response can't
 * be turned into valid questions - the caller always gets a usable form back,
 * it just knows via `.fallback` whether AI actually produced it.
 */
async function generateFormFromPrompt(prompt) {
  const startedAt = Date.now();
  const fallbackTitle = prompt.length > 60 ? `${prompt.slice(0, 60)}...` : prompt || "Untitled Form";

  let lastError;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const raw = await callGemini(prompt);
      const normalized = normalizeGeneratedForm(raw, fallbackTitle);
      return {
        ...normalized,
        provider: "gemini",
        model: GEMINI_MODEL,
        fallback: false,
        latencyMs: Date.now() - startedAt,
      };
    } catch (error) {
      lastError = error;
      if (!isRetryable(error)) break;
    }
  }

  const heuristic = heuristicGenerate(prompt);
  return {
    ...heuristic,
    provider: "heuristic",
    model: null,
    fallback: true,
    error: lastError ? lastError.message : undefined,
    latencyMs: Date.now() - startedAt,
  };
}

module.exports = {
  generateFormFromPrompt,
  normalizeGeneratedForm,
  heuristicGenerate,
  QUESTION_TYPES,
};
