// JSDoc

require('dotenv').config()
const tempController = require('./controllers/temperatures.controllers.js')     // importanzione modulo temperature.controller

/**
 * @class Temperatures:
 * 
 * La seguente classe si occupa di gestire i metodi della periferica Temperatures.
 * I metodi implementati sono relativi agli ambiti macchina a stati, utility e mqtt.
 */
class Temperatures {
    
    // private var
    #subscribe

    // public var
    identita = ''
    stato = ''
    mqttClient
    vm
    monitorTempStatus = false
    frameTempStatus = false
    frameTempStatusCount = 1
    monitorTempStatusCount = 1

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
        // TODO:
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
            console.log('@@@@@@ OpticalBarrier > displayClass: '+this.constructor.name)
        }
    }
    /**
     * Metodo di utilità: mostra l'identità nel console.log
     */
    displayIdentity() {
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ OpticalBarrier > displayIdentity: '+this.identita)
        }
    }
    /**
     * Metodo di utilità: mostra lo stato nel console.log
     */
    displayStatus() {
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ OpticalBarrier > displayStatus: '+this.stato)
        }
    }

    // ****************************************************************
    // init
    // ****************************************************************

    initPeripheral() {
        this.getIdentity()
        this.getStatus()
        this.setFans()
        //FIXME:
        //this.subscribe()
    }

    getIdentity() {
        this.mqttClient.receiveMessage('Temperatures/telemetry/identity', this.getClassName())
        this.mqttClient.mqttClient.on('message', (topic, message) => {
            if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
                // console.log('@@@@@@ Temperatures > initIdentity > received Message:', topic, message.toString())
            }
            if(topic === 'Temperatures/telemetry/identity') {
                this.identita = message
                this.displayIdentity()
            }
        })
    }

    getStatus() {
        this.mqttClient.receiveMessage(this.status().topic, this.getClassName())
    }

    // ****************************************************************
    // BL
    // ****************************************************************

    /**
     * Logica relativa a monitoraggio temperature e attivazione ventole
     */
    setFans() {
        this.mqttClient.registerHandler(this.status().topic, message => {

            let parsedMessage = JSON.parse(message)
            console.log('parsedMessage 1',parsedMessage)

            // TODO:
            // - scrittura su json stati >
            // - scrittura su log        > OK
            // - implementare controller > OK

            tempController.setFans(parsedMessage,this.mqttClient, this)

        });
    }

    // ****************************************************************
    // telemetry
    // ****************************************************************

    /**
     * Metodo MQTT: ritorna telemetry identity
     * @returns {object} {topic: "Temperatures/telemetry/identity"} 
     */
    identity() {
        const topic = 'Temperatures/telemetry/identity'  
        var message = {
            topic : topic,
        }
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ Temperatures > identity > message ', message)
        }
        return message
    }

    /**
     * Metodo MQTT: ritorna telemetry status
     * @returns {object} {topic: "Temperatures/telemetry/status"} 
     */
    status() {
        const topic = 'Temperatures/telemetry/status'  
        var message = {
            topic : topic
        }
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ Temperatures > status > message ', message)
        }
        return message
    }

    // ****************************************************************
    // command
    // ****************************************************************

    /**
     * Metodo MQTT: comando di abilitazione relativo alle ventole
     * Accetta l'oggetto "body" come parametro.
     * @param {*} body 
     * @returns {object} {topic: "Temperatures/command/fans", payload: "..."} 
     */
    fans(body) {
        let command = {
            "frameTemp": Number(body.frameFan),         // temperatura interna alla macchina in gradi C.
            "monitorTemp":  Number(body.monitorTemp),   // temperatura sul monitor in gradi C.
            "frameFan": Number(body.frameFan),          // percentuale di velocita’ (0..100) 
            "monitorFan1": Number(body.monitorFan1),    // percentuale di velocita’ (0..100)
            "monitorFan2": Number(body.monitorFan2),    // percentuale di velocita’ (0..100) 
            "ts": Number(body.ts)
        }
        var message = {
            topic : 'Temperatures/command/fans',  
            payload : command
        }
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ Temperatures > fans > command ', command)
            console.log('@@@@@@ Temperatures > fans > message ', message)
        }
        return message
    }
   
}

module.exports = Temperatures