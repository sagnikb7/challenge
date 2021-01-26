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
const { verifyLoggedOut } = require('./utils/auth');

const userRoute = require('./routes/userRoute');
const classroomRoute = require('./routes/classroomRoute');
const classroomLogRoute = require('./routes/classroomLogRoute');
const participantRoute = require('./routes/participantRoute');

app.get('/', verifyLoggedOut, (req, res) => { res.render('login') });
app.use('/users', userRoute);
app.use('/classrooms', classroomRoute);
app.use('/classroomlogs', classroomLogRoute);
app.use('/participants', participantRoute);


//SERVER
const server = app.listen(PORT, () => {
    console.log(`server started on ${PORT}`)
});


//SOCKET SERVER
const io = require('socket.io')(server);
const socketEvents = require('./socketEvents')
socketEvents(io)