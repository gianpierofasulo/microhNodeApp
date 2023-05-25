// JSDoc

/**
 * Comando generale per la generazione della documentazione:
 * ./node_modules/.bin/jsdoc -c ./documentation/config.json
 * 
 */

/**
 * Inclusione dei pacchetti esterni richiesti da parte dell'applicativo:
 * - express: framework web per applicazioni Node.js
 * - express-group-routes: middleware per Express.js che semplifica la gestione di gruppi di route
 * - path: libreria predefinita di Node.js che fornisce un set di metodi utili per la gestione dei percorsi
 * - cors: libreria per Node.js che fornisce un middleware per gestire la politica di same-origin delle richieste HTTP
 * - body-parser: libreria per Node.js che semplifica l'analisi del body delle richieste HTTP in Express.js
 * - compression: libreria per Node.js che fornisce un middleware per la compressione dei dati nelle risposte HTTP
 * 
 */
require('dotenv').config();
const express = require("express");
const group = require('express-group-routes');
const path = require("path");
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');
const networkController = require("./controllers/network.controller");

/**
 * Listener per l'evento "uncaughtException" in Node.js.
 * Quando si verifica un'eccezione non gestita in un'applicazione Node.js, l'applicazione verrà terminata. 
 * Tuttavia, impostando un listener per l'evento "uncaughtException", si può rilevare l'eccezione ed eseguire alcune azioni prima che l'applicazione termini.
 * In questo caso, la funzione listener registra semplicemente l'oggetto errore nella console. 
 * Questo può essere utile per scopi di debug, in quanto fornisce informazioni sull'errore che ha causato l'arresto anomalo dell'applicazione.
 * 
 */
process.on('uncaughtException', function (err) {
    console.log(err);
}); 

/**
 * Definizione delle variabili di ambiente dell'applicativo:
 * - app: inizializzazione di una nuova applicazione Express
 * - port: configurazione dell'app per l'ascolto su una porta specificata.
 * - environment: costante utilizzata per determinare l'ambiente di esecuzione corrente dell'app Node.js
 * - isDevelopment: costante utilizzata per determinare se l'ambiente di esecuzione corrente è un ambiente di sviluppo oppure no.
 * 
 */
const app = express();
const port = process.env.PORT || 3000;
const environment = process.env.NODE_ENV || 'development';
const isDevelopment = environment === 'development';

/**
 * Configurazioni applicativo:
 * - app.set("views", ...) imposta la directory dei file di visualizzazione della nostra applicazione;
 * - app.engine("pug", ...) registra il motore di template "pug" nell'applicazione Express, utilizzando il modulo pug di Node.js come implementazione del motore;
 * - app.set("view engine", "pug") imposta il motore di template "pug" come motore di visualizzazione predefinito;
 * - app.use(express.static(path.join(__dirname, "/public"))) imposta l'uso di una directory statica nell'applicazione Express, in particolare la directory "public" viene resa accessibile come directory statica;
 * - app.use(cors()) abilita il middleware CORS (Cross-Origin Resource Sharing) nell'applicazione Express, in particolare la funzione cors() restituisce un middleware che abilita la condivisione di risorse tra origini diverse;
 * - app.use((req, res, next) => { ... }) la variabile base_path viene impostata con il valore di process.env.APP_DOMAIN, che corrisponde al dominio dell'applicazione, infine la funzione middleware richiama la funzione callback next() per passare il controllo al middleware successivo;
 * - app.use(bodyParser.json()) abilita il middleware body-parser nell'applicazione Express e in particolare utilizza la funzione bodyParser.json() per analizzare il corpo delle richieste HTTP in formato JSON;
 * - app.use(bodyParser.urlencoded({ extended: true })) abilita il middleware body-parser nell'applicazione Express e utilizza la funzione bodyParser.urlencoded() per analizzare il corpo delle richieste HTTP in formato URL-encoded;
 *   dopo l'analisi del corpo della richiesta, il middleware body-parser inserisce i dati analizzati nell'oggetto req.body. In questo modo, l'applicazione Express può accedere ai dati della richiesta utilizzando la proprietà req.body;
 * 
 */
app.set("views", path.join(__dirname, "views"));
app.engine("pug", require("pug").__express);
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "/public")));
app.use(cors());
app.use((req, res, next) => {
    res.locals.base_path = process.env.APP_DOMAIN;
    next()
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

/**
 * Configurazioni di ambiente:
 * se l'ambiente è produzione allora viene utilizzato "compression";
 * vengono settate le variabili globali global.AMBIENTE e global.IS_DEVELOPMENT;
 * global.AMBIENTE viene utilizzata nel routing in index.js;
 * global.IS_DEVELOPMENT viene utilizzata nel routing in index.js;
 * 
 */
if (environment === 'production') {
    app.use(compression())
}
global.AMBIENTE = environment;
global.IS_DEVELOPMENT = isDevelopment;

if(process.env.DEBUG == 1) {
    console.log('\n[ ------------------------------------------------------ ]');
    console.log('[ @app.js > ambiente: '+environment);
    console.log('[ ------------------------------------------------------ ]\n');
    console.log('\n[ ------------------------------------------------------ ]');
    console.log('[ @app.js > ambiente globale: '+global.AMBIENTE);
    console.log('[ ------------------------------------------------------ ]\n');
    console.log('\n[ ------------------------------------------------------ ]');
    console.log('[ @app.js > ambiente di sviluppo: '+isDevelopment);
    console.log('[ ------------------------------------------------------ ]\n');
    console.log('\n[ ------------------------------------------------------ ]');
    console.log('[ @app.js > ambiente di sviluppo globale: '+global.IS_DEVELOPMENT);
    console.log('[ ------------------------------------------------------ ]\n');
}

/**
 * Configurazione network:
 * viene richiamata la funzione networkController.loadNetwork();
 * viene utilizzata per salvare in public/data/network.json i parametri DHCP;
 */
networkController.loadNetwork()

/**
 * Routing dell'applicazione:
 * - apiRoutes corrisponde al routing dei servizi;
 * - manager corrisponde al routing del manager;
 */
const apiRoutes = require("./routes/api/index")
const manager = require("./routes/manager/index")
const fs = require("fs");                                   // FIXME: cancellare?
const {verifyConfig} = require("browser-sync/dist/utils");  // FIXME: cancellare?
app.use(apiRoutes);
app.use('/', manager);

/*
app.group("/", (router) => {
    router.use(frontend);
});
app.group((router) => {
    router.use(frontend);
});
*/

/**
 * Inizializzazione Socket Server:
 * - const http = require('http') importazione del modulo http che fornisce funzionalità per creare un server HTTP e inviare richieste HTTP;
 * - const server = http.createServer(app) il metodo "createServer" del modulo "http" viene utilizzato per creare il server, accetta una funzione di callback che verrà eseguita ogni volta che viene ricevuta una richiesta HTTP sul server;
 * - const io = require("socket.io")(server, { ... }) utilizzata per creare un'istanza di Socket.IO utilizzando il server HTTP creato in precedenza;
 *   "pingInterval": specifica l'intervallo di tempo in millisecondi tra i messaggi di ping inviati dal server al client per verificare la connessione;
 *   "pingTimeout": specifica il tempo in millisecondi dopo il quale la connessione viene considerata persa se il client non ha risposto ai messaggi di ping inviati dal server;
 *   "forceNew": se impostato su true, indica che l'istanza di Socket.IO deve creare una nuova connessione al server invece di riconnettersi a una connessione esistente;
 *   "cors": specifica le impostazioni di configurazione per Cross-Origin Resource Sharing (CORS), che consente a un server di fornire risorse a un dominio diverso da quello in cui è ospitato il server;
 *   la variabile "io" viene assegnata al valore restituito dalla funzione "require", quindi "io" viene utilizzata per gestire le connessioni dei socket e inviare e ricevere dati in tempo reale tra il server e i client;
 * 
 */
const http = require('http');
const server = http.createServer(app);
const io = require("socket.io")(server, {
    pingInterval: 60000,
    pingTimeout: 10000,
    forceNew: true, // FIXME: cancellare?
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
});

/**
 * Importazione della classe mqttHandler:
 * l'oggetto mqttHandler si occupa di gestire connessione, publish e subscribe a mqtt;
 * 
 */
const mqttHandler = require('./mqtt/MqttHandler');
mqttHandler.connect();

/**
 * Importazione del modulo socketConsumer:
 * il modulo socketConsumer si occupa di stare in ascolta degli emit sulla socket provenienti dal frontend;
 * in base all'emit letto sulla socket viene gestita anche la logica relativa alle operazioni da eseguire;
 * 
 */
const socketConsumer = require('./mqtt/socketConsumer');
socketConsumer.start(io,mqttHandler);

/**
 * Importazione del modulo periferiche:
 * inizializza i moduli delle periferiche standard come Alarms, Temperatures, ecc;
 * inizializza i moduli delle periferiche presenti in ddxtouch.conf ed impostate su enabled = true;
 * TODO: se tutte le periferiche non sono abilitate => ERRORE!
 * 
 */
const periferiche = require('./mqtt/periferiche');
periferiche.init(io,mqttHandler);

/**
 * Attivazione del server:
 * il metodo listen dell'oggetto server per mettere in ascolto il server su una determinata porta;
 * il metodo listen viene chiamato sull'oggetto server e prende due argomenti:
 * port: un numero che rappresenta la porta su cui il server deve mettersi in ascolto per le richieste dei client;
 * () => {...}: una funzione di callback opzionale che viene eseguita quando il server viene avviato correttamente;
 * 
 */
server.listen(port, () => {
    console.log('\n[ ------------------------------------------------------ ]');
    console.log('[ @app.js > listening to requests on http://localhost:'+port);
    console.log('[ ------------------------------------------------------ ]\n');
});
