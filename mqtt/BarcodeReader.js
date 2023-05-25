// JSDoc

require('dotenv').config()

/**
 * @class BarcodeReader:
 * 
 * La seguente classe si occupa di gestire i metodi della periferica BarcodeReader.
 * I metodi implementati sono relativi agli ambiti macchina a stati, utility e mqtt.
 */
class BarcodeReader {

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
        //this.vm = vm;
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
            console.log('@@@@@@ BarcodeReader > displayClass: '+this.constructor.name)
        }
    }
    /**
     * Metodo di utilità: mostra l'identità nel console.log
     */
    displayIdentity() {
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ BarcodeReader > displayIdentity: '+this.identita)
        }
    }
    /**
     * Metodo di utilità: mostra lo stato nel console.log
     */
    displayStatus() {
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ BarcodeReader > displayStatus: '+this.stato)
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

    // ...

    // ****************************************************************
    // telemetry
    // ****************************************************************

    /**
     * Metodo MQTT: ritorna telemetry identity
     * @returns {object} {topic: "BarcodeReader/telemetry/identity"} 
     */
    identity() {
        const topic = 'BarcodeReader/telemetry/identity'
        var message = { topic : topic }
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ BarcodeReader > identity > message ', message)
        }
        return message
    }
    
    /**
     * Metodo MQTT: ritorna telemetry status
     * @returns {object} {topic: "BarcodeReader/telemetry/identity"} 
     */
    status() {
        const topic = 'BarcodeReader/telemetry/status'
        var message = { topic : topic }
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ BarcodeReader > status > message ', message)
        }
        return message
    }

    /**
     * Metodo MQTT: ritorna telemetry barcode
     * @returns {object} {topic: "BarcodeReader/telemetry/identity"} 
     */
    barcode() {
        const topic = 'BarcodeReader/telemetry/barcode'
        var message = { topic : topic }
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ BarcodeReader > barcode > message ', message)
        }
        return message
    }

    // ****************************************************************
    // command
    // ****************************************************************

    /**
     * Metodo MQTT: comando di reset del barcode reader.
     * Accetta l'oggetto "body" come parametro.
     * @param {*} body 
     * @returns {object} {topic: "BarcodeReader/command/endSession", payload: "..."} 
     */
    reset(body) {
        let command = {
            ts: Number(body.ts) // int
        }
        var message = {
            topic : 'BarcodeReader/command/reset',  
            payload : command 
        }
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ BarcodeReader > reset > command ', command)
            console.log('@@@@@@ BarcodeReader > reset > message ', message)
        }
        return message
    }

    /**
     * Metodo MQTT: comando di abilitazione del barcode reader.
     * Accetta l'oggetto "body" come parametro.
     * @param {*} body 
     * @returns {object} {topic: "BarcodeReader/command/enable", payload: "..."} 
     */
    enable(body) {
        let command = {
            ts: Number(body.ts) // int
        }
        var message = {
            topic : 'BarcodeReader/command/enable',  
            payload : command 
        }
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ BarcodeReader > enable > command ', command)
            console.log('@@@@@@ BarcodeReader > enable > message ', message)
        }
        return message
    }

    /**
     * Metodo MQTT: comando di disabilitazione del barcode reader.
     * Accetta l'oggetto "body" come parametro.
     * @param {*} body 
     * @returns {object} {topic: "BarcodeReader/command/disable", payload: "..."} 
     */
    disable(body) {
        let command = {
            ts: Number(body.ts) // int
        }
        var message = {
            topic : 'BarcodeReader/command/disable',  
            payload : command 
        }
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ BarcodeReader > disable > command ', command)
            console.log('@@@@@@ BarcodeReader > disable > message ', message)
        }
        return message
    }

}

module.exports = BarcodeReader
