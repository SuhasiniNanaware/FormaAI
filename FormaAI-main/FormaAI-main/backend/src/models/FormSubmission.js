const mongoose = require("mongoose");

// Mirrors frontend/src/types/form.ts -> FormSubmission

const formSubmissionSchema = new mongoose.Schema(
  {
    formId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Form",
      required: [true, "formId is required"],
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },

    // Keyed by question id -> answer (string | number | string[]), same shape
    // the frontend already sends from PreviewPage / public form fill flow.
    answers: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, "answers are required"],
      default: {},
    },

    respondentEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },

    completionTimeSeconds: {
      type: Number,
      default: 0,
    },

    device: {
      type: String,
      enum: ["desktop", "mobile", "tablet"],
      default: "desktop",
    },
  },
  {
    toJSON: {
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        ret.formId = ret.formId.toString ? ret.formId.toString() : ret.formId;
        ret.submittedAt = ret.submittedAt.toISOString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

formSubmissionSchema.index({ formId: 1, submittedAt: -1 });

module.exports = mongoose.model("FormSubmission", formSubmissionSchema);
