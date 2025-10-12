module.exports = {
  // Old helper kept for compatibility: response(res, success, data, statusCode)
  response: function (res, success, data, statusCode = 200) {
    res.status(statusCode).send({
      success: success,
      data: data,
    });
  },

  // New exported helper used across the codebase: Response(res, status, success, data)
  Response: function (res, status = 200, success = true, data = null) {
    res.status(status).send({
      success: success,
      data: data,
    });
  },
};
