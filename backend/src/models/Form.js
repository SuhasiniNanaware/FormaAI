const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

// --- Sub-schemas -----------------------------------------------------------
// These mirror the shapes consumed by the frontend (see
// frontend/src/types/form.ts) field-for-field so the API response can be
// dropped straight into the existing React types with zero mapping code.

const QuestionOptionSchema = new mongoose.Schema(
  {
    id: { type: String, default: uuidv4 },
    label: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false }
);

const QuestionValidationSchema = new mongoose.Schema(
  {
    required: { type: Boolean, default: false },
    minLength: { type: Number },
    maxLength: { type: Number },
    pattern: { type: String },
    min: { type: Number },
    max: { type: Number },
    customErrorMessage: { type: String },
  },
  { _id: false }
);

const QuestionSchema = new mongoose.Schema(
  {
    id: { type: String, default: uuidv4 },
    type: {
      type: String,
      required: [true, "Question type is required"],
      enum: [
        "short_text",
        "long_text",
        "multiple_choice",
        "rating",
        "dropdown",
        "checkbox",
        "date",
        "file_upload",
      ],
    },
    title: { type: String, required: [true, "Question title is required"] },
    description: { type: String },
    placeholder: { type: String },
    options: { type: [QuestionOptionSchema], default: undefined },
    validation: { type: QuestionValidationSchema, default: () => ({ required: false }) },
    order: { type: Number, required: true },
  },
  { _id: false }
);

const FormThemeSchema = new mongoose.Schema(
  {
    primaryColor: { type: String, default: "#6366f1" },
    backgroundColor: { type: String, default: "#020617" },
    cardStyle: { type: String, enum: ["glass", "solid", "minimal"], default: "glass" },
    borderRadius: { type: String, enum: ["none", "sm", "md", "lg", "full"], default: "md" },
    fontFamily: { type: String, default: "Inter" },
  },
  { _id: false }
);

const FormSettingsSchema = new mongoose.Schema(
  {
    allowAnonymous: { type: Boolean, default: true },
    collectEmail: { type: Boolean, default: true },
    limitOneResponse: { type: Boolean, default: false },
    showProgressBar: { type: Boolean, default: true },
    customSuccessMessage: { type: String, default: "Thank you for your submission!" },
    redirectUrl: { type: String },
  },
  { _id: false }
);

// Provenance for AI-generated forms: which provider/model produced it and
// the prompt that was used. Left undefined for forms created manually or
// from a template. Pairs with the AIGenerationLog audit trail, which records
// every attempt (including failed/fallback ones) rather than just the
// successful result attached here.
const GeneratedBySchema = new mongoose.Schema(
  {
    provider: { type: String, enum: ["gemini", "heuristic"] },
    model: { type: String },
    prompt: { type: String, maxlength: 500 },
  },
  { _id: false }
);

// --- Main Form schema --------------------------------------------------------

const formSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Form title is required"],
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    questions: {
      type: [QuestionSchema],
      default: [],
    },

    theme: {
      type: FormThemeSchema,
      default: () => ({}),
    },

    settings: {
      type: FormSettingsSchema,
      default: () => ({}),
    },

    generatedBy: {
      type: GeneratedBySchema,
      required: false,
      default: undefined,
    },

    responsesCount: {
      type: Number,
      default: 0,
    },

    viewsCount: {
      type: Number,
      default: 0,
    },

    completionRate: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
    },
  }
);

module.exports = mongoose.model("Form", formSchema);
