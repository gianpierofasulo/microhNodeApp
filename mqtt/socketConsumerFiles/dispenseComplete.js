const fetch = require('node-fetch');
const invoice = require('../_dev/scontrino.js');
const receipt = require('../receipt.js');
const qrcode = require('../qrcode.js');
//const richiesta = require('../fetchContabilita.js');
const configController = require('../../controllers/config.controller.js')
const ContabilitaClass = require('../../classes/Contabilita.class')
const TicketClass = require('../../classes/Ticket.class')
const MessageClass = require('../../classes/Message.class')

// ********************************
// dispenseComplete
// ********************************
exports.dispense = (io, mqttClient, topic, message, dispenseCompleteTopic, coinClient, billClient,globalData,transaction) => {
    let dialog;
    if(topic == dispenseCompleteTopic){
        dialog = new MessageClass('dialog','Grazie e arrivederci!',true,transaction.state)
       
        if(process.env.DEBUG == 1 && process.env.DEBUG_SOCKET == 1) {
            console.log('############ coinDispenseComplete > topic ###############',topic)
            console.log('############ coinDispenseComplete > dispenseCompleteTopic ###############',dispenseCompleteTopic)
        }

        if(process.env.DEBUG == 1 && process.env.DEBUG_SOCKET == 1) {
            // console.log('### TEST TEST TEST Mqtt << received Message:', topic, message.toString()) // message is Buffer
            // console.log('### TEST TEST TEST Mqtt << received Message:', topic, JSON.parse(message))
        }

        // TODO: inserire annulla transazione??

        let monete_erogate = JSON.parse(message).value;

        if(monete_erogate == 0) {
                if(process.env.DEBUG == 1 && process.env.DEBUG_SOCKET == 1) {
                    console.log('### OK OK OK OK OK OK OK OK OK erogazione solo scontrino dispenseComplete >> send message:', message.toString()) // message is Buffer
                }
                // FIXME:
                let scontrino = globalData.resto

                // stampa scontrino con il resto TOTALE
                if(process.env.DEBUG == 1 && process.env.DEBUG_SOCKET == 1) {
                    console.log('###############################')
                    console.log('# SCONTRINO TOTALE, MONETA MANCANTE '+ scontrino)
                    console.log('###############################')
                }






                //Salvataggio transazione solo scontrino
                transaction.setChannel(globalData.canale);
                transaction.setProduct(globalData.prodotto_id,globalData.prezzo);
                transaction.setResto('scontrino',scontrino);
                transaction.setResto('monete',monete_erogate);
                transaction.completeTransaction('ok');
                let contabilita = new ContabilitaClass(transaction);

                // ******************
                // Nuovo Ticket
                // ******************
                let ticket = new TicketClass(transaction);


                dialog.setState(transaction.state);
                let stream = dialog.printMessage();                    
                io.emit('stream', JSON.stringify(stream))

                 // ******************
                // qrcode + stampa
                // ******************
                if(process.env.PRINTER == 1) {
                    qrcode.create(globalData.incasso,globalData.prezzo,globalData.resto,scontrino, monete_erogate,ticket);
                }

                // ******************
                // disable
                // ******************
                mqttClient.sendMessage(coinClient.disable({"ts":123})['topic'], JSON.stringify(coinClient.disable({"ts":123})['payload']));
                mqttClient.sendMessage(billClient.disable({"ts":123})['topic'], JSON.stringify(billClient.disable({"ts":123})['payload']));

                // mqttClient.mqttClient.unsubscribe(['CoinAcceptor/telemetry/dispenseComplete'], () => {
                //     console.log(`@@@ MqttHandler > unsubscribed to topic: '${topic}'`)
                // })



        }
        else {
                if(process.env.DEBUG == 1 && process.env.DEBUG_SOCKET == 1) {
                    //console.log('### OK OK OK OK OK OK OK OK OK  dispenseComplete erogazione mista >> send message:', message.toString()) // message is Buffer
                }
                // FIXME:
                let scontrino = globalData.resto - monete_erogate;


                // stampa scontrino con il resto PARZIALE
                if(process.env.DEBUG == 1 && process.env.DEBUG_SOCKET == 1) {
                    console.log('###############################')
                    console.log('# MONETA '+ monete_erogate)
                    console.log('###############################')
                }

              



                 // Transazione conclusa con solo scontrino

                transaction.setChannel(globalData.canale);
                transaction.setProduct(globalData.prodotto_id,globalData.prezzo);
                transaction.setResto('scontrino',scontrino);
                transaction.setResto('monete',monete_erogate);
                transaction.completeTransaction('ok');
                let contabilita = new ContabilitaClass(transaction);
                //Messaggio di status
                dialog.setState(transaction.state);
                let stream = dialog.printMessage();                    
                io.emit('stream', JSON.stringify(stream))


                // ******************
                // qrcode + stampa
                // ******************
                if(scontrino > 0){
                    console.log('###############################')
                    console.log('# STAMPO SCONTRINO: '+ scontrino)
                    console.log('# MONETA: '+ monete_erogate)
                    console.log('###############################')

                    // ******************
                    // Nuovo Ticket
                    // ******************
                    let ticket = new TicketClass(transaction);

                    if(process.env.PRINTER == 1) {
                        qrcode.create(globalData.incasso,globalData.prezzo,globalData.resto,scontrino, monete_erogate,ticket);
                    }
                }

                // *********
                // disable
                // *********
                mqttClient.sendMessage(coinClient.disable({"ts":123})['topic'], JSON.stringify(coinClient.disable({"ts":123})['payload']));
                mqttClient.sendMessage(billClient.disable({"ts":123})['topic'], JSON.stringify(billClient.disable({"ts":123})['payload']));

                // mqttClient.mqttClient.unsubscribe(['CoinAcceptor/telemetry/dispenseComplete'], () => {
                //     console.log(`@@@ MqttHandler > unsubscribed to topic: '${topic}'`)
                // })


        }
    }



}
