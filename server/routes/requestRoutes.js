const express = require('express');
const { createRequest, resubmitRequest, getRequestDetails, getRequestTypes, getMyRequests } = require('../controllers/requestController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(verifyToken);

// Types
router.get('/types/all', getRequestTypes);

// Student's own requests list (must be before /:id)
router.get('/my', authorizeRoles('STUDENT'), getMyRequests);

// Shared View
router.get('/:id', authorizeRoles('STUDENT', 'INCHARGE'), getRequestDetails);

// Student Creation & Resubmission
router.post('/', authorizeRoles('STUDENT'), createRequest);
router.put('/:id/resubmit', authorizeRoles('STUDENT'), resubmitRequest);

module.exports = router;
