const express = require('express');
const router = express.Router();
const news = require("./Controller/News");

router.post('/news', news.create)
router.get('/news', news.getAll)
router.get('/news/:id', news.getId)

module.exports = router;