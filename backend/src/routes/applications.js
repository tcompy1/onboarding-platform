const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationControllers');

// POST /applications - Create new application
router.post('/', applicationController.createApplication);

// GET /applications - Get all applications (will be used for admin)
router.get('/', applicationController.getAllApplications);

module.exports = router;