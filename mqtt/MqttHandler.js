// JSDoc

require('dotenv').config()
const mqtt = require('mqtt');                                           // mqtt pacchetto
const host = process.env.MQTT_SERVER                                    // mqtt host
const portWs = process.env.MQTT_PORT_WS                                 // mqtt porta socket
const portTcp = process.env.MQTT_PORT_TCP                               // mqtt porta tcp
const clientId = `microhard_${Math.random().toString(16).slice(3)}`     // mqtt client id
const connectUrlWs = `ws://${host}:${portWs}`                           // mqtt connessione tramite socket
const connectUrlMqtt = `mqtt://${host}:${portTcp}`                      // mqtt connessione tramite tcp
const username = ''                                                     // mqtt host username
const password = ''                                                     // mqtt host password

// ****************************************************************
// docs: https://medium.com/@cri.bh6/in-this-simple-example-im-going-to-show-how-to-write-a-very-simple-expressjs-api-that-uses-mqtt-to-57aa3ecdcd9e
// ****************************************************************

/**
 * @class MqttHandler:
 * 
 * La seguente classe è un singleton che si occupa di gestire i metodi sottoelencati:
 * - connect() viene utilizzato per creare una connessione verso l'mqtt host;
 * - receiveMessage(topic) viene utilizzato per iscriversi a `topic` e nel caso stampare qualsiasi messaggio ricevuto;
 * - sendMessage(topic, message, qos=null, retain=null) viene utilizzato per pubblicare un messaggio nell'argomento `topic`, questo metodo verrà chiamato dalla nostra API;
 * - registerHandler(topic, callback) registra una callback per il topic inviato da mqtt;
 * - unRegisterHandler(topic) cancella la callback per il topic specificato come parametro;
 * - isConnected() ritorna lo stato della connessione a mqtt;
 * - onMessagePromise(isTopic) riceve un messaggio da mqtt tramite una subscribe sotto forma di Promise;
 * - onMessageRequest(topicRequest) ritorna il messaggio mqtt corrispondente al topic richiesto come parametro;
 * 
 */
class MqttHandler {

    topics = {};

    /**
     * Il costrutture della classe inizializza la variabile mqttClient a null.
     * Le variabili username e password possono essere definite nel caso siano richiesta da mqtt;
     * Essendo una classe singleton se viene reinizializzata il costrutturo torna l'istanza della classe;
     * La connect() può essere chiamata dal costruttore nel caso non volessimo chiamarla da app.js;
     * 
     * @constructor
     * @returns {MqttHandler}
     */
    constructor() {
        this.mqttClient = null;
        this.username = ''; 
        this.password = '';
        // this.connect();
        
        if (!MqttHandler.instance) {
            MqttHandler.instance = this;
        }
        return MqttHandler.instance;
    }

    /**
     * connect() viene utilizzato per creare una connessione e gestire le callback di mqtt: 
     * - mqtt.connect() crea una connessione verso mqtt host e porta configurata; 
     * - this.mqttClient.on('connect') è la callback per gestire l'evento di connessione al broker MQTT, la variabile connected torna true se connesso;
     * - this.mqttClient.on('error') è la callback per gestire l'evento di errore di connessione al broker MQTT, al suo interno possono essere gestite determinate procedure;
     * - this.mqttClient.on('close') è la callback per gestire l'evento di chiusura connessione al broker MQTT, al suo interno possono essere gestite determinate procedure;
     * - this.mqttClient.on('message') è la callback per gestire l'evento di ricezione messaggi dal broker MQTT tramite la quale è possibile ricevere i messaggi relativi ai topic ai quali si è sottoscritti;
     * 
     */
    connect() {
        let optionsLocal = { clientId: clientId, clean: true, connectTimeout: 5000, username: this.username, password: this.password, reconnectPeriod: 2000 }
        let optionsOnline = { clientId: clientId, clean: true }
        
        // Connect method
        // usare `optionsOnline` per la connessione ad un broker online di test come ad esempio: test.mosquitto.org;
        // usare le credenziali di accesso nel caso sia richiesto altrimenti omettere username e password;
        this.mqttClient = mqtt.connect(connectUrlWs, optionsOnline);
        this.mqttClient.setMaxListeners(50);

        // Mqtt error calback
        this.mqttClient.on('error', (err) => {
            if(process.env.DEBUG == 1 && process.env.DEBUG_MQTT == 1) {
                console.log('\n[ ------------------------------------------------------ ]');
                console.log('[ @MQTT > MqttHandler > mqttClient error: '+err+' ]');
                console.log('[ ------------------------------------------------------ ]\n');
            }
            this.mqttClient.end();
        });

        // Connection callback
        this.mqttClient.on('connect', (client) => {
            if(process.env.DEBUG == 1 && process.env.DEBUG_MQTT == 1) {
                console.log('\n[ ------------------------------------------------------ ]');
                console.log('[ @MQTT > MqttHandler > mqttClient connected: '+this.mqttClient.connected+' ]');
                console.log('[ ------------------------------------------------------ ]\n');
            }
        });

        // Close callback
        this.mqttClient.on('close', () => {
            if(process.env.DEBUG == 1 && process.env.DEBUG_MQTT == 1) {
                console.log('\n[ ------------------------------------------------------ ]');
                console.log('[ @MQTT > MqttHandler > mqttClient disconnected ]');
                console.log('[ ------------------------------------------------------ ]\n');
            }
        });

        // Message callback
        this.mqttClient.on('message', (topic, message) => {
            if(process.env.DEBUG == 1 && process.env.DEBUG_MQTT == 1) {
                console.log('\n[ ------------------------------------------------------ ]');
                //console.log('[ @MQTT MqttHandler > received Message:', topic, message.toString()+' ]');
                console.log('[ @MQTT MqttHandler > received Message:', topic+' ]');
                console.log('[ ------------------------------------------------------ ]\n');
            }
            if (this.topics[topic]) {
                this.topics[topic](message);
            }
        })
    }

    /**
     * sendMessage(topic, message, qos=null, retain=null) viene utilizzato per pubblicare un messaggio nell'argomento `topic`:
     * invia un messaggio a mqtt tramite una publish;
     * questo metodo può esssere chiamato tramite le API;
     * 
     * @param {*} topic 
     * @param {*} message 
     * TODO: qos and retain params
     * 
     */
    sendMessage(topic, message, qos=null, retain=null) {
        this.mqttClient.publish(topic, message, { qos: 2, retain: false }, (error) => {
            if (error) {
                console.error(error)
            }
        })
    }

    /**
     * receiveMessage(topic) viene utilizzato per iscriversi a `topic` e nel caso stampare qualsiasi messaggio ricevuto:
     * riceve un messaggio da mqtt tramite una subscribe;
     * questo metodo può esssere chiamato tramite le API;
     * 
     * @param {*} topic 
     */
    receiveMessage(topic, from=null) {
        this.mqttClient.subscribe([topic], () => {
            if(process.env.DEBUG == 1 && process.env.DEBUG_MQTT == 1) {
                console.log('\n[ ------------------------------------------------ ]');
                console.log(`[ @MQTT > MqttHandler > subscribed to topic: '${topic}' | from: ${from}`)
                console.log('[ ------------------------------------------------ ]\n');
            }
        })
    }

    /**
     * registerHandler(topic, callback) registra una callback per il topic inviato da mqtt.
     * @param {*} topic 
     * @param {*} callback 
     */
    registerHandler(topic, callback) {
        this.topics[topic] = callback;
    }

    /**
     * unRegisterHandler(topic) cancella la callback per il topic specificato come parametro.
     * @param {*} topic 
     */
    unRegisterHandler(topic) {
        delete this.topics[topic];
    }

    /**
     * isConnected() ritorna lo stato della connessione a mqtt.
     * @returns {boolean} this.mqttClient.connected
     */
    isConnected() {
        return this.mqttClient.connected;
    }

    /**
     * onMessagePromise(isTopic) riceve un messaggio da mqtt tramite una subscribe sotto forma di Promise.
     * @param {*} isTopic 
     */
    onMessagePromise(isTopic) {
        if(process.env.DEBUG == 1 && process.env.DEBUG_MQTT == 1) {
            console.log('\n[ ------------------------------------------------ ]');
            console.log(`[ @MQTT > MqttHandler > onMessage topic: '${isTopic}' ]`)
            console.log('[ ------------------------------------------------ ]\n');
        }

        return new Promise((resolve,) => {
            this.mqttClient.on('message', (topic, message) => {
                // console.log(`Received message on topic "${topic}": ${message.toString()}`);
                // console.log(`Received message on topic "${topic}"`);
                if(topic == isTopic) {
                    resolve(message);
                }
            });
        });
    }

    /**
     * onMessageRequest(topicRequest) ritorna il messaggio mqtt corrispondente al topic richiesto come parametro.
     * @param {*} topicRequest 
     */
    onMessageRequest(topicRequest) {
        if(process.env.DEBUG == 1 && process.env.DEBUG_MQTT == 1) {
            console.log('\n[ ------------------------------------------------ ]');
            console.log(`[ @MQTT > MqttHandler > onMessage topic: '${isTopic}' ]`)
            console.log('[ ------------------------------------------------ ]\n');
        }

        this.mqttClient.on('message', (topic, message) => {
            console.log('\n[ ------------------------------------------------ ]');
            console.log('[ ------------------------------------------------ ]');
            console.log(`Received message on topic "${topic}": ${message.toString()}`);
            console.log('[ ------------------------------------------------ ]');
            console.log('[ ------------------------------------------------ ]\n');
            // console.log(`Received message on topic "${topic}"`);
            if(topic == topicRequest) {
                return message;
            }
        });
    }
}

const mqttClient = new MqttHandler();
module.exports = mqttClient;


