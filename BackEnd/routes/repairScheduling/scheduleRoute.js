const scheduleController = require("../../controllers/repairScheduling/scheduleController.js");
const express = require("express");
const { authenticate, authorize } = require("../../utils/authHandler.js");

const router = express.Router();

// Get Available Time By Date (Public)
router.get(
  "/available-time/by-date",
  scheduleController.getAvailableTimeByDate
);

// Get Available Time By Month (Public)
router.get(
  "/available-time/by-month",
  scheduleController.getAvailableTimeByMonth
);

// Get An Available Time (Public)
router.get(
  "/available-time/employee-work-schedule",
  scheduleController.getAnAvailableTime
);

// Get Available Consultant Times (Public)
router.get(
  "/available-consultant-times",
  scheduleController.getAvailableConsultantTimes
);

// Get Month Schedule (Authenticated)
router.get("/monthly-status", authenticate, scheduleController.getMonthSchedule);

// Set Day Off (Admin only)
router.post("/set-day-off", authenticate, authorize("Admin"), scheduleController.setDayOff);

// Remove Day Off (Admin only)
router.post("/remove-day-off", authenticate, authorize("Admin"), scheduleController.removeDayOff);

module.exports = router;
