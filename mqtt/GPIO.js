// JSDoc

require('dotenv').config()

/**
 * @class GPIO:
 * 
 * La seguente classe si occupa di gestire i metodi della periferica GPIO.
 * I metodi implementati sono relativi agli ambiti macchina a stati, utility e mqtt.
 * 
 */
class GPIO {
    
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
            console.log('@@@@@@ GPIO > displayClass: '+this.constructor.name)
        }
    }
    /**
     * Metodo di utilità: mostra l'identità nel console.log
     */
    displayIdentity() {
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ GPIO > displayIdentity: '+this.identita)
        }
    }
    /**
     * Metodo di utilità: mostra lo stato nel console.log
     */
    displayStatus() {
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ GPIO > displayStatus: '+this.stato)
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
                // console.log('@@@@@@ GPIO > initIdentity > received Message:', topic, message.toString())
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
     * @returns {object} {topic: "GPIO/telemetry/identity"} 
     */
    identity() {
        const topic = 'GPIO/telemetry/identity'
        var message = {
            topic : topic,
        }
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ GPIO > identity > message ', message)
        }
        return message
    }

    /**
     * Metodo MQTT: ritorna telemetry identity
     * @returns {object} {topic: "GPIO/telemetry/identity"} 
     */
    status() {
        const topic = 'GPIO/telemetry/status'
        var message = {
            topic : topic
        }
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ GPIO > status > message ', message)
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
     * @returns {object} {topic: "GPIO/command/mainLight", payload: "..."} 
     */
    mainLight(body) {
        let command = {
            mode: body.mode,    // "on", "off", "blink"
            ts: Number(body.ts) // int
        }
        var message = {
            topic : 'GPIO/command/mainLight',  
            payload : command 
        }
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ GPIO > mainLight > command ', command)
            console.log('@@@@@@ GPIO > mainLight > message ', message)
        }
        return message
    }

    /**
     * Metodo MQTT: comando di apertura del portello prodotto.
     * Accetta l'oggetto "body" come parametro.
     * @param {object} body 
     * @returns {object} {topic: "GPIO/command/productLight", payload: "..."} 
     */
    productLight(body) {
        let command = {
            mode: body.mode,    // "on", "off", "blink"
            ts: Number(body.ts) // int
        }
        var message = {
            topic : 'GPIO/command/productLight',  
            payload : command
        }
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ GPIO > productLight > command ', command)
            console.log('@@@@@@ GPIO > productLight > message ', message)
        }
        return message
    }

    /**
     * Metodo MQTT: comando di apertura del portello prodotto.
     * Accetta l'oggetto "body" come parametro.
     * @param {object} body 
     * @returns {object} {topic: "GPIO/command/uvLight", payload: "..."} 
     */
    uvLight(body) {
        let command = { 
            mode: body.intensity, // percentuale di intensita’ (0..100)
            ts: Number(body.ts)   // int
        }
        var message = {
            topic : 'GPIO/command/uvLight',  
            payload : command
        }
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ GPIO > uvLight > command ', command)
            console.log('@@@@@@ GPIO > uvLight > message ', message)
        }
        return message
    }

    /**
     * Metodo MQTT: comando di apertura del portello prodotto.
     * Accetta l'oggetto "body" come parametro.
     * @param {object} body 
     * @returns {object} {topic: "GPIO/command/rgbLight", payload: "..."} 
     */
    rgbLight(body) {
        let command = {mode: body.mode, color:[ { "red": Number(body.red), "green": Number(body.green), "blue": Number(body.blue) } ], ts: Number(body.ts) }
        var message = {
            topic : 'GPIO/command/rgbLight',  
            payload : command
        }
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ GPIO > rgbLight > command ', command)
            console.log('@@@@@@ GPIO > rgbLight > message ', message)
        }
        return message
    }

    /**
     * Metodo MQTT: comando di apertura del portello prodotto.
     * Accetta l'oggetto "body" come parametro.
     * @param {object} body 
     * @returns {object} {topic: "GPIO/command/refrigerator", payload: "..."} 
     */
    refrigerator(body) {
        let command = {mode: body.mode, ts: Number(body.ts)}
        var message = {
            topic : 'GPIO/command/refrigerator',  
            payload : command
        }
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ GPIO > refrigerator > command ', command)
            console.log('@@@@@@ GPIO > refrigerator > message ', message)
        }
        return message
    }
   
}

module.exports = GPIO