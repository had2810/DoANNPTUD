const express = require("express");
const partsInventoryController = require("../../controllers/deviceService/partsInventoryController.js");
const { authenticate, authorize } = require("../../utils/authHandler.js");

const router = express.Router();

// Create a new parts inventory (Admin only)
router.post("/", authenticate, authorize("Admin"), partsInventoryController.createPartsInventory);

// Get all parts inventories (Authenticated)
router.get("/", authenticate, partsInventoryController.getPartsInventories);

// Get a parts inventory by ID (Authenticated)
router.get("/:id", authenticate, partsInventoryController.getPartsInventoryById);

// Update a parts inventory by ID (Admin only)
router.put("/:id", authenticate, authorize("Admin"), partsInventoryController.updatePartsInventory);

// Soft-delete a parts inventory by ID (Admin only)
router.put('/delete/:id', authenticate, authorize("Admin"), partsInventoryController.deletePartsInventory);

module.exports = router;
