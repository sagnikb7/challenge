const express = require('express');
const router = express.Router();
const { verifyLoggedIn } = require('../utils/auth')

const UserControllerClass = require('../controllers/userController');
const userController = new UserControllerClass();

const classroomDAO = new (require('../db/classroomDAO'))();


// Register Users
router.put('/', userController.create);

//Login Users
router.post('/login', userController.login);

//Logout Users
router.get("/logout", (req, res) => {
    res.clearCookie("jwt");
    res.redirect("/");
});


//Dashboard
router.get('/dashboard', verifyLoggedIn, async (req, res, next) => {
    let isTeacher = false;
    if (res.locals.role == "teacher") { isTeacher = true }
    let activeClassrooms = await classroomDAO.findAndSort({ status: "started" }, { createdAt: -1 });
    res.render('dashboard', { "username": res.locals.username, "role": res.locals.role, "isTeacher": isTeacher, "class": activeClassrooms });
})

module.exports = router;