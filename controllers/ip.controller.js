
const file_ip = './public/data/ip.json';
const JSONStore = require('../classes/JsonStore.class.js');

exports.getCurrentIp = () => {
        try {
            let file = new JSONStore(file_ip);
            let obj = file.read();
            if(obj) return obj;

        } catch (err) {
            console.error(err);
            message = 'File non presente'
        	return message;
        }

};