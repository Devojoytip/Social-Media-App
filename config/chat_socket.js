// SERVER SIDE
// this file is server(called observer) which will receive incoming connections from all the users(called subscribers). 
//to fire an event use .emit() & to receive/detect an event use .on()

//receiving req for con
module.exports.chatSockets = function (socketServer) {
    let io = require('socket.io')(socketServer);

    // it receives con & once con is established
    //it sends an ack to the user by emiting a connect event to connectionHandler
    io.sockets.on('connection', (socket) => {
        console.log('New connection received', socket.id); // socket has properties of the sender

        socket.on('disconnect', () => {
            console.log('Socket disconnected');
        })

        //it detects the event (here event is req to join a particular chatroom called 'codeial chat session')
        socket.on('join_my_chatroom', (data) => {
            console.log('Joining req received', data);

            //now the socket shud be joined to that chat room
            // if chatroom exists user will join else it will create the chatroom and then enter
            socket.join(data.chatroom);

            //now notify all users of the chatroom that a new user joined
            // to emit message to a chatroom we use io
            io.in(data.chatroom).emit('user_joined', data);
        });

        // detecting messages sent by a user 
        socket.on('send_message',(data)=>{

            // sending the message to everyone in the chatroom
            io.in(data.chatroom).emit('receive_message', data);
        })

    });

}