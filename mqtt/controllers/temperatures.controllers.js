const Utils = require('../../classes/Utils.class')
const Logger = require('../../classes/Logger.class');

require('dotenv').config()

exports.setFans = (parsedMessage,mqttClient,tempObject) => {
    // const perifericheFile = new JSONStore('./public/private/periferiche/periferiche.json');
    // return perifericheFile.read()

    console.log('parsedMessage 2',parsedMessage)

    if(parsedMessage.frameTemp) {
        if(parsedMessage.frameTemp < 35){                   
            console.log('temperatura FRAME minore di 35°') //Se la Temp è minore di trenta...
            parsedMessage = {...parsedMessage, "frameFan": 0, "ts": Math.round(Date.now()/1000)} //Ventola accesa al minimo
            mqttClient.sendMessage(tempObject.fans(parsedMessage).topic, JSON.stringify(tempObject.fans(parsedMessage).payload));

            // logger
            // const log = { id: Utils.getTimestamp(), state: parsedMessage.frameTemp, icon: 'bi-thermometer-low text-success', description: 'Temperatura frame: '+parsedMessage.frameTemp+'°' }
            // Logger.log('mqtt-temperatures-frame',log)
        }
        else if(parsedMessage.frameTemp > 80){
            console.log('temperatura FRAME maggiore di 50°') //Se la Temp è maggiore di ottanta...
            parsedMessage = {...parsedMessage, "frameFan": 100, "ts": Math.round(Date.now()/1000)} //Ventola accesa al massimo
            mqttClient.sendMessage(tempObject.fans(parsedMessage).topic, JSON.stringify(tempObject.fans(parsedMessage).payload));

            // logger
            const log = { id: Utils.getTimestamp(), state: parsedMessage.frameTemp, icon: 'bi-thermometer-high text-danger', description: 'Temperatura frame: '+parsedMessage.frameTemp+'°' }
            Logger.log('mqtt-temperatures-frame',log)
        }
        else{                                               
            console.log('temperatura FRAME in range tra 35° e 50°') //Se Temp è nel range 30-80 gradi allora...
            let calcolo = parsedMessage.frameTemp * 1.25; //Moltiplica Temp per 255/TempMax (255/80=3.18)
            parsedMessage = {...parsedMessage, "frameFan": Math.round(calcolo), "ts": Math.round(Date.now()/1000)} //Imposta la ventola al valore calcolato
            mqttClient.sendMessage(tempObject.fans(parsedMessage).topic, JSON.stringify(tempObject.fans(parsedMessage).payload));

            // logger
            if(!tempObject.frameTempStatus) {
                const log = { id: Utils.getTimestamp(), state: parsedMessage.frameTemp, icon: 'bi-thermometer-half text-warning', description: 'Temperatura frame: '+parsedMessage.frameTemp+'°' }
                Logger.log('mqtt-temperatures-frame',log)
                tempObject.frameTempStatus = true
            }
        }
    }

    if(parsedMessage.monitorTemp) {
        if(parsedMessage.monitorTemp < 33){                   
            console.log('temperatura MONITOR minore di 30°') //Se la Temp è minore di trenta...
            parsedMessage = {...parsedMessage, "monitorFan1": 0, "monitorFan2": 0, "ts": Math.round(Date.now()/1000)} //Ventola accesa al minimo
            mqttClient.sendMessage(tempObject.fans(parsedMessage).topic, JSON.stringify(tempObject.fans(parsedMessage).payload));
            
            // logger
            // const log = { id: Utils.getTimestamp(), state: parsedMessage.monitorTemp, icon: 'bi-thermometer-low text-success', description: 'Temperatura monitor: '+parsedMessage.monitorTemp+'°' }
            // Logger.log('mqtt-temperatures-monitor',log)
        }
        else if(parsedMessage.monitorTemp > 50){
            console.log('temperatura MONITOR maggiore di 50°') //Se la Temp è maggiore di ottanta...
            parsedMessage = {...parsedMessage, "monitorFan1": 100, "monitorFan2": 100, "ts": Math.round(Date.now()/1000)} //Ventola accesa al massimo
            mqttClient.sendMessage(tempObject.fans(parsedMessage).topic, JSON.stringify(tempObject.fans(parsedMessage).payload));

            // logger
            const log = { id: Utils.getTimestamp(), state: parsedMessage.monitorTemp, icon: 'bi-thermometer-high text-danger', description: 'Temperatura monitor: '+parsedMessage.monitorTemp+'°' }
            Logger.log('mqtt-temperatures-monitor',log)
        }
        else{
            console.log('temperatura MONITOR in range tra 30° e 50°') //Se Temp è nel range 30-80 gradi allora...
            let calcolo = parsedMessage.monitorTemp * 1.25; //Moltiplica Temp per 255/TempMax (255/80=3.18)
            parsedMessage = {...parsedMessage, "monitorFan1": Math.round(calcolo), "monitorFan2": Math.round(calcolo), "ts": Math.round(Date.now()/1000)} //Imposta la ventola al valore calcolato
            mqttClient.sendMessage(tempObject.fans(parsedMessage).topic, JSON.stringify(tempObject.fans(parsedMessage).payload));

            let result = (tempObject.monitorTempStatusCount % 2);
            if (result == 0) {
                if(parsedMessage.monitorFan1 > 0){ 
                    const log = { id: Utils.getTimestamp(), state: parsedMessage.monitorTemp, icon: 'bi-thermometer-half text-warning', description: 'Temperatura monitor: '+parsedMessage.monitorTemp+'°' }
                    Logger.log('mqtt-temperatures-monitor',log)
                }
            }

            tempObject.monitorTempStatusCount++
            console.log('monitorTempStatusCount', tempObject.monitorTempStatusCount)
        }
    }
};