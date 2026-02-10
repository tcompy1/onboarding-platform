const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationControllers');

// Public routes
router.post('/', applicationController.createApplication);

// Admin routes (will be protected later)
router.get('/', applicationController.getAllApplications);
router.get('/:id', applicationController.getApplicationById);
router.put('/:id/status', applicationController.updateApplicationStatus);

module.exports = router;