const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const roomLevelName = document.getElementById('room-level');

var random_question = "";

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users, level }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }

  // Emit message to server
  socket.emit('chatMessage', msg);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {


  if(message.text.startsWith("Q:")){
    post_question(message.text);
  }else{
    const div = document.createElement('div');
    div.classList.add('message');
    const p = document.createElement('p');
    p.classList.add('meta');
    p.innerText = message.username;
    p.innerHTML += `<span> ${message.time}</span>`;
    div.appendChild(p);
    const para = document.createElement('p');
    para.classList.add('text');
    para.innerText = message.text;
    div.appendChild(para);
    document.querySelector('.chat-messages').appendChild(div);
  }


}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});

//-----------------------------------addition subtraction multiplication division

function random_generate(){
  var numbers = $("#inputNumbers").val();
  var level = $("#inputLevel").val();
  var lstnumbers = random_number_question(numbers,level);
  var newq = "";
  var type = "";

  console.log(lstnumbers);

  if(roomName.innerHTML == "addition"){
    type = " + ";
  }else if(roomName.innerHTML == "subtraction"){
    type = " - ";
  }else if(roomName.innerHTML == "multiplication"){
    type = " * ";
  }else if(roomName.innerHTML == "division"){
    type = " / ";
  }

  for (var i = 0; i < lstnumbers.length; i++) {
    newq += lstnumbers[i] + type;
  }

  var output = newq.slice(0, -3);
  
  $("#NewQuestion").html("Q: " + output);
}

function send_question(){
  var senddata = $("#NewQuestion").text();
  $("#msg").val(senddata);
}

function random_number_question(number_count,level){
  level = level * 10;
  var question = [];

  for(var i = 0; i < number_count; i++) {
    number = Math.floor(Math.random() * level);
    question.push(number);
  }
  
  return question;
}

function post_question(q){
  $("#ChatMsgs").append(create_question(q));
}

function create_question(m){
  var msg = m.split("Q:");
  //var qmsg = msg[1].split(",");
  var q = `<div class="card text-white bg-info" style="width: 18rem;">
  <div class="card-body">
    <h5 class="card-title">Question </h5>
    <p class="card-text">`+msg[1]+` =</p>
  </div>
  
  <div class="card-body">

  </div>
</div>`;

/*  <button onclick="setup_answer_question(`+qmsg[0]+`,`+qmsg[1]+`)" type="button" class="btn btn-primary" data-toggle="modal" data-target="#answerModal">
  Submit answer
</button>
<ul class="list-group list-group-flush">
    <li class="list-group-item bg-dark">Cras justo odio</li>
  </ul>

*/
return q;
}

function setup_answer_question(question,questionnumber){
  $("#QuestionNumber").html("Question " + questionnumber);
  $("#Question").html(question + " = ");
}

$( document ).ready(function() {
  console.log( "welcome to fret" );
  load_levels();
});


function load_levels(){
  for(var i = 1; i <= 100; i++) {
    var num  = i + 1;
    $("#inputLevel").append('<option value="'+i+'">'+i+'</option>');
    $("#inputNumbers").append('<option value="'+num+'">'+num+'</option>');
  }
}

