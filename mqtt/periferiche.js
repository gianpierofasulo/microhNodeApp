// JSDoc

const fs = require('fs');   // fs sta per "file system" e fornisce un'API per lavorare con il file system in Node.js.
const os = require('os');   // os sta per "sistema operativo" e fornisce un'API per interagire con il sistema operativo in Node.js.
const periferiche = [];     // array di periferiche

/**
 * exports.init:
 * 
 * Il seguente modulo esporta la funzione init():
 * - la funzione "init" si occupa di inviare i `reset` e dell'attivazione delle periferiche;
 * - la funzione "init" ha due parametri in ingresso: "io" e "mqttClient";
 * - i due oggetti esterni vengono passati alla funzione al momento della sua chiamata;
 * 
 * @param {*} io - istanza di socket.io 
 * @param {*} mqttClient - istanza di mqtt handler
 * 
 */
exports.init = (io,mqttClient) => {

    // Inizializzazione body
    let body = {}
    // Inizializzazione init
    let inizializzazione = false

    if(process.env.DEBUG == 1 && process.env.DEBUG_INIT == 1) {
        console.log('\n[ ------------------------------------------------------ ]');
        console.log('[ @periferiche.js > mqttClient.connected: '+mqttClient.mqttClient.connected);
        console.log('[ ------------------------------------------------------ ]\n');
    }

    mqttClient.mqttClient.on('connect', (client) => {
        if(mqttClient.mqttClient.connected === true && inizializzazione === false) {

            inizializzazione = true
            // ****************************************************************
            // reset di HWBroker + BarcodeReader + ProductDoor
            // ****************************************************************
    
            body = { "ts": Date.now() }
            mqttClient.sendMessage('HWBroker/command/reset', JSON.stringify(body));
            mqttClient.sendMessage('BarcodeReader/command/reset', JSON.stringify(body));
            mqttClient.sendMessage('ProductDoor/command/reset', JSON.stringify(body));
            // TODO: mqttClient.sendMessage('FingerprintReader/command/reset', JSON.stringify(body));
    
            // ****************************************************************
            // Salvataggio degli stati su json tramite classe status
            // ****************************************************************
    
            // Status subscribe
            const Status = require(`./Status`)
            const statusClient = new Status(io,mqttClient)
            statusClient.initStatus()
    
            // ****************************************************************
            // Inizializzazione delle periferiche NON PRESENTI in ddxtouch.conf
            // ****************************************************************
    
            // Boards init
            const Boards = require(`./Boards`)
            const boardsClient = new Boards(mqttClient)
            boardsClient.initPeripheral()
    
            // Alarms init
            const Alarms = require(`./Alarms`)
            const alarmsClient = new Alarms(mqttClient)
            alarmsClient.initPeripheral()
    
            // Temperatures init
            const Temperatures = require(`./Temperatures`)
            const tempClient = new Temperatures(mqttClient)
            tempClient.initPeripheral()
    
            // Power init
            const Power = require(`./Power`)
            const powerClient = new Power(mqttClient)
            powerClient.initPeripheral()
    
            // GPIO subscribe
            const GPIO = require(`./GPIO`)
            const gpioClient = new GPIO(mqttClient)
            gpioClient.initPeripheral()
    
            // ****************************************************************
            // BarcodeReader enable & subscribe
            // ****************************************************************
    
            // const BarcodeReader = require(`./BarcodeReader`)
            // const barcodeReaderClient = new BarcodeReader(mqttClient)
            // mqttClient.sendMessage(barcodeReaderClient.enable(body).topic, JSON.stringify(barcodeReaderClient.enable(body).command));
    
            // ****************************************************************
            // Inizializzazione delle periferiche PRESENTI in ddxtouch.conf 
            // ****************************************************************
    
            try {
                let data;
                let platform = os.platform();
    
                if(process.env.DEBUG == 1 && process.env.DEBUG_INIT == 1) {
                    console.log('\n[ ------------------------------------------------------ ]');
                    console.log('[ @periferiche.js > platform: '+platform);
                    console.log('[ ------------------------------------------------------ ]\n');
                }
    
                if(platform == 'linux') {
                    data = fs.readFileSync("/etc/ddxtouch/ddxtouch.conf", 'utf8' );
                    if(process.env.DEBUG == 1 && process.env.DEBUG_INIT == 1) {
                        console.log('\n[ ------------------------------------------------------ ]');
                        console.log('[ @periferiche.js > ddxtouch.conf content:');
                        // console.log(data);
                        console.log('[ ------------------------------------------------------ ]\n');
                    }
                }
                else {
                    data = fs.readFileSync('./public/private/periferiche/periferiche.json', 'utf8');
                    if(process.env.DEBUG == 1 && process.env.DEBUG_INIT == 1) {
                        console.log('\n[ ------------------------------------------------------ ]');
                        console.log('[ @periferiche.js > periferiche.json content:');
                        // console.log(data);
                        console.log('[ ------------------------------------------------------ ]\n');
                    }
                }
    
                let jsonPeriferiche = [];
                jsonPeriferiche = JSON.parse(data);
    
                if(process.env.DEBUG == 1 && process.env.DEBUG_INIT == 1) { console.log('\n[ ------------------------------------------------------ ]'); }
                for (let periferica of jsonPeriferiche['peripherals']) {
                    // se enabled == true abilito periferica
                    if (periferica['enabled'] === true) {
                        if(process.env.DEBUG == 1 && process.env.DEBUG_INIT == 1) {
                            console.log('[ @periferiche.js > PERIFERICA INIT > '+periferica['id']);
                        }
                        const classePeriferica = periferica['id']
                        const requirePeriferica = require(`./${classePeriferica}`);
                        const oggettoPeriferica = new requirePeriferica(mqttClient)
                        oggettoPeriferica[`displayClass`]()
                        oggettoPeriferica.initPeripheral()
                        // messageIdentity = oggettoPeriferica[`identity`]()
                        // messageStatus = oggettoPeriferica[`status`]()
                        // mqttClient.receiveMessage(messageIdentity.topic, 'ddxtouch.conf');
                        // mqttClient.receiveMessage(messageStatus.topic, 'ddxtouch.conf');
                    }
                }
                if(process.env.DEBUG == 1 && process.env.DEBUG_INIT == 1) { console.log('[ ------------------------------------------------------ ]\n'); }
            }
            catch (err) {
                console.error(err);
            }
        }
    });

    
}