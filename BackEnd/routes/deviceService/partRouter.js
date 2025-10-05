const express = require("express");
const partController = require("../../controllers/deviceService/partController.js");

const router = express.Router();

// Create a new part
router.post("/", partController.createPart);

// Get all parts
router.get("/", partController.getParts);

// Get a part by ID
router.get("/:id", partController.getPartById);

// Update a part by ID
router.put("/:id", partController.updatePart);

// Delete a part by ID
// Soft-delete a part by ID
router.put("/delete/:id", partController.deletePart);

module.exports = router;
