const { nanoid } = require('nanoid');

const ClassroomDAOClass = require('../db/classroomDAO');
const ClassroomDAO = new ClassroomDAOClass();
class UserController {

    constructor() { }
    async activeClasses(req, res) {
        let activeClassrooms = await ClassroomDAO.findAndSort({ status: "started" }, { createdAt: -1 });
        res.status(200).send({ "active": activeClassrooms })
    }
    async create(req, res) {
        try {

            let createdBy = res.locals.username;

            const shortId = nanoid(10);

            let classroomObj = { shortId, createdBy }

            let status = await ClassroomDAO.save(classroomObj);
            if (status) {
                res.status(201).send({ "message": "classroom created", "id": shortId });
            }
            else {
                res.status(400).send({ "message": "classroom not created (status false)", "error": status })
            }

        } catch (error) {
            res.status(400).send({ "message": "classroom not created", "error": error.message })
        }
    }

    async enroll(req, res) {


        let role = res.locals.role;
        let username = res.locals.username;

        const shortId = req.params.shortId

        let classroomObj = await ClassroomDAO.findOne({ shortId });


        if (classroomObj) {
            let { status } = classroomObj;
            if (role == 'teacher') {
                res.render('classroom', { username, shortId, isTeacher: true, })
            } else if (role == "student" && status == "started") {
                res.render('classroom', { username, shortId, isTeacher: false })
            } else {
                res.render('classroom', { username, shortId, isTeacher: false, waitScreen: true })
            }
        } else {
            res.status(400).send({ "message": "classroom does not exist" })
        }

    }

    async changeClassroomStatus(req, res) {
        let { shortId, status } = req.body;
        let classroomObj = await ClassroomDAO.findOne({ shortId });
        if (classroomObj) {
            if (status == classroomObj.status) {
                res.status(400).send({ "message": `classroom status is already set to ${status}` });
            } else {
                try {
                    let data = await ClassroomDAO.findOneAndUpdate({ shortId }, { status });
                    res.status(200).send({ "message": `status changed to ${status}` })
                } catch (error) {
                    res.status(400).send({ "message": "classroom status change error", "error": error.message });
                }
            }

        } else {
            res.status(400).send({ "message": "classroom does not exist" });
        }

    }


}

module.exports = UserController;