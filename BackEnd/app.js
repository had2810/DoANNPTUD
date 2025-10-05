var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var morgan = require("morgan");
var cors = require("cors");
let mongoose = require("mongoose");
const dotenv = require("dotenv");

// load .env
dotenv.config();

var app = express();

// use JSON/body parsing with larger limit
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors());
app.use(morgan("common"));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Routes (use project routes under BackEnd/routes)
const adminRoute = require("./routes/humanResources/adminRouter");
const userRoute = require("./routes/humanResources/userRouter");
const employeeRoute = require("./routes/humanResources/employeeRouter");
const permissionRoute = require("./routes/humanResources/permissionRouter");
const authJwtRouter = require("./routes/authJwtRouter");
const deviceTemplateRoute = require("./routes/deviceService/deviceTemplateRouter");
const serviceRouter = require("./routes/deviceService/serviceRouter");
const partRouter = require("./routes/deviceService/partRouter");
const partsInventoryRouter = require("./routes/deviceService/partsInventoryRouter");
const deviceUserRouter = require("./routes/deviceService/deviceUserRouter");
const appointmentsRouter = require("./routes/repairScheduling/appointmentsRouter");
const employeeWorkRoute = require("./routes/repairScheduling/employeeWorkRouter");
const repairStatusRouter = require("./routes/repairScheduling/repairStatusRouter");
const scheduleRoute = require("./routes/repairScheduling/scheduleRoute");

// Connect to MongoDB (use MONGO_URL from env if available)
const mongoUrl =
  process.env.MONGO_URL || "mongodb://localhost:27017/DoAnNNPTUD";
mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("✅ MongoDB connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    // don't exit here to allow app to load for dev purposes; optional: process.exit(1);
  });

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection lost:", err);
});

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB disconnected. Trying to reconnect...");
});

// Mount APIs
app.use("/v1/auth", authJwtRouter);

/* Api Human Resource */
app.use("/v1/admin", adminRoute);
app.use("/v1/user", userRoute);
app.use("/v1/employee", employeeRoute);
app.use("/v1/permission", permissionRoute);

/* API Repair Scheduling */
app.use("/v1/appointments", appointmentsRouter);
app.use("/v1/employee-work", employeeWorkRoute);
app.use("/v1/repair-status-device", repairStatusRouter);

/* Api Device Service */
app.use("/v1/device-user", deviceUserRouter);
app.use("/v1/device-template", deviceTemplateRoute);
app.use("/v1/service", serviceRouter);
app.use("/v1/part", partRouter);
app.use("/v1/parts-inventory", partsInventoryRouter);

/* Personal Schedule API */
app.use("/v1/schedule", scheduleRoute);

// view engine setup (keep existing)
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// existing middleware for development logging and static files are set above

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
