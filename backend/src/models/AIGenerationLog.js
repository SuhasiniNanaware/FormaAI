const mongoose = require("mongoose");

// Audit trail for every AI form-generation attempt: who asked for what, which
// provider handled it, whether it succeeded or fell back, and how long it
// took. This is what makes a bug report like "the AI made a broken form
// yesterday" debuggable instead of a shrug, and is where you'd look first if
// a token/cost budget needs investigating.

const aiGenerationLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    prompt: {
      type: String,
      required: true,
      maxlength: 2000,
    },

    provider: {
      type: String,
      required: true,
      enum: ["gemini", "heuristic"],
    },

    model: {
      type: String,
    },

    success: {
      type: Boolean,
      required: true,
    },

    fallbackUsed: {
      type: Boolean,
      default: false,
    },

    latencyMs: {
      type: Number,
    },

    errorMessage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

aiGenerationLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model("AIGenerationLog", aiGenerationLogSchema);
