const express = require("express");
const partController = require("../../controllers/deviceService/partController.js");
const { authenticate, authorize } = require("../../utils/authHandler.js");

const router = express.Router();

// Create a new part (Admin only)
router.post("/", authenticate, authorize("Admin"), partController.createPart);

// Get all parts (Authenticated)
router.get("/", authenticate, partController.getParts);

// Get a part by ID (Authenticated)
router.get("/:id", authenticate, partController.getPartById);

// Update a part by ID (Admin only)
router.put("/:id", authenticate, authorize("Admin"), partController.updatePart);

// Soft-delete a part by ID (Admin only)
router.put("/delete/:id", authenticate, authorize("Admin"), partController.deletePart);

module.exports = router;
