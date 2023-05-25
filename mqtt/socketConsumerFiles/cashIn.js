const Credit = require('../../classes/Credit.class');
const Transaction = require('../../classes/Transaction.class')

// ********************************
// cashIn 
// ********************************
exports.cashin = (io, mqttClient, data, type, provenienza) => {

        if(process.env.DEBUG == 1 && process.env.DEBUG_SOCKET == 1) {
            console.log('### Mqtt << received Message:', type, data)
        }

        //Type  -> banonota,moneta,scontrino

        if(provenienza === 'frontend') {

            console.log(type+'cashin');

            let transaction = new Transaction();
            
            let credit;
            
            credit = new Credit(data.value,type);       

            transaction.setValues(data.value,credit.type);

            transaction.saveTransaction();
        
            console.log("Transazione aggiornata",transaction);
           
            let message = { value:data.value};
            if(message.toString().length > 0) {

                console.log(JSON.stringify(message),'cashiiiiiiiin');

                io.emit('startCash', JSON.stringify(message))
                console.log('### Socket startCash >> send message on type:', JSON.stringify(message), type)
            }
        }

    /*
    if(topic == coinStatusTopic) {
        if(process.env.DEBUG == 1 && process.env.DEBUG_SOCKET == 1) {
            // console.log('### Mqtt << received Message:', topic, message.toString()) // message is Buffer
            console.log('### Mqtt << received Message:', topic, JSON.parse(message))
        }
        if(topic.status == 'enabled') {
            if(topic == coinCashInTopic) {
                if(message.toString().length > 0) {
                    io.emit('startCash', message.toString())
                    // console.log('### Socket startCash >> send message:', message.toString())
                    console.log('### Socket startCash >> send message on topic:', message.toString(), topic)
                }
            }
        }
    }
    if(topic == 'CoinAcceptor/telemetry/cashIn') {
        if(process.env.DEBUG == 1 && process.env.DEBUG_SOCKET == 1) {
            console.log('### Mqtt << received Message:', topic, message.toString()) // message is Buffer
            console.log('### Mqtt << received Message:', topic, JSON.parse(message))
        }
    }
    
    if(topic == billStatusTopic) {
        if(process.env.DEBUG == 1 && process.env.DEBUG_SOCKET == 1) {
            // console.log('### Mqtt << received Message:', topic, message.toString()) // message is Buffer
            console.log('### Mqtt << received Message:', topic, JSON.parse(message))
        }
        if(topic.status == 'enabled') {
            if(topic == billCashInTopic) {
                if(message.toString().length > 0) {
                    io.emit('startCash', message.toString())
                    // console.log('### Socket startCash >> send message:', message.toString())
                    console.log('### Socket startCash >> send message on topic:', message.toString(), topic)
                }
            }
        }
    }
    if(topic == 'BillValidator/telemetry/cashIn') {
        if(process.env.DEBUG == 1 && process.env.DEBUG_SOCKET == 1) {
            console.log('### Mqtt << received Message:', topic, message.toString()) // message is Buffer
            console.log('### Mqtt << received Message:', topic, JSON.parse(message))
        }
    }
    */
}