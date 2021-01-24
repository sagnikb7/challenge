const express = require('express');
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const exphbs = require('express-handlebars');
const nocache = require('nocache')


const result = dotenv.config()
if (result.error) { throw result.error }

const db = require('./db/connection');
db.connect(process.env.MONGODB_URI)
    .then(msg => { console.log(msg) })
    .catch(e => { console.log(e) })

//SETUP
const PORT = process.env.PORT;
const app = express();
app.use(nocache())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser())

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');



//ROUTE
const { verifyLoggedIn, verifyLoggedOut } = require('./utils/auth');

const userRoute = require('./routes/userRoute');
const classroomRoute = require('./routes/classroomRoute');

app.get('/', verifyLoggedOut, (req, res) => { res.render('login') });
app.use('/users', userRoute);
app.use('/classrooms', classroomRoute);


//SERVER
const server = app.listen(PORT, () => {
    console.log(`server started on ${PORT}`)
});



//SOCKET EVENTS


const ParticipantDAOClass = require('./db/participantDAO');
const ParticipantDAO = new ParticipantDAOClass();

const ClassroomLogDAOClass = require('./db/classroomLogDAO');
const ClassroomLogDAO = new ClassroomLogDAOClass();

const io = require('socket.io')(server);

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
        //logEVENT*

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
        io.to(channel).emit('deleteParticipant', { clientId })
        //logEVENT*
        // ClassroomLogDAO.save({shortId:channel,event:'disconnect',username:msg.initiator,role:'teacher'});
        ParticipantDAO.deleteOne({ clientId })
    });
});


