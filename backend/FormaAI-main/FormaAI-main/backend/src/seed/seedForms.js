require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../config/db");
const logger = require("../utils/logger");

const Form = require("../models/Form");
const FormSubmission = require("../models/FormSubmission");

// Dummy data below mirrors frontend/src/utils/mockData.ts field-for-field
// (same titles, slugs, question ids/types, theme + settings values) so
// pointing formService.ts at this API instead of the local mock array is a
// drop-in swap. Two extra forms are included to cover the question types the
// mock data didn't exercise (multiple_choice, checkbox, date, file_upload).

const forms = [
  {
    slug: "student-registration-2026",
    title: "Student Registration Form",
    description: "Engineering Batch 2026 enrollment & course orientation preferences.",
    status: "published",
    responsesCount: 284,
    viewsCount: 340,
    completionRate: 83.5,
    theme: {
      primaryColor: "#6366f1",
      backgroundColor: "#020617",
      cardStyle: "glass",
      borderRadius: "md",
      fontFamily: "Inter",
    },
    settings: {
      allowAnonymous: false,
      collectEmail: true,
      limitOneResponse: true,
      showProgressBar: true,
      customSuccessMessage: "Registration completed! Check your inbox for confirmation.",
    },
    questions: [
      {
        id: "q1",
        type: "short_text",
        title: "Full Name",
        description: "As listed on official identification documents.",
        placeholder: "e.g. Eleanor Vance",
        order: 1,
        validation: { required: true, minLength: 2 },
      },
      {
        id: "q2",
        type: "dropdown",
        title: "Engineering Specialization",
        order: 2,
        options: [
          { id: "opt1", label: "Computer Science & AI", value: "cs_ai" },
          { id: "opt2", label: "Robotics & Automation", value: "robotics" },
          { id: "opt3", label: "Data Science & Analytics", value: "ds" },
        ],
        validation: { required: true },
      },
      {
        id: "q3",
        type: "rating",
        title: "Prior Knowledge of React & TypeScript",
        description: "Rate your confidence level from 1 to 5.",
        order: 3,
        validation: { required: true, min: 1, max: 5 },
      },
    ],
  },
  {
    slug: "patient-intake-form",
    title: "Hospital Patient Intake Form",
    description: "Medical history, symptoms log, and insurance details.",
    status: "published",
    responsesCount: 129,
    viewsCount: 150,
    completionRate: 86.0,
    theme: {
      primaryColor: "#06b6d4",
      backgroundColor: "#020617",
      cardStyle: "glass",
      borderRadius: "lg",
      fontFamily: "Inter",
    },
    settings: {
      allowAnonymous: false,
      collectEmail: true,
      limitOneResponse: false,
      showProgressBar: true,
      customSuccessMessage: "Your details have been securely logged.",
    },
    questions: [
      {
        id: "q201",
        type: "short_text",
        title: "Patient Full Name",
        order: 1,
        validation: { required: true },
      },
      {
        id: "q202",
        type: "long_text",
        title: "Primary Health Concerns or Symptoms",
        placeholder: "Describe symptoms...",
        order: 2,
        validation: { required: true, minLength: 10 },
      },
    ],
  },
  {
    slug: "customer-feedback-survey",
    title: "Customer Feedback Survey",
    description: "Quick post-purchase survey covering satisfaction and product feedback.",
    status: "published",
    responsesCount: 57,
    viewsCount: 96,
    completionRate: 59.4,
    theme: {
      primaryColor: "#f59e0b",
      backgroundColor: "#020617",
      cardStyle: "solid",
      borderRadius: "lg",
      fontFamily: "Inter",
    },
    settings: {
      allowAnonymous: true,
      collectEmail: false,
      limitOneResponse: false,
      showProgressBar: true,
      customSuccessMessage: "Thanks for the feedback!",
    },
    questions: [
      {
        id: "q301",
        type: "rating",
        title: "How satisfied are you with your purchase?",
        order: 1,
        validation: { required: true, min: 1, max: 5 },
      },
      {
        id: "q302",
        type: "multiple_choice",
        title: "Which feature do you use most?",
        order: 2,
        options: [
          { id: "opt1", label: "Dashboard", value: "dashboard" },
          { id: "opt2", label: "Form Builder", value: "builder" },
          { id: "opt3", label: "Analytics", value: "analytics" },
        ],
        validation: { required: true },
      },
      {
        id: "q303",
        type: "checkbox",
        title: "Which improvements would you like to see?",
        order: 3,
        options: [
          { id: "opt1", label: "Faster loading", value: "speed" },
          { id: "opt2", label: "More templates", value: "templates" },
          { id: "opt3", label: "Better mobile support", value: "mobile" },
        ],
        validation: { required: false },
      },
      {
        id: "q304",
        type: "long_text",
        title: "Any other comments?",
        order: 4,
        validation: { required: false, maxLength: 500 },
      },
    ],
  },
  {
    slug: "job-application-software-engineer",
    title: "Job Application — Software Engineer",
    description: "Application form for the Software Engineer (Full-Stack) opening.",
    status: "draft",
    responsesCount: 0,
    viewsCount: 12,
    completionRate: 0,
    theme: {
      primaryColor: "#8b5cf6",
      backgroundColor: "#020617",
      cardStyle: "minimal",
      borderRadius: "sm",
      fontFamily: "Inter",
    },
    settings: {
      allowAnonymous: false,
      collectEmail: true,
      limitOneResponse: true,
      showProgressBar: true,
      customSuccessMessage: "Thanks for applying! We'll be in touch within 5 business days.",
    },
    questions: [
      {
        id: "q401",
        type: "short_text",
        title: "Full Name",
        order: 1,
        validation: { required: true, minLength: 2 },
      },
      {
        id: "q402",
        type: "date",
        title: "Earliest Start Date",
        order: 2,
        validation: { required: true },
      },
      {
        id: "q403",
        type: "file_upload",
        title: "Upload Resume (PDF)",
        order: 3,
        validation: { required: true },
      },
      {
        id: "q404",
        type: "dropdown",
        title: "Years of Experience",
        order: 4,
        options: [
          { id: "opt1", label: "0-1 years", value: "0-1" },
          { id: "opt2", label: "2-4 years", value: "2-4" },
          { id: "opt3", label: "5+ years", value: "5+" },
        ],
        validation: { required: true },
      },
    ],
  },
];

const submissionsFor = (formsBySlug) => [
  {
    formId: formsBySlug["student-registration-2026"]._id,
    submittedAt: new Date("2026-07-22T10:15:00Z"),
    respondentEmail: "student1@university.edu",
    completionTimeSeconds: 84,
    device: "desktop",
    answers: { q1: "Marcus Brody", q2: "cs_ai", q3: 4 },
  },
  {
    formId: formsBySlug["student-registration-2026"]._id,
    submittedAt: new Date("2026-07-22T11:42:00Z"),
    respondentEmail: "student2@university.edu",
    completionTimeSeconds: 110,
    device: "mobile",
    answers: { q1: "Sophia Chen", q2: "ds", q3: 5 },
  },
  {
    formId: formsBySlug["customer-feedback-survey"]._id,
    submittedAt: new Date("2026-07-30T09:05:00Z"),
    respondentEmail: "shopper@example.com",
    completionTimeSeconds: 63,
    device: "mobile",
    answers: {
      q301: 4,
      q302: "builder",
      q303: ["speed", "templates"],
      q304: "Would love a dark mode toggle in the builder itself.",
    },
  },
];

async function seed() {
  await connectDB();

  logger.success("Clearing existing Form & FormSubmission collections...");
  await Form.deleteMany({});
  await FormSubmission.deleteMany({});

  logger.success("Inserting dummy forms...");
  const insertedForms = await Form.insertMany(forms);
  const formsBySlug = Object.fromEntries(insertedForms.map((f) => [f.slug, f]));

  logger.success("Inserting dummy submissions...");
  await FormSubmission.insertMany(submissionsFor(formsBySlug));

  logger.success(
    `Seed complete: ${insertedForms.length} forms, ${submissionsFor(formsBySlug).length} submissions.`
  );

  await mongoose.connection.close();
  process.exit(0);
}

seed().catch((error) => {
  logger.error(`Seeding failed: ${error.message}`);
  process.exit(1);
});
