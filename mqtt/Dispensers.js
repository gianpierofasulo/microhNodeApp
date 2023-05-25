// JSDoc

require('dotenv').config()
const Utils = require('../classes/Utils.class')
const mqttClient = require('./MqttHandler.js')
const Transaction = require('../classes/Transaction.class')

/**
 * @class Dispensers:
 * 
 * La seguente classe si occupa di gestire i metodi della periferica Dispensers.
 * I metodi implementati sono relativi agli ambiti macchina a stati, utility e mqtt.
 */
class Dispensers {
    
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
            console.log(this.constructor.name+' > displayClass: '+this.constructor.name)
        }
    }
    /**
     * Metodo di utilità: mostra l'identità nel console.log
     */
    displayIdentity() {
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log(this.constructor.name+' > displayIdentity: '+this.identita)
        }
    }
    /**
     * Metodo di utilità: mostra lo stato nel console.log
     */
    displayStatus() {
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log(this.constructor.name+' > displayStatus: '+this.stato)
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
                // console.log(this.constructor.name+' initIdentity > received Message:', topic, message.toString())
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
     * @returns {object} {topic: "Dispensers/telemetry/identity"} 
     */
    identity() {
        const topic = 'Dispensers/telemetry/identity'  
        var message = {
            topic : topic,
        }
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ Dispensers > identity > message ', message)
        }
        return message
    }


    /**
     * Metodo MQTT: ritorna telemetry status
     * @returns {object} {topic: "Dispensers/telemetry/status"} 
     */
    status() {
        const topic = 'Dispensers/telemetry/status'  
        var message = {
            topic : topic
        }
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ Dispensers > status > message ', message)
        }
        return message
    }

    /**
     * Metodo MQTT: ritorna telemetry identity
     * @returns {object} {topic: "Dispensers/telemetry/identity"} 
     */
    dispenseCompleted() {
        const topic = 'Dispensers/telemetry/dispenseComplete'  
        var message = {
            topic : topic
        }
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ Dispensers > status > message ', message)
        }
        return message
    }

    /**
     * Metodo MQTT: ritorna telemetry dispenseFailed
     * @returns {object} {topic: "Dispensers/telemetry/dispenseFailed"} 
     */
    dispenseFailed() {
        const topic = 'Dispensers/telemetry/dispenseFailed'  
        var message = {
            topic : topic
        }
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ Dispensers > status > message ', message)
        }
        return message
    }

    // ****************************************************************
    // telemetry
    // ****************************************************************

    /**
     * Metodo MQTT: comando di erogazione su motori / canali.
     * Accetta l'oggetto "body" come parametro.
     * @param {*} body 
     * @returns {object} {topic: "Dispensers/command/dispense", payload: "..."} 
     */
    dispense(body) {

        console.log('\n[ ------------------------------------------------------ ]');
        console.log(`[ @${this.constructor.name} > dispense: `,body);
        console.log('[ ------------------------------------------------------ ]\n');

        let command;
        if(body.related != null){
            const ChannelController = require('../controllers/channels.controller');
            const channel = ChannelController.getChannelByAlias(body.related);
            console.log('channel realted',channel);
            command  = {
                group:channel.group, 
                product1: Number(channel.canale), 
                product2: Number(channel.canale) + (Number(channel.larghezza) - 1),
                ts: Utils.getTimestampInSeconds()
            } 
        }
        else {
            command  = {
                group:body.group, 
                product1: Number(body.canale), 
                product2: Number(body.canale) + (Number(body.larghezza) - 1),
                ts: Utils.getTimestampInSeconds()
            } 
        }
        var message = {
            topic : 'Dispensers/command/dispense',  
            payload : command 
        }
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ Dispensers > dispense > command ', command)
            console.log('@@@@@@ Dispensers > dispense > message ', message)
        }

        return message
    }

    /**
     * Metodo MQTT: comando di configurazione motori / canali.
     * Accetta l'oggetto "body" come parametro.
     * @param {*} body 
     * @returns {object} {topic: "Dispensers/command/configure", payload: "..."} 
     */
    static configure(body) {

        console.log('\n[ ------------------------------------------------------ ]');
        console.log(`[ @${this.constructor.name} > configure: `,body);
        console.log('[ ------------------------------------------------------ ]\n');

        let command = {
            channelsList: body,
            ts: Utils.getTimestampInSeconds()
        }
        var message = {
            topic : 'Dispensers/command/configure',  
            payload : command 
        }
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ Dispensers > configure > command ', command)
            console.log('@@@@@@ Dispensers > configure > message ', message)
        }

        // ATTENZIONE:
        // siccome il metodo è statico e viene chiamato in channel.controller.js 
        // alla riga 251 da dispenser.configure(channels); allora
        // questa chiamata di funzione deve rimanere tale siccome in channel.controller.js 
        // non abbiamo l'oggetto mqttClient che dovrebbe essere passato nell'inizializzazione
        // di const dispenser = require('../mqtt/Dispensers');
        mqttClient.sendMessage(message.topic, JSON.stringify(message.payload));

        return message
    }
   
}

module.exports = Dispensers