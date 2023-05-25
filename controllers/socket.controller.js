
const Socket = require("../classes/SocketClient.class");

exports.barcode = (barcode_field) => {
    console.log('CONTROLLER ---> START BARCODE',barcode_field);
    Socket.sendMessage('barcode','');
    Socket.receiveMessage('barcode','barcode',barcode_field);
}

exports.alarms = (alarms) => {
    console.log('CONTROLLER ---> START ',alarms);
    Socket.sendMessage('stream','');
    Socket.receiveMessage('stream','stream',alarms);
}

exports.stato_periferiche = (cb) => {
    console.log('CONTROLLER ---> Status ' );
    Socket.receiveMessageCB('status','status', cb);
}
