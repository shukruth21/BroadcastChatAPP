"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let allSockets = [];
/* allsockets {
  {socket: socket1, room: "room1"},
  {socket: socket2, room :"room2"}
  ....
}*/
wss.on("connection", (socket) => {
    //when a user connects push the users socket to the all socket array
    //allSockets.push(socket)
    //userCount++
    console.log("user connected ");
    // to handle the message sent on this server 
    socket.on("message", (message) => {
        //console.log("message recieved  " + message.toString())
        //sending the same message back 
        /*setTimeout(()=>{
            socket.send(message.toString() + ":sent from the server")
        },1000)*/
        //now since all the sockets are present in an arrat
        // we indiviually send the message to be brodcasted 
        //by iterating over all the sockets
        //allSockets.forEach(s=>{
        //s.send(message.toString())
        //})
        // detect the type of the message user is trying to send is it a join or is it chat 
        //if join then push that socket to that all sockets with its room id 
        // id chat then find the user room then find all the sockets in that room 
        // and brodcast it 
        //@ts-ignore
        const parsedMessage = JSON.parse(message);
        //parsed message is a string
        if (parsedMessage.type === 'join') {
            allSockets.push({
                socket,
                room: parsedMessage.payload.roomId
            });
        }
        if (parsedMessage.type === "chat") {
            // const currentUserRoom = allSockets.find((x)=> x.socket == socket).room
            let currentUserRoom = null;
            for (let i = 0; i < allSockets.length; i++) {
                if (allSockets[i].socket == socket) {
                    currentUserRoom = allSockets[i].room;
                }
            }
            for (let i = 0; i < allSockets.length; i++) {
                if (allSockets[i].room == currentUserRoom) {
                    allSockets[i].socket.send(parsedMessage.payload.message);
                }
            }
        }
    });
    /* socket.on("disconnect",()=>{
         //this removes a socket that is not connected anymore
         allSockets = allSockets.filter(x => x!=socket)
     })*/
});
