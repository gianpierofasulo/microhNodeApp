// TODO: da fare

const fs = require('fs');
// const fetch = require('node-fetch');
// const money = require('./_dev/moneyHandler.js');
// const invoice = require('./_dev/scontrino.js');
// const richiesta = require('./_dev/fetchContabilita.js');
const qrcode = require('./qrcode.js');
const configController = require('../controllers/config.controller.js')
const TransactionClass = require('../classes/Transaction.class')
const ContabilitaClass = require('../classes/Contabilita.class')
const TicketClass = require('../classes/Ticket.class')
const MessageClass = require('../classes/Message.class')
const CreditClass = require('../classes/Credit.class');

// ********************************
// socketConsumer.js
// ********************************

module.exports = {

    /**
     * Start New socketConsumer
     * @param {*} io
     * @param {*} mqttClient
     */
    start: function(io,mqttClient) {

        let provenienza = 'frontend';
        let globalData;
        let transaction;
        let dialog;

        if(process.env.DEBUG == 1) {
            console.log('\n[ ------------------------------------------------------ ]');
            console.log('[ @socketConsumer.js > provenienza: '+provenienza);
            console.log('[ ------------------------------------------------------ ]\n');
        }

        const CoinAcceptor = require('./CoinAcceptor');
        const BillValidator = require('./BillValidator');
        const Dispensers = require('./Dispensers');
        const BarCodeReader = require('./BarcodeReader');
        const BulkHead = require('./Bulkhead');
        const ProductDoor = require('./ProductDoor');
        const GPIO = require('./GPIO');
        const Alarms = require('./Alarms');

        const coinClient = new CoinAcceptor(mqttClient)
        const billClient = new BillValidator(mqttClient)
        const dispensersClient = new Dispensers(mqttClient)
        const bulkheadClient = new BulkHead(mqttClient)
        const barCodeReader = new BarCodeReader(mqttClient)
        const productDoorClient = new ProductDoor(mqttClient)
        const gpio = new GPIO(mqttClient)
        const alarms = new Alarms(mqttClient)

        // ****************************************************************
        // ****************************************************************
        // socket connection
        // ****************************************************************
        // ****************************************************************

        io.on('connection', function(socket) {

            // ********************************
            // GPIO
            // ********************************

            // TODO: controllo se status == enabled => posso fare la subscribe
            // let gpioStatus = gpio.status()['topic']
            // mqttClient.receiveMessage(gpioStatus)

            // ********************************
            // barcode
            // ********************************

            socket.on('barcode', function(data) {
                if(process.env.DEBUG == 1 && process.env.DEBUG_SOCKET == 1) {
                    console.log('INIZIO barcode -----------------------------------------------------------');
                    console.log('### Socket barcode << data from client:',data);
                }

                // *********
                // enable
                // *********
                // TODO: controllo tramite periferiche.json quali periferiche sono abilitate
                let barcodeEnable = barCodeReader.enable({"ts":123})
                mqttClient.sendMessage(barcodeEnable['topic'], JSON.stringify(barcodeEnable['payload']));


                // *********
                // barcode
                // *********
                // TODO: controllo se status == enabled => posso fare la subscribe
                let barcode = barCodeReader.barcode()['topic']
                mqttClient.receiveMessage(barcode, 'socketConsumer.js')


                if(process.env.DEBUG == 1 && process.env.DEBUG_SOCKET == 1) {
                    console.log('FINE barcode -----------------------------------------------------------');
                }
            });

            // ********************************
            // external_payment
            // ********************************

            socket.on('external_payment', function(data) {
                
                if(process.env.DEBUG == 1 && process.env.DEBUG_SOCKET == 1) {
                    console.log('INIZIO external_payment -----------------------------------------------------------');
                    console.log('### Socket external_payment << data from client new:',data);
                }

                JSON.parse(data);

                console.log('cashless' + 'external_payment');

                let transaction = new TransactionClass();
                
                let credit;
                
                credit = new CreditClass(Number(data.value),'cashless');       

                transaction.setValues(Number(data.value),credit.type);

                transaction.saveTransaction();
            
                console.log("Transazione aggiornata",transaction);
               
                if(data.toString().length > 0) {

                    console.log(data,'external_payment');

                    io.emit('dispense', data)
                    console.log('### external_payment dispense >> send message on type:', data, 'cashless')
                }


                if(process.env.DEBUG == 1 && process.env.DEBUG_SOCKET == 1) {
                    console.log('FINE external_payment -----------------------------------------------------------');
                }
            });


            // ********************************
            // startCash
            // ********************************

            socket.on('startCash', function(data) {


                if(process.env.DEBUG == 1 && process.env.DEBUG_SOCKET == 1) {
                    console.log('INIZIO startCash -----------------------------------------------------------');
                    console.log('### Socket startCash << data from client:',data);
                }

                // *********
                // enable
                // *********
                // TODO: controllo tramite periferiche.json quali periferiche sono abilitate
                let barcodeEnable = barCodeReader.enable({"ts":123})
                mqttClient.sendMessage(barcodeEnable['topic'], JSON.stringify(barcodeEnable['payload']));

                // *********
                // barcode
                // *********
                // TODO: controllo se status == enabled => posso fare la subscribe
                let barcode = barCodeReader.barcode()['topic']
                mqttClient.receiveMessage(barcode, 'socketConsumer.js')


                // *********
                // enable
                // *********
                // TODO: controllo tramite periferiche.json quali periferiche sono abilitate
                let coinEnable = coinClient.enable({"ts":123})
                let billEnable = billClient.enable({"ts":123})
                mqttClient.sendMessage(coinEnable['topic'], JSON.stringify(coinEnable['payload']));
                mqttClient.sendMessage(billEnable['topic'], JSON.stringify(billEnable['payload']));

                // *********
                // cashIn
                // *********
                // TODO: controllo se status == enabled => posso fare la subscribe
                let coinCashIn = coinClient.cashIn()['topic']
                let billCashIn = billClient.cashIn()['topic']
                mqttClient.receiveMessage(coinCashIn, 'socketConsumer.js')
                mqttClient.receiveMessage(billCashIn, 'socketConsumer.js')

                if(process.env.DEBUG == 1 && process.env.DEBUG_SOCKET == 1) {
                    console.log('FINE startCash -----------------------------------------------------------');
                }
            });

            // ********************************
            // dispense
            // ********************************

            // Data Type
            // canale > Number
            // prezzo > Number
            // incasso > Number
            // resto > Number
            // resto_max > Number
            // resto_abilitato > Boolean

            socket.on('dispense', function(data) {


                if(process.env.DEBUG == 1 && process.env.DEBUG_SOCKET == 1) {
                    console.log('INIZIO dispense -----------------------------------------------------------');
                    console.log('### Socket dispense << data from client:',data);
                    console.log('### Socket dispense << data canale from client:',data.canale);
                }

                if(data){

                    transaction = new TransactionClass();
                    let incasso = transaction.totale;

                    let config = configController.getConfig('generali');

                    console.log("configurazione da dispense",config)

                    if(process.env.DEBUG == 1 && process.env.DEBUG_SOCKET == 1) {
                        console.log('######################################')
                        console.log('############# DISPENSE ###############')
                        console.log('######################################')
                        console.log(data);
                    }

                    if(incasso >= data.prezzo){

                        if(process.env.DEBUG == 1 && process.env.DEBUG_SOCKET == 1) {
                            console.log('### > sono maggiore e posso erogare: ',incasso);
                        }

                        let resto = incasso - data.prezzo;
                        globalData = {...data,resto:resto,incasso:incasso};

                        if(process.env.DEBUG == 1 && process.env.DEBUG_SOCKET == 1) {
                            console.log(config.resto_max)
                        }

                        //Invio messaggio erogazione in corso
                        dialog = new MessageClass('dialog','Erogazione in corso...',true,transaction.state)
                        let message = dialog.printMessage();                    
                        socket.emit('stream', JSON.stringify(message))

                        //TO DO --> QUANDO EROGO DAI MOTORI POI EROGARE RESTO
                        mqttClient.receiveMessage(dispensersClient.dispenseCompleted()['topic'])
                        mqttClient.receiveMessage(dispensersClient.dispenseFailed()['topic'])

                        //Apro paratia
                        mqttClient.sendMessage(bulkheadClient.open({"ts":123})['topic'], JSON.stringify(bulkheadClient.open({"ts":123})['payload']));

                        
                        mqttClient.registerHandler(bulkheadClient.status().topic, msg => { 

                            let parsedMessage = JSON.parse(msg)
                            if(parsedMessage.status == 'open'){

                                if(data.canali){
                                   if(data.canali[0]){
                                        //Dispense da vetrina --> funzione ricorsiva per dispense
                                        let dispense = dispensersClient.dispense(data.canali[0])
                                        console.log(data.canali[0])
                                        mqttClient.sendMessage(dispense['topic'], JSON.stringify(dispense['payload']));

                                    }
                                }else{
                                    //Dispense da tastierino
                                    if(process.env.DEBUG == 1 && process.env.DEBUG_SOCKET == 1) {
                                        console.log('### > posso erogare dai dispensers!')
                                    }
                                    let dispense = dispensersClient.dispense(data)
                                    mqttClient.sendMessage(dispense['topic'], JSON.stringify(dispense['payload']));

                                }

                            }

                        });

                    }

                }

                if(process.env.DEBUG == 1 && process.env.DEBUG_SOCKET == 1) {
                    console.log('FINE dispense -----------------------------------------------------------');
                }

            });

            // ********************************
            // annullaTransazione
            // ********************************

            socket.on('annullaTransazione', function(data) {


                transaction = new TransactionClass();
                let active = transaction.checkTransaction();

                let config = configController.getConfig('generali');


                if(active != false){

                    if(process.env.DEBUG == 1 && process.env.DEBUG_SOCKET == 1) {
                        console.log('INIZIO annullaTransazione -----------------------------------------------------------');
                        console.log('### Socket annullaTransazione << data from client:',data);
                    }

                    let resto = active.incasso_banconote + active.incasso_monete + active.incasso_pos + active.incasso_cashless + active.incasso_scontrino;

                    // *********
                    // resto
                    // *********
                    if(resto > 0){

                        let prezzo;
                        if(active.prezzo_prodotto != null){
                            prezzo = active.prezzo_prodotto;
                        }else{
                            prezzo = 0;
                        }

                        globalData = {
                            incasso: resto,
                            resto:resto,
                            prezzo:prezzo,
                            prodotto_id:active.prodotto,
                            canale:active.canale
                        };

                        if(config.resto_max > 0 && config.resto_abilitato == 1) {
                            console.log('######################################')
                            console.log('############ RESTO MAX ###############')
                            console.log('######################################')
                            let resto_moneta = 0;
                            if(resto <= config.resto_max){
                                resto_moneta = resto;
                            }
                            else {
                                resto_moneta = config.resto_max;

                            }

                            let coinDispense = coinClient.dispense({"amount":resto_moneta,"mode":"auto","ts":123})
                            mqttClient.sendMessage(coinDispense['topic'], JSON.stringify(coinDispense['payload']));
                            mqttClient.receiveMessage(coinClient.dispenseComplete()['topic'])

                        }
                        else {

                            let scontrino = resto

                            // TODO: stampa scontrino con resto TOTALE
                            console.log('###############################')
                            console.log('# SCONTRINO TOT '+ scontrino)
                            console.log('###############################')


                            // Transazione conclusa con solo scontrino

                            transaction.setChannel(active.canale);

                            transaction.setProduct(active.prodotto,prezzo);
                            transaction.setResto('scontrino',scontrino);
                            transaction.completeTransaction('ok');

                            let contabilita = new ContabilitaClass(transaction);

                            // ******************
                            // Nuovo Ticket
                            // ******************
                            let ticket = new TicketClass(transaction);

                            // ******************
                            // qrcode
                            // ******************
                            if(process.env.PRINTER == 1) {
                                qrcode.create(incasso,prezzo,resto,scontrino,0,ticket);

                            }

                        }
                    }
                }else{
                    mqttClient.sendMessage(coinClient.disable({"ts":123})['topic'], JSON.stringify(coinClient.disable({"ts":123})['payload']));
                    mqttClient.sendMessage(billClient.disable({"ts":123})['topic'], JSON.stringify(billClient.disable({"ts":123})['payload']));
                    return 'Nessuna transazione attiva'
                }



                console.log('FINE annullaTransazione -----------------------------------------------------------');
            });


        });

        // ****************************************************************
        // ****************************************************************
        // mqtt on message
        // ****************************************************************
        // ****************************************************************

        let barcodeBarcodeTopic = barCodeReader.barcode()['topic']
        let GPIOStatusTopic = gpio.status()['topic']
        let AlarmsStatusTopic = alarms.status()['topic']
        let coinCashInTopic = coinClient.cashIn()['topic']
        let coinStatusTopic = coinClient.status()['topic']
        let billCashInTopic = billClient.cashIn()['topic']
        let billStatusTopic = billClient.status()['topic']
        let dispenseCompleteTopic = coinClient.dispenseComplete()['topic']
        let dispensersCompletedTopic = dispensersClient.dispenseCompleted()['topic']
        let dispensersFailedTopic = dispensersClient.dispenseFailed()['topic']

        let topics = [
            barcodeBarcodeTopic,
            GPIOStatusTopic,
            AlarmsStatusTopic,
            coinCashInTopic,
            billCashInTopic,
            dispenseCompleteTopic,
            dispensersCompletedTopic,
            dispensersFailedTopic
        ]
        if(process.env.DEBUG == 1) {
            console.log('\n[ ****************************************************** ]');
            for (let topic of topics) {
                console.log('[ @socketConsumer.js > on message topic: '+topic);
                // mqttClient.mqttClient.subscribe([topic], () => {
                //     console.log(`Subscribed to topic: '${topic}'`)
                // })
            }
            console.log('[ ****************************************************** ]\n');
        }

        mqttClient.mqttClient.on('message', (topic, message) => {

                // if(globalData) {
                //     if(process.env.DEBUG == 1 && process.env.DEBUG_SOCKET == 1) {
                //         console.log('############ globalData ############',globalData)
                //     }
                // }

                // ********************************
                // alarms
                // ********************************
                if(topic == AlarmsStatusTopic) {
                    if(process.env.DEBUG == 1 && process.env.DEBUG_SOCKET == 1) {
                        // console.log('### Mqtt << received Message:', topic, message.toString()) // message is Buffer
                        // console.log('### Mqtt << received Message:', topic, JSON.parse(message))
                    }
                    if(message.toString().length > 0) {
                        let mqttAlarms = JSON.parse(message)

                        let title = ''
                        for (let key of Object.keys(mqttAlarms)){
                            if (key != 'keyStatus' && key != 'ts' && key != 'siren'){
                                if(mqttAlarms[key] == 'alarmed'){
                                    
                                    if(key == 'tamperStatus'){
                                        title += ' MANOMISSIONE';
                                        
                                    }else if(key == 'tilt1Status' || key == 'tilt2Status'){
                                        title += ' TILT';

                                    }else if(key == 'gasSensor'){
                                        title = ' FUORIUSCITA DI GAS';
                                    }

                                }else{
                                    if(key == 'tamperStatus'){
                                        title += '';
                                        
                                    }else if(key == 'tilt1Status' || key == 'tilt2Status'){
                                        title += '';
                                    }else if(key == 'gasSensor'){
                                        title = '';
                                    }
                                }
                            }
                        }

                        if(title != ''){
                            let alarm_message = new MessageClass('alert','Allarme in corso: '+ title,true,'alarm')
                            let message_status_alarm = alarm_message.printMessage();
                            io.emit('stream', JSON.stringify(message_status_alarm))
                        }else{
                            let alarm_message = new MessageClass('alert','Allarme in corso: '+ title,false,'alarm')
                            let message_status_alarm = alarm_message.printMessage();
                            io.emit('stream', JSON.stringify(message_status_alarm))
                        }

                        
                        //io.emit('stream', JSON.stringify(message_status_alarm))

                        console.log('### Socket ALARMS >> send message:', JSON.stringify(mqttAlarms))
                        console.log('### Socket ALARMS >> send message on topic:', JSON.stringify(mqttAlarms), topic)
                    }
                }

                // ********************************
                // gpio
                // ********************************
                if(topic == GPIOStatusTopic) {
                    if(process.env.DEBUG == 1 && process.env.DEBUG_SOCKET == 1) {
                        console.log('### Mqtt << received Message:', topic, message.toString()) // message is Buffer
                        console.log('### Mqtt << received Message:', topic, JSON.parse(message))
                    }
                    if(message.toString().length > 0) {
                        let mqttGPIO = JSON.parse(message)
                        let programButton = JSON.parse(mqttGPIO.programButton)
                        let obj = {
                            'programButton': mqttGPIO.programButton
                        }
                        console.log('parse', obj)
                        io.emit('gpio', JSON.stringify(mqttGPIO))

                        console.log('### Socket gpio >> send message:', JSON.stringify(programButton))
                        console.log('### Socket gpio >> send message on topic:', JSON.stringify(programButton), topic)
                    }
                }

                // ********************************
                // barcode
                // ********************************
                if(topic == barcodeBarcodeTopic) {
                    if(process.env.DEBUG == 1 && process.env.DEBUG_SOCKET == 1) {
                        console.log('### Mqtt << received Message:', topic, message.toString()) // message is Buffer
                        console.log('### Mqtt << received Message:', topic, JSON.parse(message))
                    }
                    if(message.toString().length > 0) {

                        let mqttBarcode = JSON.parse(message);
                        let barcode;
                        try{
                            barcode = JSON.parse(mqttBarcode.barcode);
                        }catch(e){
                            barcode = mqttBarcode.barcode;

                        }

                        if(typeof barcode === 'object'){
                            console.log('sono oggetto ')
                            console.log('parse', barcode.type)
                            //Barcode lettura credito da ticket valido
                            if(barcode.type && (barcode.type == 'ticket_microhard')){
                                console.log('passoooooooo')
                               if(TicketClass.checkValidityTicket(barcode) == true){
                                    let valore = {'value': barcode.credito }
                                    const cash = require('./socketConsumerFiles/cashIn')
                                    cash.cashin(io, mqttClient, valore, 'scontrino', provenienza)
                                }else{
                                    let valore = 'ticket non valido'
                                    io.emit('errorCash', JSON.stringify(valore))
                                    console.log('non valido',valore);
                                }
                            }
                        }else{
                            console.log('sono stringa ', mqttBarcode.barcode)
                            barcode = mqttBarcode.barcode;
                            io.emit('barcode', JSON.stringify(barcode))
                        }



                    }
                }

                // ********************************
                // Gettoniera
                // ********************************

                if(topic == coinCashInTopic) {

                    // ********************************
                    // cashIn
                    // ********************************
                    let parsed_message = JSON.parse(message)
                    console.log(parsed_message);
                    const cash = require('./socketConsumerFiles/cashIn')
                    cash.cashin(io, mqttClient, parsed_message, 'moneta', provenienza)

                }

                // ********************************
                // Lettore banconote
                // ********************************

                if(topic == billCashInTopic) {

                    // ********************************
                    // cashIn
                    // ********************************
                    let parsed_message = JSON.parse(message)
                    const cash = require('./socketConsumerFiles/cashIn')
                    cash.cashin(io, mqttClient, parsed_message, 'banconota', provenienza)

                }

                // ********************************
                // Dispensers Failed // Completed
                // ********************************

                if(topic == dispensersCompletedTopic || topic == dispensersFailedTopic ){

                    let config = configController.getConfig('generali');
                    let behavior = configController.getConfig('behavior');
                    
                    let parsed_message = JSON.parse(message)
                    if((topic == dispensersFailedTopic) && (provenienza == 'frontend')){
                        if(globalData.canali){
                            if(globalData.canali[0]){
                                for(let i = 0; i < globalData.canali.length; i++){
                                    if(parsed_message.product == globalData.canali[i].canale){
                                        if(globalData.canali[i+1]){
                                            setTimeout(function () {
                                                let dispense = dispensersClient.dispense(globalData.canali[i+1])
                                                mqttClient.sendMessage(dispense['topic'], JSON.stringify(dispense['payload']));
                                            },1000)

                                        }else{
                                            if(behavior.continua_vendita == 0){
                                               let scontrino = globalData.incasso
                                                // TODO: stampa scontrino con resto TOTALE
                                                console.log('###############################')
                                                console.log('# SCONTRINO TOT '+ scontrino)
                                                console.log('###############################')
                                                // Transazione conclusa con solo scontrino
                                                transaction.setChannel(parsed_message.product);
                                                transaction.setProduct(globalData.prodotto_id,globalData.prezzo);
                                                transaction.setResto('scontrino',scontrino);
                                                transaction.completeTransaction('ok');
                                                let contabilita = new ContabilitaClass(transaction);
                                                // ******************
                                                // Nuovo Ticket
                                                // ******************
                                                let ticket = new TicketClass(transaction);
                                                // ******************
                                                // qrcode
                                                // ******************
                                                if(process.env.PRINTER == 1) {
                                                    qrcode.create(globalData.incasso,globalData.prezzo,0,scontrino,0,ticket);
                                                }
                                                let dialog = new MessageClass('dialog','Prodotto non erogato ritirare il denaro!',true,transaction.state)
                                                dialog.setState(transaction.state);
                                                let stream = dialog.printMessage();                    
                                                io.emit('stream', JSON.stringify(stream))
                                            }

                                            mqttClient.sendMessage(coinClient.disable({"ts":123})['topic'], JSON.stringify(coinClient.disable({"ts":123})['payload']));
                                            mqttClient.sendMessage(billClient.disable({"ts":123})['topic'], JSON.stringify(billClient.disable({"ts":123})['payload']));
                                            //Chiudi paratia
                                            console.log('chiudi paratia')
                                            setTimeout(() => {
                                                mqttClient.sendMessage(bulkheadClient.close({"ts":123})['topic'], JSON.stringify(bulkheadClient.close({"ts":123})['payload']));
                                            },2000)
                                            return 'il prodotto non è in un canale successivo'
                                        }
                                    }
                                }
                            }
                        }else{
                            if(behavior.continua_vendita == 0){
                                //Dispense fallita erogo lo scontrino
                                if(globalData.incasso){
                                    if(globalData.incasso > 0){
                                        let scontrino = globalData.incasso
                                        // TODO: stampa scontrino con resto TOTALE
                                        console.log('###############################')
                                        console.log('# SCONTRINO TOT '+ scontrino)
                                        console.log('###############################')
                                        // Transazione conclusa con solo scontrino
                                        transaction.setChannel(parsed_message.product);
                                        transaction.setProduct(globalData.prodotto_id,globalData.prezzo);
                                        transaction.setResto('scontrino',scontrino);
                                        transaction.completeTransaction('ok');
                                        let contabilita = new ContabilitaClass(transaction);
                                        // ******************
                                        // Nuovo Ticket
                                        // ******************
                                        let ticket = new TicketClass(transaction);
                                        // ******************
                                        // qrcode
                                        // ******************
                                        if(process.env.PRINTER == 1) {
                                            qrcode.create(globalData.incasso,globalData.prezzo,0,scontrino,0,ticket);
                                        }
                                    }
                                }
                            }

                            let dialog = new MessageClass('dialog','Prodotto non erogato!',true,transaction.state)
                            dialog.setState(transaction.state);
                            let stream = dialog.printMessage();                    
                            io.emit('stream', JSON.stringify(stream))
                            //Non sono in vetrina è fallita l'erogazione da tastierino
                            //Annulla transazione???????
                            mqttClient.sendMessage(coinClient.disable({"ts":123})['topic'], JSON.stringify(coinClient.disable({"ts":123})['payload']));
                            mqttClient.sendMessage(billClient.disable({"ts":123})['topic'], JSON.stringify(billClient.disable({"ts":123})['payload']));
                            
                            //Chiudi paratia
                            console.log('chiudi paratia')
                            setTimeout(() => {
                                mqttClient.sendMessage(bulkheadClient.close({"ts":123})['topic'], JSON.stringify(bulkheadClient.close({"ts":123})['payload']));
                            },2000)
                            return 'il prodotto non è stato erogato'
                        }

                

                    }

                    if((topic == dispensersCompletedTopic) && (provenienza == 'frontend')){

                        //Invio messaggio erogazione in corso
                        dialog.setText('Prelevare il prodotto!')
                        dialog.setState(transaction.state)
                        let message = dialog.printMessage();                    
                        io.emit('stream', JSON.stringify(message))

                        if(globalData.resto){
                            if(globalData.resto > 0){


                                if(config.resto_max > 0 && config.resto_abilitato == 1) {
                                    console.log('######################################')
                                    console.log('############ RESTO MAX ###############')
                                    console.log('######################################')
                                    let resto_moneta = 0;
                                    if(globalData.resto <= config.resto_max){
                                        resto_moneta = globalData.resto;
                                    }
                                    else {
                                        resto_moneta = config.resto_max;

                                    }

                                    globalData.canale = parsed_message.product;

                                    let coinDispense = coinClient.dispense({"amount":resto_moneta,"mode":"auto","ts":123})
                                    mqttClient.sendMessage(coinDispense['topic'], JSON.stringify(coinDispense['payload']));
                                    mqttClient.receiveMessage(coinClient.dispenseComplete()['topic'])

                                    //scontrino
                                    let resto_stream = (resto_moneta/100).toFixed(2)
                                    dialog.setText('Prelevare il resto! Tot. '+resto_stream+' €')
                                    let message = dialog.printMessage();   
                                    dialog.setState(transaction.state)                 
                                    io.emit('stream', JSON.stringify(message))

                                }
                                else {

                                    let scontrino = globalData.resto

                                    // TODO: stampa scontrino con resto TOTALE
                                    console.log('###############################')
                                    console.log('# SCONTRINO TOT '+ scontrino)
                                    console.log('###############################')


                                    // Transazione conclusa con solo scontrino

                                    transaction.setChannel(parsed_message.product);
                                    transaction.setProduct(globalData.prodotto_id,globalData.prezzo);
                                    transaction.setResto('scontrino',scontrino);
                                    transaction.completeTransaction('ok');
                                    let contabilita = new ContabilitaClass(transaction);

                                    // ******************
                                    // Nuovo Ticket
                                    // ******************
                                    let ticket = new TicketClass(transaction);

                                    // ******************
                                    // qrcode
                                    // ******************
                                    if(process.env.PRINTER == 1) {
                                        qrcode.create(globalData.incasso,globalData.prezzo,globalData.resto,scontrino,0,ticket);

                                        //scontrino
                                        let resto_stream = (scontrino/100).toFixed(2)
                                        dialog.setText('Prelevare il resto! Tot. '+resto_stream+' €')
                                        dialog.setState(transaction.state)
                                        let message = dialog.printMessage();       
                                        io.emit('stream', JSON.stringify(message))


                                    }

                                    mqttClient.sendMessage(coinClient.disable({"ts":123})['topic'], JSON.stringify(coinClient.disable({"ts":123})['payload']));
                                    mqttClient.sendMessage(billClient.disable({"ts":123})['topic'], JSON.stringify(billClient.disable({"ts":123})['payload']));
                                }
                            }
                        }else{
                            //non c'è resto
                            console.log('dispense completed con transazione senza resto')
                            transaction.setChannel(parsed_message.product);
                            transaction.setProduct(globalData.prodotto_id,globalData.prezzo);
                            transaction.completeTransaction('ok');
                            let contabilita = new ContabilitaClass(transaction);

                            setTimeout(() =>{
                                dialog.setText('Grazie e arrivederci!')
                                dialog.setState(transaction.state)
                                let message = dialog.printMessage();                    
                                io.emit('stream', JSON.stringify(message))

                            },3000);

                            //disable pagamenti
                            mqttClient.sendMessage(coinClient.disable({"ts":123})['topic'], JSON.stringify(coinClient.disable({"ts":123})['payload']));
                            mqttClient.sendMessage(billClient.disable({"ts":123})['topic'], JSON.stringify(billClient.disable({"ts":123})['payload']));
                        }

                        //chiusura paratia
                        mqttClient.sendMessage(bulkheadClient.close({"ts":123})['topic'], JSON.stringify(bulkheadClient.close({"ts":123})['payload']));

                        //Apertura portello
                        mqttClient.sendMessage(productDoorClient.open({"ts":123})['topic'], JSON.stringify(productDoorClient.open({"ts":123})['payload']));
                        mqttClient.registerHandler(bulkheadClient.status().topic, msg => { 
                            let parsedMessage = JSON.parse(msg)
                            if(parsedMessage.status == 'closed'){
                                mqttClient.sendMessage(productDoorClient.open({"ts":123})['topic'], JSON.stringify(productDoorClient.open({"ts":123})['payload']));
                                setTimeout(() => {
                                    mqttClient.sendMessage(productDoorClient.close({"ts":123})['topic'], JSON.stringify(productDoorClient.close({"ts":123})['payload']));
                                },15000)
                            }
                        });

                    }

                }


                // ********************************
                // dispenseComplete
                // ********************************
                const dispense = require('./socketConsumerFiles/dispenseComplete')
                dispense.dispense(io, mqttClient, topic, message, dispenseCompleteTopic, coinClient, billClient, globalData, transaction)


        })
    }
}
