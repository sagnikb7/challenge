const express = require('express');
const router = express.Router();
const { verifyRoleTeacher, verifyLoggedIn, checkParticipation } = require('../utils/auth')

const ClassrooomControllerClass = require('../controllers/classroomController');
const classroomController = new ClassrooomControllerClass();



// Register classroom
router.put('/', verifyRoleTeacher, classroomController.create);

//Enroll to a classroom
router.get('/active', verifyLoggedIn, classroomController.activeClasses)
router.get('/:shortId', verifyLoggedIn, checkParticipation, classroomController.enroll)

//Flip classroom status
router.patch('/', verifyRoleTeacher, classroomController.changeClassroomStatus);


module.exports = router;