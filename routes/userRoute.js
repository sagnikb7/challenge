const express = require('express');
const router = express.Router();
const { verifyLoggedIn } = require('../utils/auth')

const UserControllerClass = require('../controllers/userController');
const userController = new UserControllerClass();



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
router.get('/dashboard', verifyLoggedIn, (req, res, next) => {
    let isTeacher = false;
    if (res.locals.role == "teacher") { isTeacher = true }
    res.render('dashboard', { "username": res.locals.username, "role": res.locals.role, "isTeacher": isTeacher });
})

module.exports = router;