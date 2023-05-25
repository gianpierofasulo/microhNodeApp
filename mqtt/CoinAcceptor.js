// JSDoc

require('dotenv').config()

/**
 * @class CoinAcceptor:
 * 
 * La seguente classe si occupa di gestire i metodi della periferica CoinAcceptor.
 * I metodi implementati sono relativi agli ambiti macchina a stati, utility e mqtt.
 */
class CoinAcceptor {

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
            console.log('@@@@@@ CoinAcceptor > displayClass: '+this.constructor.name)
        }
    }
    /**
     * Metodo di utilità: mostra l'identità nel console.log
     */
    displayIdentity() {
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ CoinAcceptor > displayIdentity: '+this.identita)
        }
    }
    /**
     * Metodo di utilità: mostra lo stato nel console.log
     */
    displayStatus() {
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ CoinAcceptor > displayStatus: '+this.stato)
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
                // console.log(this.constructor.name+' > initIdentity > received Message:', topic, message.toString())
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
     * @returns {object} {topic: "CoinAcceptor/telemetry/identity"} 
     */
    identity() {
        const topic = 'CoinAcceptor/telemetry/identity'  
        var message = { topic : topic }
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ CoinAcceptor > identity > message ', message)
        }
        return message
    }

    /**
     * Metodo MQTT: ritorna telemetry identity
     * @returns {object} {topic: "CoinAcceptor/telemetry/status"} 
     */
    status() {
        const topic = 'CoinAcceptor/telemetry/status'  
        var message = { topic : topic }
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ CoinAcceptor > status > message ', message)
        }
        return message
    }

    /**
     * Metodo MQTT: ritorna telemetry cashIn
     * @returns {object} {topic: "CoinAcceptor/telemetry/cashIn"} 
     */
    cashIn() {
        const topic = 'CoinAcceptor/telemetry/cashIn'  
        var message = { topic : topic }
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ CoinAcceptor > cashIn > message ', message)
        }
        return message
    }

    /**
     * Metodo MQTT: ritorna telemetry dispenseComplete
     * @returns {object} {topic: "CoinAcceptor/telemetry/dispenseComplete"} 
     */
    dispenseComplete() {
        const topic = 'CoinAcceptor/telemetry/dispenseComplete'  
        var message = { topic : topic }
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ CoinAcceptor > dispenseComplete > message ', message)
        }
        return message
    }

    // ****************************************************************
    // command
    // ****************************************************************

    /**
     * Command to enable a CoinAcceptor
     * @param {*} body - payload
     * @returns {object} {topic: "", payload: ""} 
     */
    enable(body) {
        let command = {
            channelsList : [ { "enabled": true },  { "enabled": true }, { "enabled": true }, { "enabled": true }, { "enabled": true }, { "enabled": true } ],
            ts: Number(body.ts) // int
        }
        var message = {
            topic : 'CoinAcceptor/command/enable',  
            payload : command 
        }
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ CoinAcceptor > enable > command ', command)
            console.log('@@@@@@ CoinAcceptor > enable > message ', message)
        }
        return message
    }

    /**
     * Command to disable a CoinAcceptor
     * @param {*} body - payload
     * @returns {object} {topic: "", payload: ""} 
     */
    disable(body) {
        let command = {
            ts: Number(body.ts) // int
        }
        var message = {
            topic : 'CoinAcceptor/command/disable',  
            payload : command 
        }
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ CoinAcceptor > disable > command ', command)
            console.log('@@@@@@ CoinAcceptor > disable > message ', message)
        }
        return message
    }

    /**
     * Command to dispense "body.amount" from CoinAcceptor
     * @param {*} body - payload
     * @returns {object} {topic: "", payload: ""} 
     */
    dispense(body) {
        let command = {
            amount: Number(body.amount), // int
            mode: body.mode,             // "auto" o "select"
            // cashList : [ { "enabled": true, "currency": "1978", "quantity": 100 } ],
            ts: Number(body.ts)          // int
        }
        var message = {
            topic : 'CoinAcceptor/command/dispense',  
            payload : command 
        }
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ CoinAcceptor > dispense > command ', command)
            console.log('@@@@@@ CoinAcceptor > dispense > message ', message)
        }
        return message
    }

}

module.exports = CoinAcceptor