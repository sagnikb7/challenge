
//SOCKET EVENTS

const ParticipantDAOClass = require('./db/participantDAO');
const ParticipantDAO = new ParticipantDAOClass();

const ClassroomLogDAOClass = require('./db/classroomLogDAO');
const ClassroomLogDAO = new ClassroomLogDAOClass();


function socketEvents(io) {
    io.on('connection', client => {


        // console.log("")

        client.on('joinChannel', msg => {
            console.log(`--> Joining channel ${msg.shortId}`);
            client.join(msg.shortId);
        });

        client.on('register', msg => {
            msg.clientId = client.id;
            console.log("--> req for register", msg)

            //on successful register - emit event and push to db

            let { username, shortId, clientId, isTeacher } = msg;
            io.to(shortId).emit('addParticipant', msg);

            let role = null;
            if (isTeacher == "true") {
                role = "teacher";
            } else if (isTeacher == "false") {
                role = "student";
            }
            //logEVENT
            ClassroomLogDAO.save({ shortId, event: 'join', username, role });
            ParticipantDAO.save({ shortId, username, clientId, role })


        });

        client.on('classStart', msg => {
            console.log('--> classStart');
            io.to(msg.shortId).emit('classStartConfirm', msg);

            //logEVENT
            ClassroomLogDAO.save({ shortId: msg.shortId, event: 'started', username: msg.initiator, role: 'teacher' });
        });

        client.on('classEnd', msg => {
            console.log('--> classEnd');
            io.to(msg.shortId).emit('classEndConfirm', msg);

            //logEVENT
            ClassroomLogDAO.save({ shortId: msg.shortId, event: 'ended', username: msg.initiator, role: 'teacher' });
        });

        client.on('disconnect', () => {
            //disconnect remove


            let ref = client.handshake.headers.referer;
            ref = ref.split("/");
            let size = ref.length - 1;

            let channel = ref[size];
            let clientId = client.id;

            console.log(`--> disconnected ${clientId} from ${channel}`);

            ParticipantDAO.findOne({ clientId }).then((data) => {

                //logEVENT (get client info)
                ClassroomLogDAO.save(
                    {
                        shortId: data.shortId,
                        event: 'disconnect',
                        username: data.username,
                        role: data.role
                    });
                ParticipantDAO.deleteOne({ clientId });
            })
            io.to(channel).emit('deleteParticipant', { clientId })

        });
    });
}



module.exports = socketEvents;

