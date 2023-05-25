// JSDoc

require('dotenv').config()

/**
 * @class Printer:
 * 
 * La seguente classe si occupa di gestire i metodi della periferica Printer.
 * I metodi implementati sono relativi agli ambiti utility, init e mqtt.
 * 
 */
class Printer {
    
    // private var
    #subscribe

    // public var
    identita = ''
    stato = ''
    mqttClient
    vm

    /**
     * Il costrutture della classe richiede i seguenti oggetti come parametri: FSM e mqttClient.
     * L'oggetto "FSM" contiene la definizione degli stati e delle transizioni della macchina a stati.
     * In base allo stato in cui si trova la macchina a stati la periferiche effettuerà diverse azioni.
     * L'oggetto "mqttClient" è il client mqtt che viene utilizzato per comunicare con il modulo
     * mqtt a basso livello tramite i metodi definiti all'interno della classe.
     * 
     * @constructor
     * @param {vendingMachineFSM} vm 
     * @param {mqttClient} mqttClient
     */
    constructor(mqttClient) {
        // this.vm = vm;
        this.mqttClient = mqttClient
    }

    // ****************************************************************
    // utility
    // ****************************************************************

    /**
     * Metodo di utilità: ritorna il nome della classe
     * @returns {string}
     */
    getClassName() {
        return this.constructor.name
    }
    /**
     * Metodo di utilità: mostra il nome della classe nel console.log
     */
    displayClass() {
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ Printer > displayClass: '+this.constructor.name)
        }
    }
    /**
     * Metodo di utilità: mostra l'identità nel console.log
     */
    displayIdentity() {
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ Printer > displayIdentity: '+this.identita)
        }
    }
    /**
     * Metodo di utilità: mostra lo stato nel console.log
     */
    displayStatus() {
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ Printer > displayStatus: '+this.stato)
        }
    }

    // ****************************************************************
    // init
    // ****************************************************************

    /**
     * Logica relativa a inizializzazione della periferica
     */
    initPeripheral() {
        this.getIdentity()
        this.getStatus()
        this.checkPrinter()
        //FIXME:
        //this.subscribe()
    }

    /**
     * Logica relativa a recupero identity periferica
     */
    getIdentity() {
        this.mqttClient.receiveMessage(this.identity().topic, this.getClassName())
        this.mqttClient.mqttClient.on('message', (topic, message) => {
            if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
                // console.log('@@@@@@ Printer > initIdentity > received Message:', topic, message.toString())
            }
            if(topic === this.identity().topic) {
                this.identita = message
                this.displayIdentity()
            }
        })
    }

    /**
     * Logica relativa a recupero status periferica
     */
    getStatus() {
        this.mqttClient.receiveMessage(this.status().topic, this.getClassName())
    }

    // ****************************************************************
    // BL
    // ****************************************************************

    /**
     * Logica relativa a printer
     */
    checkPrinter() {
        this.mqttClient.registerHandler(this.status().topic, message => {
            let parsedMessage = JSON.parse(message)

            // TODO:
            // - scrittura su json stati
            // - scrittura su log

            if(parsedMessage.status!='offline') {
                if(parsedMessage.status==='error') {
                    console.log('\n[ ------------------------------------------------------ ]');
                    console.log('[ @Printer.js > carta esaurita:'+parsedMessage.status)
                    console.log('[ ------------------------------------------------------ ]\n');
                }
                else if(parsedMessage.status==='ready') {
                    console.log('\n[ ------------------------------------------------------ ]');
                    console.log('[ @Printer.js > carta presente:'+parsedMessage.status)
                    console.log('[ ------------------------------------------------------ ]\n');
                }
            }

            /*
            if(parsedMessage.status=='error') {
                console.log('MQTT > printer message:', parsedMessage.error)

                if(parsedMessage.error == 'paperEnd') {
                    console.log('Carta per la stampa esaurita!')
                    console.log('MQTT > printer message:', parsedMessage.error)
                }
                else if(parsedMessage.error == 'none') {
                    console.log('Carta per la stampa presente!')
                    console.log('MQTT > printer message:', parsedMessage.error)
                }
            }
            else if(parsedMessage.power=='ready') {
                console.log('Stampante funzionante!')
                console.log('MQTT > printer message:', parsedMessage.error)
            }
            */
        });
    }

    // ****************************************************************
    // telemetry
    // ****************************************************************

    /**
     * Metodo MQTT: ritorna telemetry identity
     * @returns {object} {topic: "Printer/telemetry/identity"} 
     */
    identity() {
        const topic = 'Printer/telemetry/identity' // vedi documentazione > DDxTouch_MQTT_1.0.18.pdf
        var message = {
            topic : topic,
        }
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ Printer > identity > message ', message)
        }
        return message
    }

    /**
     * Metodo MQTT: ritorna telemetry status
     * @returns {object} {topic: "Alarms/telemetry/status"} 
     */
    status() {
        const topic = 'Printer/telemetry/status' // vedi documentazione > DDxTouch_MQTT_1.0.18.pdf
        var message = {
            topic : topic
        }
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ Printer > status > message ', message)
        }
        return message
    }

    // ****************************************************************
    // command
    // ****************************************************************

    /**
     * Metodo MQTT: comando di accensione della sirena.
     * Accetta l'oggetto "body" come parametro.
     * @param {*} body 
     * @returns {object} {topic: "Printer/command/shutdown", payload: "..."} 
     */
    shutdown(body) {
        let command = {
            ts: Number(body.ts) // int
        }
        var message = {
            topic : 'Printer/command/shutdown', // vedi documentazione > DDxTouch_MQTT_1.0.18.pdf
            payload : command 
        }
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ Printer > shutdown > command ', command)
            console.log('@@@@@@ Printer > shutdown > message ', message)
        }
        return message
    }

    /**
     * Metodo MQTT: comando di accensione della sirena.
     * Accetta l'oggetto "body" come parametro.
     * @param {*} body 
     * @returns {object} {topic: "Printer/command/watchdog", payload: "..."} 
     */
    watchdog(body) {
        let command = {
            "enable": body.enable,              // abilitazione controllo del watchdog su comunicazione 
            "timeout": Number(body.timeout),    // tempo (in secondi) da attendere prima del riavvio 
            "ts": Number(body.ts)
        }
        var message = {
            topic : 'Printer/command/watchdog',   // vedi documentazione > DDxTouch_MQTT_1.0.18.pdf
            payload : command
        }
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ Printer > watchdog > command ', command)
            console.log('@@@@@@ Printer > watchdog > message ', message)
        }
        return message
    }
   
}

module.exports = Printer