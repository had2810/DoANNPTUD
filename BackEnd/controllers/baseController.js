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
      const items = await service.getAll();
      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const item = await service.getById(req.params.id);
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
      await service.delete(req.params.id);
      res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
});

module.exports = baseController;
