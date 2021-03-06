const socket = io()
let InputMsg = document.querySelector("#messageInp")
let messageContainer = document.querySelector('.container')
var audio = new Audio("chatTone.mp3")
let name;

do {
    name = prompt("please enetr your name.")
} while (! name);

socket.emit('I-am-join', name)

//Client pressing enter
InputMsg.addEventListener('keyup', (e) => {
    if(e.key == 'Enter'){
        e.preventDefault();
        sendMessage(e.target.value);
    }
})

//Sending fucntion
function sendMessage(msg){
    let msgObj = {
        user: name,
        message: msg.trim()
    }

    appendMessage(msgObj, 'right')
    InputMsg.value = ''
    scrollToBottom()

    //send to server
    socket.emit('messageSent', msgObj)
}

//Appending function
function appendMessage(msg, type){
    let messageDiv = document.createElement('div')
    let className = type
    messageDiv.classList.add(className, 'message')

    let markup = `
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>
    `
    messageDiv.innerHTML = markup
    messageContainer.appendChild(messageDiv)

}

//Receiving message
socket.on('messageSent', (msgObj) => {
    appendMessage(msgObj, 'left')
    audio.play()
    scrollToBottom()
})

function scrollToBottom(){
    messageContainer.scrollTop = messageContainer.scrollHeight
}

//new user notification
function appendNewUser(newName){
    let messageDiv = document.createElement('div')
    // let className = type
    messageDiv.classList.add('usernotification')

    let markup = `
        <center>
        <p><strong>${newName}</strong> joined the chat server.</p>
        </center>
    `
    messageDiv.innerHTML = markup
    messageContainer.appendChild(messageDiv)

}

socket.on('newUser-joined', newName =>{
    appendNewUser(newName)
})

//users online
socket.on('totalusers', (Ourdata) =>{
    // document.body.innerHTML = Ourdata
    appendUserOnlineData(Ourdata)
})

function appendUserOnlineData(Onlinedata){
    let messageDiv = document.createElement('div')
    // let className = type
    messageDiv.classList.add('usernotification')

    let markup = `
        <center>
        <p>${Onlinedata}.</p>
        </center>
    `
    messageDiv.innerHTML = markup
    messageContainer.appendChild(messageDiv)

}

//user disconnection
// socket.on('userleft', (leftname) => {
//     document.body.innerHTML = leftname
// })