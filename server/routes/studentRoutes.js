const express = require('express');
const { getStudentProfile, upsertStudentProfile } = require('../controllers/studentController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

// All routes require authentication and STUDENT role
router.use(verifyToken, authorizeRoles('STUDENT'));

router.get('/profile', getStudentProfile);
router.post('/profile', upsertStudentProfile);

module.exports = router;
