// JSDoc

require('dotenv').config()

/**
 * @class AgeValidator:
 * 
 * La seguente classe si occupa di gestire i metodi della periferica AgeValidator.
 * I metodi implementati sono relativi agli ambiti macchina a stati, utility e mqtt.
 * 
 */
class AgeValidator {

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
    // FSM
    // ****************************************************************
    
    /**
     * Metodo della macchina a stati FSM: serve a determinare un comportamento
     * o a chiamare un metodo in base allo stato in cui si trova la macchina a stati
     */
    subscribe() {
        this.vm.toggleService.subscribe((state) => {

            console.log('\n[ ------------------------------------------------ ]');
            console.log('[ FSM STATE AgeValidator > '+state.value+' ]');
            console.log('[ DEVICE STATO AgeValidator > '+this.stato+' ]');

            if(state.matches('powerup')) {
                console.log('[ AgeValidator POWERUP! ]');
                // TODO: se la FSM è in fase di powerup ...
                if(this.mqttClient.isConnected()){
                    // ...
                }
            }
            else if(state.matches('idle')) {
                console.log('[ AgeValidator is now ON / stato: '+this.stato+' ]');

                if(this.stato == 'ready') {
                    // ...
                }
            } else if (state.value === 'insertCoin') {
                console.log('[ AgeValidator is now ON ]');
            } else if (state.value === 'dispensing') {
                console.log('[ AgeValidator is now OFF ]');
            } else if (state.value === 'returnCoin') {
                console.log('[ AgeValidator is now OFF ]');
            }
            console.log('[ ------------------------------------------------ ]\n');
        });
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
            console.log('@@@@@@ AgeValidator > displayClass: '+this.constructor.name)
        }
    }
    /**
     * Metodo di utilità: mostra l'identità nel console.log
     */
    displayIdentity() {
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ AgeValidator > displayIdentity: '+this.identita)
        }
    }
    /**
     * Metodo di utilità: mostra lo stato nel console.log
     */
    displayStatus() {
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('@@@@@@ AgeValidator > displayStatus: '+this.stato)
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
     * Logica relativa a subscribe identity periferica
     * e salvataggio identity in variabile
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
     * Logica relativa a subscribe status periferica
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
     * @returns {object} {topic: "AgeValidator/telemetry/identity"} 
     */
    identity() {
        const topic = 'AgeValidator/telemetry/identity' // TODO: vedi documentazione > DDxTouch_MQTT_1.0.18.pdf
        var message = {
            topic : topic
        }
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('> AgeValidator > identity > message ', message)
        }
        return message
    }

    /**
     * Metodo MQTT: ritorna telemetry status
     * @returns {object} {topic: "AgeValidator/telemetry/status"} 
     */
    status() {
        const topic = 'AgeValidator/telemetry/status' // TODO: vedi documentazione > DDxTouch_MQTT_1.0.18.pdf
        var message = {
            topic : topic
        }
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('> AgeValidator > status > message ', message)
        }
        return message
    }

    // ****************************************************************
    // command
    // ****************************************************************

    /**
     * Metodo MQTT: comando di fine sesssione.
     * Accetta l'oggetto "body" come parametro.
     * @param {*} body 
     * @returns {object} {topic: "AgeValidator/command/endSession", payload: "..."} 
     */
    endSession(body) {
        let command = {
            ts: Number(body.ts) // int
        }
        var message = {
            topic : 'AgeValidator/command/endSession', // TODO: vedi documentazione > DDxTouch_MQTT_1.0.18.pdf
            payload : command 
        }
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('> AgeValidator > endSession > command ', command)
            console.log('> AgeValidator > endSession > message ', message)
        }
        return message
    }
   
}

module.exports = AgeValidator