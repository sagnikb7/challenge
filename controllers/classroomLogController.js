const ClassroomLogDAOClass = require('../db/classroomLogDAO');
const ClassroomLogDAO = new ClassroomLogDAOClass();

class ClassroomLogController {

    constructor() { }

    async fetchLogs(req, res) {
        try {

            let { classRoomId } = req.params;
            let logs = await ClassroomLogDAO.findAndSort({ "shortId": classRoomId }, { "createdAt": 1 })

            if (logs) {
                res.status(200).send({ "message": "success", "logs": logs });
            }
            else {
                res.status(400).send({ "message": "error in logs (status false)", "error": status })
            }

        } catch (error) {
            res.status(400).send({ "message": "error in fetching logs", "error": error.message })
        }
    }

};


module.exports = ClassroomLogController;