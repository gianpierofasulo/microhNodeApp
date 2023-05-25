// TODO: eliminare

const io = require("socket.io-client");

let socket;

module.exports = class AppSocket {
    constructor(ip) {
        this.ip = ip;
        console.log('connected to localhost on soket 3100');
        socket = io.connect(ip, {
            reconnection: true
        });
    }

    // sendMessageOld(event){
    //     socket.on('connect', function () {
    //         console.log('connected to localhost:3000');
    //         this.socket.emit(event);
    //         console.log(`ho inviato ${event}`)
    //     });
    // }

    sendMessage(event){
        this.socket.emit(event);
        //console.log(`ho inviato ${event}`)
    }

    receiveMessage(event,emit){
        socket.on(event, function (data) {
            //console.log('message from the server:');
            this.socket.emit(emit, `Ho ricevuto ${data}`);
        });
    }
}