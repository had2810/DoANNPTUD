const baseController = (service) => ({
  create: async (req, res) => {
    try {
      const item = await service.create(req.body);
      res.status(201).json(item);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const includeDeleted = req.query.includeDeleted === "true";
      const items = await service.getAll({}, { includeDeleted });
      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const includeDeleted = req.query.includeDeleted === "true";
      const item = await service.getById(req.params.id, { includeDeleted });
      if (!item) {
        return res.status(404).json({ message: "Not found" });
      }
      res.status(200).json(item);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const item = await service.update(req.params.id, req.body);
      res.status(200).json(item);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      // Always perform soft-delete via base service (set isDeleted = true)
      const deleted = await service.delete(req.params.id, { hard: false });
      if (!deleted) {
        return res.status(404).json({ message: "Not found" });
      }
      res.status(200).json(deleted);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },



});

module.exports = baseController;
