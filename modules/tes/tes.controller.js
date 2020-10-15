const { Router } = require("express");

const TestController = Router();
TestController.get("/", (req, res) => {
  res.json({ message: "App running" });
});
module.exports = TestController;
