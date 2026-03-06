const { getSampleData } = require('../controllers/sampleController');
const express = require('express');

const router = express.Router();

router.get('/sample', getSampleData);

module.exports = router;
