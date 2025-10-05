const express = require("express");
const partsInventoryController = require("../../controllers/deviceService/partsInventoryController.js");

const router = express.Router();

// Create a new parts inventory
router.post("/", partsInventoryController.createPartsInventory);

// Get all parts inventories
router.get("/", partsInventoryController.getPartsInventories);

// Get a parts inventory by ID
router.get("/:id", partsInventoryController.getPartsInventoryById);

// Update a parts inventory by ID
router.put("/:id", partsInventoryController.updatePartsInventory);

// Delete a parts inventory by ID
router.delete("/:id", partsInventoryController.deletePartsInventory);

module.exports = router;
