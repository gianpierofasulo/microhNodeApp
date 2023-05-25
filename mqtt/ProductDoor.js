// JSDoc

require('dotenv').config()

/**
 * @class ProductDoor:
 * 
 * La seguente classe si occupa di gestire i metodi della periferica ProductDoor.
 * I metodi implementati sono relativi agli ambiti macchina a stati, utility e mqtt.
 * 
 */
class ProductDoor {

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
            console.log('@@@@@@ ProductDoor > displayClass: '+this.constructor.name)
        }
    }
    /**
     * Metodo di utilità: mostra l'identità nel console.log
     */
    displayIdentity() {
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ ProductDoor > displayIdentity: '+this.identita)
        }
    }
    /**
     * Metodo di utilità: mostra lo stato nel console.log
     */
    displayStatus() {
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ ProductDoor > displayStatus: '+this.stato)
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
                // console.log('@@@@@@ ProductDoor > initIdentity > received Message:', topic, message.toString())
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
     * @returns {object} {topic: "ProductDoor/telemetry/identity"} 
     */
    identity() {
        const topic = 'ProductDoor/telemetry/identity'  
        var message = { topic : topic }
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ ProductDoor > identity > message ', message)
        }
        return message
    }

    /**
     * Metodo MQTT: ritorna telemetry status
     * @returns {object} {topic: "ProductDoor/telemetry/status"} 
     */
    status() {
        const topic = 'ProductDoor/telemetry/status'  
        var message = { topic : topic }
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ ProductDoor > status > message ', message)
        }
        return message
    }

    // ****************************************************************
    // command
    // ****************************************************************

    /**
     * Metodo MQTT: comando di apertura del portello prodotto.
     * Accetta l'oggetto "body" come parametro.
     * @param {object} body 
     * @returns {object} {topic: "ProductDoor/command/open", payload: "..."} 
     */
    open(body) {
        let command = {
            ts: Number(body.ts) // int
        }
        var message = {
            topic : 'ProductDoor/command/open',  
            payload : command
        }
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ ProductDoor > open > command ', command)
            console.log('@@@@@@ ProductDoor > open > message ', message)
        }
        return message
    }

    /**
     * Metodo MQTT: comando di chiusura del portello prodotto.
     * Accetta l'oggetto "body" come parametro.
     * @param {object} body 
     * @returns {object} {topic: "ProductDoor/command/close", payload: "..."} 
     */
    close(body) {
        let command = {
            ts: Number(body.ts) // int
        }
        var message = {
            topic : 'ProductDoor/command/close',  
            payload : command
        }
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ ProductDoor > close > command ', command)
            console.log('@@@@@@ ProductDoor > close > message ', message)
        }
        return message
    }

    /**
     * Metodo MQTT: comando di reset del portello prodotto.
     * Accetta l'oggetto "body" come parametro.
     * @param {object} body 
     * @returns {object} {topic: "ProductDoor/command/reset", payload: "..."} 
     */
    reset(body) {
        let command = {
            ts: Number(body.ts) // int
        }
        var message = {
            topic : 'ProductDoor/command/reset',  
            payload : command
        }
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ ProductDoor > reset > command ', command)
            console.log('@@@@@@ ProductDoor > reset > message ', message)
        }
        return message
    }


}

module.exports = ProductDoor
