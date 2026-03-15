const express = require('express');
const {
    createInternship,
    getMyInternships,
    getInternshipById,
    updateInternshipDocuments,
    submitExitSurvey
} = require('../controllers/internshipController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(verifyToken);

// Student Only Routes
router.post('/', authorizeRoles('STUDENT'), createInternship);
router.get('/my', authorizeRoles('STUDENT'), getMyInternships);
router.patch('/:id/documents', authorizeRoles('STUDENT'), updateInternshipDocuments);
router.patch('/:id/exit-survey', authorizeRoles('STUDENT'), submitExitSurvey);

// Shared Routes
router.get('/:id', authorizeRoles('STUDENT', 'INCHARGE'), getInternshipById);

module.exports = router;
