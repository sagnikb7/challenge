const express = require('express');
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const exphbs = require('express-handlebars');


const result = dotenv.config()
if (result.error) { throw result.error }

const db = require('./db/connection');
db.connect(process.env.MONGODB_URI)
    .then(msg => { console.log(msg) })
    .catch(e => { console.log(e) })

//SETUP
const PORT = process.env.PORT;
const app = express();
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

const io = require('socket.io')(server);

io.on('connection', client => {

    console.log("--> Recieved Connection")

    client.on('register', msg => {
        msg.clientId = client.id;
        console.log("--> req for register", msg)
        //on successful register - emit event and push to db
        io.emit('addParticipant', msg)

    });

    client.on('classStart', msg => {
        //broadcast to all
        console.log('--> classStart');
        io.emit('classStartConfirm', msg);
    });

    client.on('classEnd', msg => {
        //broadcast to all
        console.log('--> classEnd');
        io.emit('classEndConfirm', msg);
    });

    client.on('disconnect', () => {
        //disconnect remove 
        console.log('--> disconnected');
    });
});


