// JSDoc

require('dotenv').config()

const JSONStore = require('../classes/JsonStore.class');
const COINACCEPTOR_FILE = './public/private/periferiche/coinacceptor.json';             // ok
const BILLVALIDATOR_FILE = './public/private/periferiche/billvalidator.json';           // ok
const PRINTER_FILE = './public/private/periferiche/printer.json';                       // ok
const DISPENSERS_FILE = './public/private/periferiche/dispensers.json';                 // ok
const OPTICALBARRIER_FILE = './public/private/periferiche/opticalbarrier.json';         // ok
const BULKHEAD_FILE = './public/private/periferiche/bulkhead.json';                     // ok
const PRODUCTDOOR_FILE = './public/private/periferiche/productdoor.json';               // ok
const BARCODEREADER_FILE = './public/private/periferiche/barcodereader.json';           // ok
const AGEVALIDATOR_FILE = './public/private/periferiche/agevalidator.json';             // ok
const FINGERPRINTREADER_FILE = './public/private/periferiche/fingerprintreader.json';   // ..
const ALARM_FILE = './public/private/periferiche/alarms.json';                          // ok
const TEMPERATURES_FILE = './public/private/periferiche/temperatures.json';             // ok
const POWER_FILE = './public/private/periferiche/power.json';                           // ok
const GPIO_FILE = './public/private/periferiche/gpio.json';                             // ok

/**
 * @class Status:
 * 
 * La seguente classe si occupa di leggere la telemetria degli stati delle periferiche
 * e di salvare lo stato letto da ogni singola periferica e di salvarlo in un singolo json.
 * 
 * #Attenzione# La classe richiede il require di JsonStore per la lettura del file json.
 */
class Status {

    /**
     * Il costrutture della classe richiede i seguenti oggetti come parametri: io e mqttClient.
     * L'oggetto "io" corrisponde alla socket server mentre "mqttClient" è il client mqtt.
     * Ogni volta che avviene una modifica di stato su una periferica quest'ultimo viene salvato
     * sul json relativo ed in seguito tramite l'oggetto "io" viene inviato sulla socket un emit 
     * di tipo "status" che ha come messaggio il json in formato stringa dello stato attuale della periferica.
     * 
     * @constructor
     * @param {*} io 
     * @param {*} mqttClient 
     */
    constructor(io, mqttClient) {
        this.mqttClient = mqttClient
        this.io = io
    }
    
    /**
     * 
     */
    initStatus() {
        console.log('??? passa ???')

        this.mqttClient.receiveMessage('+/telemetry/status', 'Status.js');
        this.mqttClient.mqttClient.on('message', (topic, message) => {

            if(process.env.DEBUG == 1 && process.env.DEBUG_STATUS == 1) {
                console.log('\n[ ------------------------------------------------------ ]');
                console.log('[ @Status.js > topic registrato da Status.js: '+topic)
                console.log('[ ------------------------------------------------------ ]\n');
            }
            
            try {
                // ricavo il nome della periferica
                let periferica = topic.split('/')[0];

                // file da leggere
                let status_file;
                
                // TODO:
                // controllare le periferiche presenti

                if (topic == 'CoinAcceptor/telemetry/status') {
                    status_file = new JSONStore(COINACCEPTOR_FILE);
                }
                else if (topic == 'BillValidator/telemetry/status') {
                    status_file = new JSONStore(BILLVALIDATOR_FILE);
                }
                else if (topic == 'Printer/telemetry/status') {
                    status_file = new JSONStore(PRINTER_FILE);
                }
                else if (topic == 'Dispensers/telemetry/status') {
                    status_file = new JSONStore(DISPENSERS_FILE);
                }
                else if (topic == 'OpticalBarrier/telemetry/status') {
                    status_file = new JSONStore(OPTICALBARRIER_FILE);
                }
                else if (topic == 'Bulkhead/telemetry/status') {
                    status_file = new JSONStore(BULKHEAD_FILE);
                }
                else if (topic == 'ProductDoor/telemetry/status') {
                    status_file = new JSONStore(PRODUCTDOOR_FILE);
                }
                else if (topic == 'BarcodeReader/telemetry/status') {
                    status_file = new JSONStore(BARCODEREADER_FILE);
                }
                else if (topic == 'AgeValidator/telemetry/status') {
                    status_file = new JSONStore(AGEVALIDATOR_FILE);
                }
                // else if (topic == 'FingerprintReader/telemetry/status') {
                //     status_file = new JSONStore(FINGERPRINTREADER_FILE);
                // }
                else if (topic == 'Alarms/telemetry/status') {
                    status_file = new JSONStore(ALARM_FILE);
                }
                else if (topic == 'Temperatures/telemetry/status') {
                    status_file = new JSONStore(TEMPERATURES_FILE);
                }
                else if (topic == 'Power/telemetry/status') {
                    status_file = new JSONStore(POWER_FILE);
                }
                else if (topic == 'GPIO/telemetry/status') {
                    status_file = new JSONStore(GPIO_FILE);
                }

                /**
                 * leggo il file e invio emit su socket
                 */
                if(status_file){
                    const status = status_file.read();
                    const parsedMessage = JSON.parse(message);
                    status[periferica] = parsedMessage
                    let scrittura = status_file.write(status);
                    if(process.env.DEBUG == 1 && process.env.DEBUG_STATUS == 1) {
                        console.log('\n[ ------------------------------------------------------ ]');
                        console.log('[ @Status.js > Emit da status.js:',JSON.stringify(status))
                        console.log('[ ------------------------------------------------------ ]\n');
                    }
                    /**
                     * se il file è stato scritto invio emit
                     */
                    if(scrittura == true){
                        this.io.emit('status', JSON.stringify(status))
                    }
                }else{
                    return
                }

            } catch (e) {
                console.log('\n[ ------------------------------------------------------ ]');
                console.log("[ @Status.js > errore status.js!", e)
                console.log('[ ------------------------------------------------------ ]\n');
            }
        })
    }
}

module.exports = Status
