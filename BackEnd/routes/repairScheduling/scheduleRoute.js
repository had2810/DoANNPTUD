const scheduleController = require("../../controllers/repairScheduling/scheduleController.js");
const express = require("express");

const router = express.Router();

// Get Available Time By Date
router.get(
  "/available-time/by-date",
  scheduleController.getAvailableTimeByDate
);

// Get Available Time By Month
router.get(
  "/available-time/by-month",
  scheduleController.getAvailableTimeByMonth
);

// Get An Available Time
router.get(
  "/available-time/employee-work-schedule",
  scheduleController.getAnAvailableTime
);

// Get Available Consultant Times
router.get(
  "/available-consultant-times",
  scheduleController.getAvailableConsultantTimes
);

// Get Month Schedule
router.get("/monthly-status", scheduleController.getMonthSchedule);

// Set Day Off
router.post("/set-day-off", scheduleController.setDayOff);

// Remove Day Off
router.post("/remove-day-off", scheduleController.removeDayOff);

module.exports = router;
