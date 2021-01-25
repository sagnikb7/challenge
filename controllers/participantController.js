const ParticipantDAOClass = require('../db/participantDAO');
const ParticipantDAO = new ParticipantDAOClass();

class ParticipantController {

    constructor() { }

    async listParticipantsViaClassRoom(req, res) {
        try {

            let { classRoomId } = req.params;
            let participantsList = await ParticipantDAO.findAndSort({ "shortId": classRoomId }, { "createdAt": -1 }, { "clientId": 1, "username": 1, "role": 1 })

            if (participantsList) {
                res.status(200).send({ "message": "success", "participantsList": participantsList });
            }
            else {
                res.status(400).send({ "message": "error in participants list (status false)", "error": status })
            }

        } catch (error) {
            res.status(400).send({ "message": "error in participants list", "error": error.message })
        }
    }

}

module.exports = ParticipantController;