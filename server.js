const express = require("express")
const app = express()
const http = require("http").createServer(app)
var path = require('path')
require('dotenv').config()

const PORT = process.env.PORT || 3000

//listening on port
http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}.`);
})

//Sending file with express
app.use(express.static(path.join(__dirname, '/public')));
app.get('/', (req, res) =>{
    res.render("index.html")
})

//Socket
const io = require("socket.io")(http)

io.on('connection', (socket) => {
    // console.log('User Connected...');

    //Tell everyone that somebody joined
    socket.on('I-am-join', name =>{
        // console.log(`${name} joined`);
        socket.broadcast.emit('newUser-joined', name)
    })

    socket.on('messageSent', (msgObj) => {
        // console.log(msgObj);
        socket.broadcast.emit('messageSent', (msgObj))
    })
})