const { Router } = require("express");
const asyncHandler = require("../../lib/asyncHandler");

const WhatsAppController = Router();
WhatsAppController.post(
  "/",
  asyncHandler(async (req, res) => {
    const payload = req.body
    console.log("==============SENDING MESSAGE======================")
    console.log(payload)
    await req.whatsapp.sendMessage(`${req.body.phone}@c.us`, req.body.message);
    console.log("==================DONE====================")
    res.json(payload)
  })
);

module.exports = WhatsAppController