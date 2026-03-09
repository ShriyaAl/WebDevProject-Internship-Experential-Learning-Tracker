const express = require('express');
const { getDashboard, updateRequestStatus, upsertProfile, getInternships, verifyInternship } = require('../controllers/inchargeController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(verifyToken, authorizeRoles('INCHARGE', 'ADMIN')); // Admins usually can do what incharges can

router.post('/profile', upsertProfile);
router.get('/dashboard', getDashboard);
router.put('/requests/:id/status', updateRequestStatus);

// Internship Verification
router.get('/internships', getInternships);
router.put('/internships/:id/verify', verifyInternship);

module.exports = router;
