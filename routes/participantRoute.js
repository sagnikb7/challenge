const express = require('express');
const router = express.Router();
const { verifyLoggedIn } = require('../utils/auth')

const participantController = new (require('../controllers/participantController'))();

router.get('/classroom/:classRoomId', verifyLoggedIn, participantController.listParticipantsViaClassRoom)


module.exports = router;