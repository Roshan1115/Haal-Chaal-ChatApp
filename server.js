const express = require("express")
const app = express()
const http = require("http").createServer(app)
var path = require('path')
require('dotenv').config()
const PORT = process.env.PORT || 3000
var userCount = 0

//listening on port
http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}.`);
})

//Sending file with express
app.use(express.static(path.join(__dirname, '/public')));
app.get('/', (req, res) =>{
    res.render("index.html")
})


// .........................................
// socket
// .........................................
var leftusername = ''
const io = require("socket.io")(http)

// ON CONNECTION
io.on('connection', (socket) => {
    // console.log('User Connected...');
    userCount++
    io.emit('totalusers', userCount + ' user(s) online')

    //Tell everyone that somebody joined
    socket.on('I-am-join', name =>{
        // console.log(`${name} joined`);
        socket.broadcast.emit('newUser-joined', name)
    })

    socket.on('messageSent', (msgObj) => {
        // console.log(msgObj);
        socket.broadcast.emit('messageSent', (msgObj))
    })

    // ON DISCONNECTION
    socket.on('disconnect', () => {
        userCount--
        io.emit('totalusers', userCount + ' user(s) online')
    })
})

