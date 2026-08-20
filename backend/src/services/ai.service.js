const { GoogleGenAI } = require("@google/genai");

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

const OPTION_TYPES = new Set([
  "multiple_choice",
  "dropdown",
  "checkbox",
]);


const AI_TIMEOUT_MS = 45000;

const MAX_QUESTIONS = 8;

const GEMINI_MODEL = "gemini-3.6-flash";

const SYSTEM_INSTRUCTION = `
You are Forma AI, an AI form generator.

Convert the user's plain-English request into a useful online form.

Return:
- a concise title
- a short description
- 3 to 8 relevant questions

Allowed question types:
${QUESTION_TYPES.join(", ")}

Rules:
- Use only the allowed question types.
- Choice questions must have 2-6 options.
- Use rating for satisfaction or 1-5 scale questions.
- Mark required true only when necessary.
- Do not add unrelated questions.
- Keep question titles short and natural.
- Return valid structured JSON only.
`;

const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    title: {
      type: "string",
    },

    description: {
      type: "string",
    },

    questions: {
      type: "array",

      items: {
        type: "object",

        properties: {
          type: {
            type: "string",
            enum: QUESTION_TYPES,
          },

          title: {
            type: "string",
          },

          description: {
            type: "string",
          },

          placeholder: {
            type: "string",
          },

          required: {
            type: "boolean",
          },

          options: {
            type: "array",

            items: {
              type: "object",

              properties: {
                label: {
                  type: "string",
                },

                value: {
                  type: "string",
                },
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

    new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(
          new Error(`${label} timed out after ${ms}ms`)
        );
      }, ms);

      if (typeof timer.unref === "function") {
        timer.unref();
      }
    }),
  ]);

const slugifyValue = (label, index) =>
  (label || `option-${index}`)
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/(^_|_$)+/g, "") ||
  `option_${index}`;


/**
 * Validate and normalize Gemini output.
 */
function normalizeGeneratedForm(raw, fallbackTitle) {
  if (!raw || typeof raw !== "object") {
    throw new Error("AI response was not a JSON object");
  }

  const rawQuestions = Array.isArray(raw.questions)
    ? raw.questions
    : [];

  const questions = rawQuestions
    .filter(
      (q) =>
        q &&
        typeof q.title === "string" &&
        q.title.trim() &&
        QUESTION_TYPES.includes(q.type)
    )
    .slice(0, MAX_QUESTIONS)
    .map((q, index) => {
      const question = {
        type: q.type,
        title: q.title.trim(),

        order: index + 1,

        validation: {
          required: Boolean(q.required),
        },
      };

      if (
        typeof q.description === "string" &&
        q.description.trim()
      ) {
        question.description = q.description.trim();
      }

      if (
        typeof q.placeholder === "string" &&
        q.placeholder.trim()
      ) {
        question.placeholder = q.placeholder.trim();
      }

      // Choice questions
      if (OPTION_TYPES.has(q.type)) {
        const rawOptions = Array.isArray(q.options)
          ? q.options
          : [];

        const options = rawOptions
          .filter(
            (option) =>
              option &&
              typeof option.label === "string" &&
              option.label.trim()
          )
          .slice(0, 6)
          .map((option, optionIndex) => ({
            label: option.label.trim(),

            value:
              typeof option.value === "string" &&
              option.value.trim()
                ? option.value.trim()
                : slugifyValue(
                    option.label,
                    optionIndex
                  ),
          }));

        // Don't save broken choice questions.
        if (options.length < 2) {
          return null;
        }

        question.options = options;
      }

      // Long text validation
      if (q.type === "long_text") {
        question.validation.maxLength = 1000;
      }

      // Rating validation
      if (q.type === "rating") {
        question.validation.min = 1;
        question.validation.max = 5;
      }

      return question;
    })
    .filter(Boolean);

  if (questions.length === 0) {
    throw new Error(
      "AI response contained no usable questions"
    );
  }

  const title =
    typeof raw.title === "string" &&
    raw.title.trim()
      ? raw.title.trim()
      : fallbackTitle;

  const description =
    typeof raw.description === "string" &&
    raw.description.trim()
      ? raw.description.trim()
      : "Generated by Forma AI.";

  return {
    title,
    description,
    questions,
  };
}


async function callGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    const err = new Error("GEMINI_API_KEY is not configured");
    err.code = "NO_API_KEY";
    throw err;
  }

  console.log(`[AI] Generating form with ${GEMINI_MODEL}...`);

  const ai = new GoogleGenAI({
    apiKey,
  });

  const response = await withTimeout(
    ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,

        responseMimeType: "application/json",

        responseSchema: RESPONSE_SCHEMA,

        maxOutputTokens: 1200,
      },
    }),
    AI_TIMEOUT_MS,
    "Gemini request"
  );

  const text = response.text;

  if (!text) {
    throw new Error("Gemini returned an empty response");
  }

  console.log("[AI] Gemini response received");

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("[AI] Invalid Gemini JSON:", text);
    throw new Error("AI response was not valid JSON");
  }
}
/**
 * Local fallback generator.
 *
 * This is only used if Gemini is unavailable or times out.
 */
const HEURISTIC_TEMPLATES = [
  {
    keywords: [
      "feedback",
      "survey",
      "review",
      "satisfaction",
      "rating",
      "opinion",
    ],

    build: () => ({
      title: "Customer Satisfaction Survey",

      description:
        "Collect customer satisfaction ratings and detailed feedback.",

      questions: [
        {
          type: "short_text",
          title: "Name",
          order: 1,
          validation: {
            required: true,
          },
        },

        {
          type: "short_text",
          title: "Email Address",
          order: 2,
          validation: {
            required: true,
          },
        },

        {
          type: "rating",
          title: "How satisfied are you?",
          order: 3,
          validation: {
            required: true,
            min: 1,
            max: 5,
          },
        },

        {
          type: "dropdown",
          title: "Preferred Service",
          order: 4,
          validation: {
            required: true,
          },

          options: [
            {
              label: "Customer Support",
              value: "customer_support",
            },

            {
              label: "Product",
              value: "product",
            },

            {
              label: "Billing",
              value: "billing",
            },

            {
              label: "Other",
              value: "other",
            },
          ],
        },

        {
          type: "long_text",
          title: "Detailed Feedback",
          order: 5,

          validation: {
            required: false,
            maxLength: 1000,
          },

          placeholder:
            "Tell us about your experience...",
        },
      ],
    }),
  },

  {
    keywords: [
      "registration",
      "register",
      "event",
      "enroll",
      "signup",
      "sign up",
    ],

    build: () => ({
      title: "Event Registration Form",

      description:
        "Collect the information needed for event registration.",

      questions: [
        {
          type: "short_text",
          title: "Full Name",
          order: 1,

          validation: {
            required: true,
          },
        },

        {
          type: "short_text",
          title: "Email Address",
          order: 2,

          validation: {
            required: true,
          },
        },

        {
          type: "date",
          title: "Event Date",
          order: 3,

          validation: {
            required: true,
          },
        },

        {
          type: "dropdown",
          title: "Dietary Preference",
          order: 4,

          validation: {
            required: false,
          },

          options: [
            {
              label: "No Preference",
              value: "none",
            },

            {
              label: "Vegetarian",
              value: "vegetarian",
            },

            {
              label: "Vegan",
              value: "vegan",
            },

            {
              label: "Other",
              value: "other",
            },
          ],
        },
      ],
    }),
  },

  {
    keywords: [
      "job",
      "application",
      "hiring",
      "resume",
      "cv",
      "candidate",
      "career",
    ],

    build: () => ({
      title: "Job Application",

      description:
        "Application form for a job opportunity.",

      questions: [
        {
          type: "short_text",
          title: "Full Name",
          order: 1,

          validation: {
            required: true,
          },
        },

        {
          type: "short_text",
          title: "Email Address",
          order: 2,

          validation: {
            required: true,
          },
        },

        {
          type: "file_upload",
          title: "Upload Resume",
          order: 3,

          validation: {
            required: true,
          },
        },

        {
          type: "long_text",
          title: "Why are you interested in this role?",
          order: 4,

          validation: {
            required: false,
            maxLength: 1000,
          },
        },
      ],
    }),
  },
];


function heuristicGenerate(prompt) {
  const lower = prompt.toLowerCase();

  const matched =
    HEURISTIC_TEMPLATES.find((template) =>
      template.keywords.some((keyword) =>
        lower.includes(keyword)
      )
    );

  if (matched) {
    return matched.build();
  }

  return {
    title:
      prompt.length > 60
        ? `${prompt.slice(0, 60)}...`
        : prompt || "Untitled Form",

    description:
      "Generated form - customize the questions below.",

    questions: [
      {
        type: "short_text",
        title: "Full Name",
        order: 1,

        validation: {
          required: true,
        },
      },

      {
        type: "short_text",
        title: "Email Address",
        order: 2,

        validation: {
          required: true,
        },
      },

      {
        type: "long_text",
        title: "Additional Information",
        order: 3,

        validation: {
          required: false,
          maxLength: 1000,
        },
      },
    ],
  };
}


async function generateFormFromPrompt(prompt) {
  const startedAt = Date.now();

  const cleanPrompt =
    typeof prompt === "string"
      ? prompt.trim()
      : "";

  if (!cleanPrompt) {
    throw new Error(
      "A form generation prompt is required"
    );
  }

  const fallbackTitle =
    cleanPrompt.length > 60
      ? `${cleanPrompt.slice(0, 60)}...`
      : cleanPrompt;

  try {
    const raw = await callGemini(cleanPrompt);

    const normalized = normalizeGeneratedForm(
      raw,
      fallbackTitle
    );

    const latencyMs =
      Date.now() - startedAt;

    console.log(
      `[AI] Real Gemini form generated in ${latencyMs}ms`
    );

    return {
      ...normalized,

      provider: "gemini",

      model: GEMINI_MODEL,

      fallback: false,

      latencyMs,
    };
  } catch (error) {
    console.error(
      "[AI] Gemini unavailable:",
      error.message
    );

    // Fast local fallback.
    const heuristic =
      heuristicGenerate(cleanPrompt);

    return {
      ...heuristic,

      provider: "heuristic",

      model: null,

      fallback: true,

      error: error.message,

      latencyMs:
        Date.now() - startedAt,
    };
  }
}

module.exports = {
  generateFormFromPrompt,
  normalizeGeneratedForm,
  heuristicGenerate,
  QUESTION_TYPES,
};