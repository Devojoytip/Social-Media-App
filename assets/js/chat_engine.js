// FRONTEND PART- USER/CLIENT SIDE
// this file will communicate from client side

// this class sends req for connection
class ChatEngine {
    constructor(chatBoxId, userEmail) {
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;

        // intialise a con/ sending a con req on the port socket server is running
        this.socket = io.connect('http://localhost:5000', { transports: ['websocket'] });

        if (this.userEmail) {
            this.connectionHandler();
        }

    }

    // handles comm. b/w subscriber & observer
    // it detects the con req sent
    connectionHandler() {
        let self = this;

        // connect event occurs
        this.socket.on('connect', () => {
            console.log('Connection established using sockets !');
        });

        // can give any name here join_my_chatroom
        // this event received in chat_socket
        self.socket.emit('join_my_chatroom', {
            user_email: self.userEmail,
            chatroom: 'codeial chat session'
        });

        self.socket.on('user_joined', (data) => {
            console.log('New user joined', data);
        });

        $('#send-message').click(() => {
            let msg = $('#chat-message-input').val();

            // if msg not empty then emit msg
            if (msg !== '') {
                self.socket.emit('send_message', {
                    message: msg,
                    user_email: self.userEmail,
                    chatroom: 'codeial chat session'
                })
            }
        });

        self.socket.on('receive_message', (data) => {
            console.log('Message received', data.message);

            let newMessage = $('<li>');
            let messageType = 'other-message';

            if (data.user_email === self.userEmail) {
                messageType = 'self-message';
            }

            newMessage.append($('<span>', {
                'html': data.message
            }));

            newMessage.append($('<sub>', {
                'html': data.user_email
            }));

            newMessage.addClass(messageType);

            $('#chat-messages-list').append(newMessage);
        })

    }
}