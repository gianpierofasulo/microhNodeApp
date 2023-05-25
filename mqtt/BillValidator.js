// JSDoc

require('dotenv').config()

/**
 * @class BillValidator:
 * 
 * La seguente classe si occupa di gestire i metodi della periferica BillValidator.
 * I metodi implementati sono relativi agli ambiti macchina a stati, utility e mqtt.
 */
class BillValidator {
    
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
            console.log('@@@@@@ BillValidator > displayClass: '+this.constructor.name)
        }
    }
    /**
     * Metodo di utilità: mostra l'identità nel console.log
     */
    displayIdentity() {
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ BillValidator > displayIdentity: '+this.identita)
        }
    }
    /**
     * Metodo di utilità: mostra lo stato nel console.log
     */
    displayStatus() {
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ BillValidator > displayStatus: '+this.stato)
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
     * @returns {object} {topic: "BillValidator/telemetry/identity"} 
     */
    identity() {
        const topic = 'BillValidator/telemetry/identity'  
        var message = { topic : topic }
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ BillValidator > identity > message ', message)
        }
        return message
    }

    /**
     * Metodo MQTT: ritorna telemetry status
     * @returns {object} {topic: "BillValidator/telemetry/status"} 
     */
    status() {
        const topic = 'BillValidator/telemetry/status'  
        var message = { topic : topic }
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ BillValidator > status > message ', message)
        }
        return message
    }

    /**
     * Metodo MQTT: ritorna telemetry status
     * @returns {object} {topic: "BillValidator/telemetry/cashIn"} 
     */
    cashIn() {
        const topic = 'BillValidator/telemetry/cashIn'  
        var message = { topic : topic }
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ BillValidator > cashIn > message ', message)
        }
        return message
    }

    /**
     * Metodo MQTT: ritorna telemetry status
     * @returns {object} {topic: "BillValidator/telemetry/cashInPending"} 
     */
    cashInPending() { // FIXME: a cosa serve questo metodo?
        const topic = 'BillValidator/telemetry/cashInPending'  
        var message = { topic : topic }
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ BillValidator > cashInPending > message ', message)
        }
        return message
    }

    /**
     * Metodo MQTT: ritorna telemetry status
     * @returns {object} {topic: "BillValidator/telemetry/dispenseComplete"} 
     */
    dispenseComplete() {
        const topic = 'BillValidator/telemetry/dispenseComplete'  
        var message = { topic : topic }
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ BillValidator > dispenseComplete > message ', message)
        }
        return message
    }

    /**
     * Metodo MQTT: ritorna telemetry status
     * @returns {object} {topic: "BillValidator/telemetry/collectComplete"} 
     */
    collectComplete() {
        const topic = 'BillValidator/telemetry/collectComplete'  
        var message = { topic : topic }
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ BillValidator > collectComplete > message ', message)
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
     * @returns {object} {topic: "BillValidator/command/enable", payload: "..."} 
     */
    enable(body) {
        let command = {
            channelsList : [ { "enabled": true, "escrow": false },  { "enabled": true, "escrow": false }, { "enabled": true, "escrow": false }, { "enabled": true, "escrow": false }, { "enabled": true, "escrow": false }, { "enabled": true, "escrow": false }, { "enabled": true, "escrow": false }, { "enabled": true, "escrow": false }, { "enabled": true, "escrow": false }, { "enabled": true, "escrow": false }, { "enabled": true, "escrow": false }, { "enabled": true, "escrow": false }, { "enabled": true, "escrow": false }, { "enabled": true, "escrow": false }, { "enabled": true, "escrow": false }, { "enabled": true, "escrow": false } ],
            ts: Number(body.ts) // int
        }
        var message = {
            topic : 'BillValidator/command/enable',  
            payload : command 
        }
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ BillValidator > enable > command ', command)
            console.log('@@@@@@ BillValidator > enable > message ', message)
        }
        return message
    }

    /**
     * Metodo MQTT: comando di reset del barcode reader.
     * Accetta l'oggetto "body" come parametro.
     * @param {*} body 
     * @returns {object} {topic: "BillValidator/command/disable", payload: "..."} 
     */
    disable(body) {
        let command = {
            ts: Number(body.ts) // int
        }
        var message = {
            topic : 'BillValidator/command/disable',  
            payload : command 
        }
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ BillValidator > disable > command ', command)
            console.log('@@@@@@ BillValidator > disable > message ', message)
        }
        return message
    }

    /**
     * Metodo MQTT: comando di reset del barcode reader.
     * Accetta l'oggetto "body" come parametro.
     * @param {*} body 
     * @returns {object} {topic: "BillValidator/command/dispense", payload: "..."} 
     */
    dispense(body) {
        let command = {
            amount: Number(body.amount), // int
            mode: body.mode,             // "auto" o "select"
            cashList : [ { "enabled": body.enabled, "currency": body.currency, "quantity": body.quantity } ],
            ts: Number(body.ts)          // int
        }
        var message = {
            topic : 'BillValidator/command/dispense',  
            payload : command 
        }
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ BillValidator > dispense > command ', command)
            console.log('@@@@@@ BillValidator > dispense > message ', message)
        }
        return message
    }

    /**
     * Metodo MQTT: comando di reset del barcode reader.
     * Accetta l'oggetto "body" come parametro.
     * @param {*} body 
     * @returns {object} {topic: "BillValidator/command/collect", payload: "..."} 
     */
    collect(body) {
        let command = {
            amount: Number(body.amount), // int
            mode: body.mode,             // "auto" o "select"
            cashList : [ { "enabled": body.enabled, "currency": body.currency, "quantity": body.quantity } ],
            ts: Number(body.ts)          // int
        }
        var message = {
            topic : 'BillValidator/command/collect',  
            payload : command 
        }
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ BillValidator > dispense > command ', command)
            console.log('@@@@@@ BillValidator > dispense > message ', message)
        }
        return message
    }

    /**
     * Metodo MQTT: comando di reset del barcode reader.
     * Accetta l'oggetto "body" come parametro.
     * @param {*} body 
     * @returns {object} {topic: "BillValidator/command/open", payload: "..."} 
     */
    accept(body) {
        let command = {
            ts: Number(body.ts) // int
        }
        var message = {
            topic : 'BillValidator/command/accept',  
            payload : command 
        }
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ BillValidator > accept > command ', command)
            console.log('@@@@@@ BillValidator > accept > message ', message)
        }
        return message
    }

    /**
     * Metodo MQTT: comando di reset del barcode reader.
     * Accetta l'oggetto "body" come parametro.
     * @param {*} body 
     * @returns {object} {topic: "BillValidator/command/open", payload: "..."} 
     */
    reject(body) {
        let command = {
            ts: Number(body.ts) // int
        }
        var message = {
            topic : 'BillValidator/command/reject',  
            payload : command 
        }
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ BillValidator > reject > command ', command)
            console.log('@@@@@@ BillValidator > reject > message ', message)
        }
        return message
    }
   
}

module.exports = BillValidator