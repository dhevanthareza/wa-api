const { Router } = require("express");
const asyncHandler = require("../../lib/asyncHandler");

const WhatsAppController = Router();
WhatsAppController.post(
  "/",
  asyncHandler(async (req, res) => {
    const payload = req.body
    await req.whatsapp.sendText(`${req.body.phone}@c.us`, req.body.message);
    res.json(payload)
  })
);

module.exports = WhatsAppController