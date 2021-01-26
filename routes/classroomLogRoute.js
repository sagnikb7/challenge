const express = require('express');
const router = express.Router();
const { verifyRoleTeacher } = require('../utils/auth')

const classroomLogController = new (require('../controllers/classroomLogController'))();

router.get('/:classRoomId', verifyRoleTeacher, classroomLogController.fetchLogs)


module.exports = router;