const express = require('express');
const router = express.Router();
const { verifyRoleTeacher, verifyLoggedIn } = require('../utils/auth')

const ClassrooomControllerClass = require('../controllers/classroomController');
const classroomController = new ClassrooomControllerClass();



// Register Classroom
router.put('/', verifyRoleTeacher, classroomController.create);

router.get('/:shortId', verifyLoggedIn, classroomController.enroll)

//Flip Classroom status
router.patch('/', verifyRoleTeacher, classroomController.changeClassroomStatus);


module.exports = router;