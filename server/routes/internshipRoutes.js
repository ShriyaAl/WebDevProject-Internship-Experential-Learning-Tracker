const express = require('express');
const { createInternship, getMyInternships, getInternshipById } = require('../controllers/internshipController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(verifyToken);

// Student Only Routes
router.post('/', authorizeRoles('STUDENT'), createInternship);
router.get('/my', authorizeRoles('STUDENT'), getMyInternships);

// Shared Routes
router.get('/:id', authorizeRoles('STUDENT', 'INCHARGE'), getInternshipById);

module.exports = router;
