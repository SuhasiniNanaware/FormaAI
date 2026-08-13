const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes");
const formRoutes = require("./routes/form.routes");

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use("/api/auth", authRoutes);
app.use("/api/forms", formRoutes);

// Test Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Forma AI Backend Running"
  });
});

module.exports = app;
