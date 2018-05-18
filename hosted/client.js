"use strict";
let user;
let socket;
//joining the room
let enterRoomButton;
let userTextBox;

const socketOn = () => {
    //errors from server
    socket.on('lobbyTaken', (data) => {
        console.log("Lobby is taken: " + room);
    });
    
    socket.on('lobbyHasStarted', () => {
        console.log("Their game has started " + room + isInGame);
    });
    
    socket.on('notEnoughPlayers', (membersInLobby) => {
       //document.getElementById("loadingMessage").innerHTML = "Lobby has " + membersInLobby + " players, you need at least 3.";  
    });
    
    //when user joins the monkey cage
    socket.on('joinedCage', () => {
        enteredTheCage();
    });
    
    //populate the username list
    socket.on('fillUsernameList', (data) => {
        console.log(data);
        fillUsernameList(data);
    });
};

//called when player attempts to join a room
const enterRoom = () => {
    user = document.getElementById("username").value;
    //if username field is left blank, default to username "Player"
    if(user == "") {user = "Player";}
    console.log("username: " + user);
    //add numbers to the end to ensure seperate usernames
    user = user + `${(Math.floor((Math.random()*10000)) + 1)}`;
    console.log("username: " + user);
    const data = { userID: user};
    socket.emit('join', data);
    
    //get rid of enter room button to stop duplicate enteries TODO: Re-add the button if they are rejected
    enterRoomButton.style.display = "none";
};

//set up the cage for prime viewing
const enteredTheCage = () => {
    //document.getElementById('cageCover').style.display("block");
    
    //get rid of all lobby elements
    var lobbyElements = document.getElementsByClassName("lobby");
    for(var i = 0; i < lobbyElements.length; i++){
        lobbyElements[i].style.display = "none";
    }
    
    //show all monkey cage elements
    document.body.style.backgroundColor = "#132D3F";
    
    var cageElements = document.getElementsByClassName("cage");
    for(var i = 0; i < cageElements.length; i++){
        cageElements[i].style.visibility = "visible";
    }
};

const fillUsernameList = (data) => {
    const usernames = data;
    
    
    //clear the user list
    document.getElementById("usernameList").innerHTML = "Current Users:";
    
    for(let i = 0; i < usernames.length; i++){
        const username = usernames[i].ID;

        var p = document.createElement("p");
        var node = document.createTextNode(username);
        p.appendChild(node);

        document.getElementById("usernameList").appendChild(p);
    }
};

//similar architecture
const init = () => {
    socket = io.connect();
    enterRoomButton = document.getElementById("roomEnter");
    userTextBox = document.getElementById("username");
    userTextBox.addEventListener("keyup", function(e) {
      event.preventDefault();
      if(event.keyCode == 13) {
          enterRoomButton.click();
      }
    });
  enterRoomButton.onclick = enterRoom;
  socketOn();
};

window.onload = init;