const express = require('express');
const multer = require('multer');
const router = express.Router();
const scoringController = require('../controllers/scoringController');

const upload = multer({ dest: 'uploads/' });

// Routes
router.post('/offer', scoringController.setOffer);
router.post('/leads/upload', upload.single('file'), scoringController.uploadLeads);
router.post('/score', scoringController.scoreLeads);
router.get('/results', scoringController.getResults);
router.get('/results/csv', scoringController.exportResultsCSV);

module.exports = router;
