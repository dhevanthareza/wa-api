const express = require('express');

const router = express.Router();
const bookController = require('./book.controller')

router.get('/', bookController.get);
router.post('/create', bookController.create);

module.exports = router;
