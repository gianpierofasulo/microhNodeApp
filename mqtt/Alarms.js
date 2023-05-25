// JSDoc

require('dotenv').config()
const Utils = require('../classes/Utils.class')
const Logger = require('../classes/Logger.class');

/**
 * @class Alarm:
 * 
 * La seguente classe si occupa di gestire i metodi della periferica Alarm.
 * I metodi implementati sono relativi agli ambiti utility, init e mqtt.
 */
class Alarms {
    
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
            console.log('@@@@@@ Alarms > displayClass: '+this.constructor.name)
        }
    }
    /**
     * Metodo di utilità: mostra l'identità nel console.log
     */
    displayIdentity() {
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ Alarms > displayIdentity: '+this.identita)
        }
    }
    /**
     * Metodo di utilità: mostra lo stato nel console.log
     */
    displayStatus() {
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ Alarms > displayStatus: '+this.stato)
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
        this.setAlarms()
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
                // console.log('@@@@@@ Alarms > initIdentity > received Message:', topic, message.toString())
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
     * Logica relativa a monitoraggio allarmi
     */
    setAlarms() {
        let allarme = 0;

        let tamperAlarmed = false;
        let sirenAlarmed = false;
        let tilt1Alarmed = false;
        let tilt2Alarmed = false;
        let gasAlarmed = false;

        this.mqttClient.registerHandler(this.status().topic, message => {
            let parsedMessage = JSON.parse(message)

            console.log('%cMQTT > parsedMessage:', 'color: red', parsedMessage)

            // TODO:
            // - scrittura su json stati
            // - scrittura su log

            if(parsedMessage.keyStatus === 'enabled') { // enabled or disabled
                
                // ************************
                // --> TAMPER
                // ************************
                if(parsedMessage.tamperStatus === 'alarmed') {
                    console.log('MQTT > tamperStatus 1 message:', parsedMessage.tamperStatus)

                    // tamperAlarmed = true
                    //Log
                    if(!tamperAlarmed) {
                        const log = {
                            id: Utils.getTimestamp(),
                            state: parsedMessage.tamperStatus,
                            icon: 'bi-bell-fill text-danger',
                            description: 'Allarmi: macchina manomessa!'
                        }
                        Logger.log('mqtt-alarms-tamper',log)
                        tamperAlarmed = true
                    }
                    
                    // ************************
                    // --> SIREN
                    // ************************
                    if(parsedMessage.siren === 'normal') {
                            console.log('MQTT > siren OFF message:', parsedMessage.siren)

                            let body = { "ts": Math.round(Date.now()/1000) }
                            this.mqttClient.sendMessage(this.sirenOn(body).topic, JSON.stringify(this.sirenOn(body).payload));


                    }
                    else if(parsedMessage.siren === 'alarmed') {
                            console.log('MQTT > siren ON message:', parsedMessage.siren)
                            if(!sirenAlarmed) {
                                //Log
                                const log = {
                                    id: Utils.getTimestamp(),
                                    state: parsedMessage.siren,
                                    icon: 'bi-volume-up-fill text-danger',
                                    description: 'Allarmi: sirena accesa!'
                                }
                                Logger.log('mqtt-alarms-siren',log)
                                sirenAlarmed = true
                            }
                    }
                    
                }
                else if(parsedMessage.tamperStatus === 'normal') {
                    console.log('MQTT > tamperStatus message:', parsedMessage.tamperStatus)

                    if(tamperAlarmed) {
                        //Log
                        const log = {
                            id: Utils.getTimestamp(),
                            state: parsedMessage.tamperStatus,
                            icon: 'bi-bell-fill text-success',
                            description: 'Allarmi: macchina ripristinata'
                        }
                        Logger.log('mqtt-alarms-tamper',log);
                        tamperAlarmed = false
                    }

                    // ************************
                    // --> SIREN
                    // ************************
                    if(parsedMessage.siren === 'normal') {
                        if(sirenAlarmed) {
                            //Log
                            const log = {
                                id: Utils.getTimestamp(),
                                state: parsedMessage.siren,
                                icon: 'bi-volume-up-fill text-success',
                                description: 'Allarmi: sirena spenta'
                            }
                            Logger.log('mqtt-alarms-siren',log)
                            sirenAlarmed = false
                        }
                    }
                    else if(parsedMessage.siren === 'alarmed') {
                            let body = { "ts": Math.round(Date.now()/1000) }
                            this.mqttClient.sendMessage(this.sirenOff(body).topic, JSON.stringify(this.sirenOff(body).payload));
                    }
                }

                // ************************
                // --> TILT1
                // ************************
                if(parsedMessage.tilt1Status == 'alarmed') {
                    console.log('MQTT > tilt1Status message:', parsedMessage.tilt1Status)
                    
                    
                    //Log
                    if(!tilt1Alarmed) {
                        const log = {
                            id: Utils.getTimestamp(),
                            state: parsedMessage.tilt1Status,
                            icon: 'bi-building-exclamation text-danger',
                            description: 'Allarmi: tilt 1 in corso!'
                        }
                        Logger.log('mqtt-alarms-tilt-1',log);
                        tilt1Alarmed = true
                    }
                }
                else if(parsedMessage.tilt1Status == 'normal') {
                    console.log('MQTT > tilt1Status message:', parsedMessage.tilt1Status)

                    if(tilt1Alarmed) {
                        const log = {
                            id: Utils.getTimestamp(),
                            state: parsedMessage.tilt1Status,
                            icon: 'bi-building-exclamation text-success',
                            description: 'Allarmi: tilt 1 disattivato'
                        }
                        Logger.log('mqtt-alarms-tilt-1',log);
                        tilt1Alarmed = false
                    }
                    
                }

                // ************************
                // --> TILT2
                // ************************
                if(parsedMessage.tilt2Status == 'alarmed') {
                    console.log('MQTT > tilt2Status message:', parsedMessage.tilt2Status)
                    
                    //Log
                    if(!tilt2Alarmed) {
                        const log = {
                            id: Utils.getTimestamp(),
                            state: parsedMessage.tilt2Status,
                            icon: 'bi-building-exclamation text-danger',
                            description: 'Allarmi: tilt 2 in corso!'
                        }
                        Logger.log('mqtt-alarms-tilt-2',log);
                        tilt2Alarmed = false
                    }
                }
                else if(parsedMessage.tilt2Status == 'normal') {
                    console.log('MQTT > tilt2Status message:', parsedMessage.tilt2Status)

                    //Log
                    if(tilt2Alarmed) {
                        const log = {
                            id: Utils.getTimestamp(),
                            state: parsedMessage.tilt2Status,
                            icon: 'bi-building-exclamation text-success',
                            description: 'Allarmi: tilt 2 disattivato'
                        }
                        Logger.log('mqtt-alarms-tilt-2',log);
                        tilt2Alarmed = false
                    }
                }

                // ************************
                // --> GAS
                // ************************
                if(parsedMessage.gasSensor == 'alarmed') {
                    console.log('MQTT > gasSensor message:', parsedMessage.gasSensor)

                    //Log
                    if(!gasAlarmed) {
                        const log = {
                            id: Utils.getTimestamp(),
                            state: parsedMessage.gasSensor,
                            icon: 'bi-wind text-danger',
                            description: 'Allarmi: gas in cors!'
                        }
                        Logger.log('mqtt-alarms-gas',log);
                        gasAlarmed = true
                    }
                    
                }
                else if(parsedMessage.gasSensor == 'normal') {
                    console.log('MQTT > gasSensor message:', parsedMessage.gasSensor)

                    //Log
                    if(gasAlarmed) {
                        const log = {
                            id: Utils.getTimestamp(),
                            state: parsedMessage.gasSensor,
                            icon: 'bi-wind text-success',
                            description: 'Allarmi: gas disattivato'
                        }
                        Logger.log('mqtt-alarms-gas',log);
                        gasAlarmed = false
                    }
                    
                }
            }
            
        });
    }

    // ****************************************************************
    // telemetry
    // ****************************************************************

    /**
     * Metodo MQTT: ritorna telemetry identity
     * @returns {object} {topic: "Alarms/telemetry/identity"} 
     */
    identity() {
        const topic = 'Alarms/telemetry/identity'  
        var message = {
            topic : topic,
        }
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ Alarms > identity > message ', message)
        }
        return message
    }

    /**
     * Metodo MQTT: ritorna telemetry status
     * @returns {object} {topic: "Alarms/telemetry/status"} 
     */
    status() {
        const topic = 'Alarms/telemetry/status'  
        var message = {
            topic : topic
        }
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ Alarms > status > message ', message)
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
     * @returns {object} {topic: "Alarms/command/sirenOn", payload: "..."} 
     */
    sirenOn(body) {
        let command = {
            ts: Number(body.ts) // int
        }
        var message = {
            topic : 'Alarms/command/sirenOn',  
            payload : command 
        }
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ Alarms > sirenOn > command ', command)
            console.log('@@@@@@ Alarms > sirenOn > message ', message)
        }
        return message
    }

    /**
     * Metodo MQTT: comando di spegnimento della sirena.
     * Accetta l'oggetto "body" come parametro.
     * @param {*} body 
     * @returns {object} {topic: "Alarms/command/sirenOff", payload: "..."} 
     */
    sirenOff(body) {
        let command = {
            ts: Number(body.ts) // int
        }
        var message = {
            topic : 'Alarms/command/sirenOff',  
            payload : command
        }
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ Alarms > sirenOff > command ', command)
            console.log('@@@@@@ Alarms > sirenOff > message ', message)
        }
        return message
    }
   
}

module.exports = Alarms