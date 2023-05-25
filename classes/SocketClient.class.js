const io = require("socket.io-client");
let ip = async () => {
    return await fetch('/ip/get');
}
const current_ip = ip();

/**
 * Prova classe socket
 * @constructor
 */
class AppSocket {
    constructor(ip) {
        this.ip = ip;
        this.socket = io.connect(ip, {
            reconnection: true,
            forceNew:true
        });
        this.socket.on('connect', function () {
            console.log(`connected to localhost:${ip}`);
        });
    }

     sendMessage(emit,message){
         this.socket.emit(emit,message);
    }
    

    receiveMessage(server,emit,el){
        this.socket.on(server, function (data) {
            data = JSON.parse(data);
            
            if(data){
                printBarcode(data,el);
            }
            if(process.env.DEBUG == 1 && process.env.DEBUG_SOCKET == 1) {
                console.error('@@ DATA FROM SOCKET CLIENT ----->',data);
            }

        });

        function printBarcode(data,el){
            el.value = data;
        }


    }

    receiveMessageCB(server,emit,cb){
        this.socket.on(server, (data) => { 
            cb(data);
            console.log(data);
        }); 
    }



}


const socket = new AppSocket(current_ip);
module.exports = socket;
