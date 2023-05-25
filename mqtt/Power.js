// JSDoc

require('dotenv').config()

/**
 * @class Power:
 * 
 * La seguente classe si occupa di gestire i metodi della periferica Power.
 * I metodi implementati sono relativi agli ambiti utility, init e mqtt.
 * 
 */
class Power {
    
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
    constructor(mqttClient, vm=null) {
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
            console.log('@@@@@@ Power > displayClass: '+this.constructor.name)
        }
    }
    /**
     * Metodo di utilità: mostra l'identità nel console.log
     */
    displayIdentity() {
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ Power > displayIdentity: '+this.identita)
        }
    }
    /**
     * Metodo di utilità: mostra lo stato nel console.log
     */
    displayStatus() {
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ Power > displayStatus: '+this.stato)
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
        this.checkPower()
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
                // console.log('@@@@@@ Power > initIdentity > received Message:', topic, message.toString())
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
     * Logica relativa a monitoraggio power
     */
    checkPower() {
        this.mqttClient.registerHandler(this.status().topic, message => {
            let parsedMessage = JSON.parse(message)

            // TODO:
            // - scrittura su json stati
            // - scrittura su log

            if(parsedMessage.power=='battery') {
                console.log('MQTT > batteryLevel message:', parsedMessage.batteryLevel)

                // TODO:
                // logica relativa a shutdown
                // logica relativa a watchdog

                if(parsedMessage.batteryLevel < 30) {

                    console.log('Livello BATTERIA minore di 30%')
                    console.log('MQTT > batteryLevel message:', parsedMessage.batteryLevel)
                    
                    let body = { "ts": parseInt(Date.now()/1000) }
                    this.mqttClient.sendMessage(this.shutdown(body).topic, JSON.stringify(this.shutdown(body).payload));

                }
                else {
                    console.log('Livello BATTERIA maggiore di 30%')
                    console.log('MQTT > batteryLevel message:', parsedMessage.batteryLevel)
                }
            }
            else if(parsedMessage.power=='main') {
                console.log('MQTT > main message:', parsedMessage.power)
            }
        });
    }

    // ****************************************************************
    // telemetry
    // ****************************************************************

    /**
     * Metodo MQTT: ritorna telemetry identity
     * @returns {object} {topic: "Power/telemetry/identity"} 
     */
    identity() {
        const topic = 'Power/telemetry/identity' // vedi documentazione > DDxTouch_MQTT_1.0.18.pdf
        var message = {
            topic : topic,
        }
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ Power > identity > message ', message)
        }
        return message
    }

    /**
     * Metodo MQTT: ritorna telemetry status
     * @returns {object} {topic: "Alarms/telemetry/status"} 
     */
    status() {
        const topic = 'Power/telemetry/status' // vedi documentazione > DDxTouch_MQTT_1.0.18.pdf
        var message = {
            topic : topic
        }
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ Power > status > message ', message)
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
     * @returns {object} {topic: "Power/command/shutdown", payload: "..."} 
     */
    shutdown(body) {
        let command = {
            ts: Number(body.ts) // int
        }
        var message = {
            topic : 'Power/command/shutdown', // vedi documentazione > DDxTouch_MQTT_1.0.18.pdf
            payload : command 
        }
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ Power > shutdown > command ', command)
            console.log('@@@@@@ Power > shutdown > message ', message)
        }
        return message
    }

    /**
     * Metodo MQTT: comando di accensione della sirena.
     * Accetta l'oggetto "body" come parametro.
     * @param {*} body 
     * @returns {object} {topic: "Power/command/watchdog", payload: "..."} 
     */
    watchdog(body) {
        let command = {
            "enable": body.enable,              // abilitazione controllo del watchdog su comunicazione 
            "timeout": Number(body.timeout),    // tempo (in secondi) da attendere prima del riavvio 
            "ts": Number(body.ts)
        }
        var message = {
            topic : 'Power/command/watchdog',   // vedi documentazione > DDxTouch_MQTT_1.0.18.pdf
            payload : command
        }
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ Power > watchdog > command ', command)
            console.log('@@@@@@ Power > watchdog > message ', message)
        }
        return message
    }
   
}

module.exports = Power