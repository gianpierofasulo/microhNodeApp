const socketController = require('../../controllers/socket.controller')

window.addEventListener("load", function () {
    console.log('erogazione manuale')

    function aggiorno(msg){
        let data = JSON.parse(msg);
        aggiornaDati(data);
    }

    socketController.stato_periferiche(aggiorno);

    // ****************************************************************
    // aggiornamento UI (red)
    // ****************************************************************

    let aggiornaDati = (data) => {
        console.log('\n%c################################################ dati da socket()', 'color: red')
        console.log(`%cdata:`, 'color: red', data)

        // console.log('data bulkead >',data.Bulkhead)
        // console.log('data productdoor >',data.ProductDoor)

        if(data.Bulkhead){
            console.log('%cdata.Bulkhead da erogazionemanuale.js:', 'color: red', data.Bulkhead.status)
            // console.log('data.Bulkhead.status da erogazionemanuale.js > ',data.Bulkhead.status)
            bulkHeadStatus = data.Bulkhead.status

            if (bulkHeadStatus == 'inactive' || bulkHeadStatus == 'offline' || bulkHeadStatus == 'moving') { 
                paratia.disabled = true; 
            }
            else {
                if(bulkHeadStatus == 'closed') {
                    paratia.checked = false;
                    paratia.disabled = false;
                }   
                else if (bulkHeadStatus == 'open') {
                    paratia.checked = true;
                    paratia.disabled = false;
                }
            }
        }
        else if(data.ProductDoor){
            console.log('%cdata.ProductDoor da erogazionemanuale.js:', 'color: red', data.ProductDoor.status)
            // console.log('data.ProductDoor.status da erogazionemanuale.js > ',data.ProductDoor.status)
            productDoorStatus = data.ProductDoor.status

            if (productDoorStatus == 'inactive' || productDoorStatus == 'offline' || productDoorStatus == 'moving') { 
                vano.disabled = true;
            }
            else {
                if(productDoorStatus == 'closed') {
                    vano.checked = false;
                    vano.disabled = false;
                }   
                else if (productDoorStatus == 'open') {
                    vano.checked = true;
                    vano.disabled = false;
                }
            }
        }
        console.log('%c################################################ socket()\n', 'color: red')

    }

    // ****************************************************************
    // vars
    // ****************************************************************

    let erogazione_manuale = false
    let topicsRegistered = {}
    let bulkHeadStatus = ''
    let productDoorStatus = ''
    let mqttBulkOpen = { topic : 'Bulkhead/command/open', message : `"ts": Number(Date.now())` }
    let mqttBulkClose = { topic : 'Bulkhead/command/close', message : `"ts": Number(Date.now())` }
    let mqttDoorOpen = { topic : 'ProductDoor/command/open', message : `"ts": Number(Date.now())` }
    let mqttDoorClose = { topic : 'ProductDoor/command/close', message : `"ts": Number(Date.now())` }
    let paratia = document.getElementById('paratia')
    let vano = document.getElementById('vano')
    let stop = document.getElementById('stop')
    let sequenziale = document.getElementById('erogazione_sequenziale_A')

    // ****************************************************************
    // vars init
    // ****************************************************************

    if (paratia.disabled == true) { bulkHeadStatus = 'inactive' }
    else {
        if (paratia.checked) { bulkHeadStatus = 'open' }
        else if (paratia.checked == false) { bulkHeadStatus = 'closed' }
    }
    console.log('%c################################################', 'color: #48ff48')
    console.log(`%cbulkHeadStatus:`, 'color: #48ff48', bulkHeadStatus)
    console.log('%c################################################', 'color: #48ff48')

    if (vano.disabled == true) { productDoorStatus = 'inactive' }
    else {
        if (vano.checked) { productDoorStatus = 'open' }
        else if (vano.checked == false) { productDoorStatus = 'closed' }
    }
    console.log('%c################################################', 'color: #48ff48')
    console.log(`%cproductDoorStatus:`,'color: #48ff48', productDoorStatus)
    console.log('%c################################################', 'color: #48ff48')

    // ****************************************************************
    // funzioni (yellow)
    // ****************************************************************

    function enableInputs(inputs) {

        console.log(`%cenable inputs!`, 'color: yellow')

        inputs.forEach(input => {
            input.disabled = false;
            input.checked = false;
            if (input.style.backgroundColor != 'green' && input.style.backgroundColor != 'red') {
                input.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            }

            // se paratia e portello non presenti o non funzionanti non le abilito mai
            if(bulkHeadStatus == 'inactive' || bulkHeadStatus == 'offline') { paratia.disabled = true; }
            if(productDoorStatus == 'inactive' || productDoorStatus == 'offline') {  vano.disabled = true; }

            // se paratia e portello aperti lascio enabled
            if(bulkHeadStatus == 'open') { paratia.disabled = false; paratia.checked = true; }
            else if(bulkHeadStatus == 'closed') { paratia.disabled = false; paratia.checked = false; }
            if(productDoorStatus == 'open') {  vano.disabled = false; vano.checked = true; }
            else if(productDoorStatus == 'closed') {  vano.disabled = false; vano.checked = false; }
        });
    }

    function disableInputs(inputs) {
        
        console.log(`%cdisable inputs!`, 'color: yellow')

        inputs.forEach(input => {
            input.disabled = true;
            input.checked = false;
            input.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';

            // se paratia e portello non presenti o non funzionanti non le abilito mai
            if(bulkHeadStatus == 'inactive' || bulkHeadStatus == 'offline') { paratia.disabled = true; }
            if(productDoorStatus == 'inactive' || productDoorStatus == 'offline') {  vano.disabled = true; }

            // se paratia e portello aperti lascio enabled
            if(bulkHeadStatus == 'open') { paratia.disabled = true; paratia.checked = true; }
            else if(bulkHeadStatus == 'closed') { paratia.disabled = true; paratia.checked = false; }
            if(productDoorStatus == 'open') {  vano.disabled = true; vano.checked = true; }
            else if(productDoorStatus == 'closed') {  vano.disabled = true; vano.checked = false; }
        });
    }

    function mqttPublish(mqttObject) {
        console.log('\n%c################################################ mqttPublish()', 'color: yellow')
        console.log('%ccanaliGruppo:', 'color: yellow', canaliGruppo);
        console.log('%ccomando:', 'color: yellow', mqttObject.topic)
        console.log('%ctopicsRegistered da mqttPublish:', 'color: yellow', topicsRegistered)
        console.log('%c################################################ mqttPublish()\n', 'color: yellow')

        client.publish(mqttObject.topic, JSON.stringify(mqttObject.message), { qos: 1, retain: false }, (error) => {
            if (error) {
                console.error(error)
            }
        })
    }

    function registerHandler(topic, callback) {
        topicsRegistered[topic] = callback;
    }

    function unRegisterHandler(topic) {
        delete topicsRegistered[topic];
    }

    // ****************************************************************
    // paratia
    // ****************************************************************

    paratia.addEventListener('change', function() {
        console.log('bulkHeadStatus',bulkHeadStatus)

        if(bulkHeadStatus != 'inactive') {
            if(bulkHeadStatus != 'moving') {
                if(bulkHeadStatus == 'closed') {
                    console.log('bulhead closed, so open it!')
                    mqttPublish(mqttBulkOpen)
                }
                else if (bulkHeadStatus == 'open') {
                    console.log('bulhead open, so close it!')
                    mqttPublish(mqttBulkClose)
                }
            }
        }
    });

    // ****************************************************************
    // vano
    // ****************************************************************

    vano.addEventListener('change', function() {

        if(productDoorStatus != 'inactive') {
            if(productDoorStatus != 'moving') {
                if(productDoorStatus === 'closed') {
                    console.log(`product door status: ${productDoorStatus}, so open it!`)
                    mqttPublish(mqttDoorOpen)
                }
                else if (productDoorStatus === 'open') {
                    console.log(`product door status: ${productDoorStatus}, so close it!`)
                    mqttPublish(mqttDoorClose)
                }
            }
        }
    });

    // ****************************************************************
    // stop (pink)
    // ****************************************************************
    stop.disabled = true

    function stopErogazione() {
        if(bulkHeadStatus != 'offline' && bulkHeadStatus != 'inactive' && bulkHeadStatus != 'moving') {
            // if(bulkHeadStatus == 'closed') {
            //     console.log('closed, so open it!')
            //     mqttPublish(mqttBulkOpen)
            // }
            // else if (bulkHeadStatus == 'open') {
            //     console.log('open, so close it!')
            //     mqttPublish(mqttBulkClose)
            // }
            unRegisterHandler('Dispensers/telemetry/dispenseComplete')
            unRegisterHandler('Dispensers/telemetry/dispenseFailed')
            unRegisterHandler('Bulkhead/telemetry/status')
            console.log('%ctopicsRegistered da stop >', 'color: pink', topicsRegistered)
            stop.disabled = true
        }
    }

    stop.addEventListener('click', function() {
        erogazione_manuale = true;

        console.log('\n%c################################################ stop()', 'color: pink')
        console.log('%cerogazione_manuale da stop:', 'color: pink', erogazione_manuale)
        console.log('%cbulkHeadStatus:', 'color: pink', bulkHeadStatus)

        registerHandler('Dispensers/telemetry/dispenseComplete', message => {
            stopErogazione()
        });
        registerHandler('Dispensers/telemetry/dispenseFailed', message => {            
            stopErogazione()
        });

        console.log('%ctopicsRegistered da stop:', 'color: pink', topicsRegistered)
        console.log('%c################################################ stop()\n', 'color: pink')
    });

    // ****************************************************************
    // EROGAZIONE MANUALE (cyan)
    // ****************************************************************

    // Get the div element by its ID
    const myDiv = document.getElementById('erogazione');
    // Find all the input elements with the class 'form-check-input' inside the div
    const formCheckInputs = myDiv.querySelectorAll('input.form-check-input');
    // Loop through the formCheckInputs NodeList and do something with each element
    formCheckInputs.forEach(input => {
        
        //console.log(input.value);
        
        // Do something with each input element
        input.addEventListener('change', function() {
            if(input.checked) {

                erogazione_manuale = true
                console.log('erogazione_manuale da manuale >',erogazione_manuale)

                // button enabled
                stop.disabled = false

                // checkbox disabled
                let formInputs = document.querySelectorAll('input.form-check-input')
                disableInputs(formInputs)
                
                if(bulkHeadStatus != 'offline') {
                    if(bulkHeadStatus != 'inactive') {
                        if(bulkHeadStatus == 'closed') {
                            mqttPublish(mqttBulkOpen)
                        }
                    }
                }

                // se stato paratia è aperta => erogo
                if(bulkHeadStatus != 'offline') {
                    if(bulkHeadStatus != 'inactive') {
                        if(bulkHeadStatus == 'open') {
                            let body = { 
                                group : input.getAttribute('data-gruppo'),
                                canale : input.value,
                                ts: 123
                            }
                            let command = {
                                group:body.group, 
                                product1: Number(body.canale), 
                                product2: Number(body.canale),
                                ts: Number(body.ts) // int
                            }
                            let mqttObject = {
                                topic : 'Dispensers/command/dispense', // TODO: vedi documentazione > DDxTouch_MQTT_1.0.18.pdf
                                message : command 
                            }
                            mqttPublish(mqttObject)
                        }
                    }
                }

                // quando mqtt torna paratia aperta => eseguo la dispense
                registerHandler('Bulkhead/telemetry/status', message => {
                    let parsedMessage = JSON.parse(message)
                    // TODO:
                    // - scrittura su json stati
                    // - scrittura su log

                    if(parsedMessage.status == 'open') {
                        let body = { 
                            group : input.getAttribute('data-gruppo'),
                            canale : input.value,
                            ts: 123
                        }
                        let command = {
                            group:body.group, 
                            product1: Number(body.canale), 
                            product2: Number(body.canale),
                            ts: Number(body.ts) // int
                        }
                        let mqttObject = {
                            topic : 'Dispensers/command/dispense', // TODO: vedi documentazione > DDxTouch_MQTT_1.0.18.pdf
                            message : command 
                        }
                        mqttPublish(mqttObject)
                        unRegisterHandler('Bulkhead/telemetry/status')
                    }
                });

                
            }
        });
    });

    // ****************************************************************
    // EROGAZIONE SEQUENZIALE (cyan)
    // ****************************************************************

    sequenziale.addEventListener('click', function() {
        stop.disabled = false;
        erogazione_manuale = false;

        console.log('\n%c################################################ sequenziale()', 'color: cyan')
        console.log('%cerogazione_manuale da sequenziale:','color: cyan', erogazione_manuale)
        console.log('%ctopicsRegistered da sequenziale:','color: cyan', topicsRegistered)
        console.log('%cbulkHeadStatus da sequenziale:','color: cyan', bulkHeadStatus)
        
        let formInputs = document.querySelectorAll('input.form-check-input')
        disableInputs(formInputs)

        //FIXME:
        // if(bulkHeadStatus === 'inactive') {
        //     let body = { 
        //         group : "A",
        //         canale : 0,
        //         ts: 123
        //     }
        //     let command = {
        //         group:body.group, 
        //         product1: Number(body.canale), 
        //         product2: Number(body.canale),
        //         ts: Number(body.ts) // int
        //     }
        //     let mqttObject = {
        //         topic : 'Dispensers/command/dispense', // TODO: vedi documentazione > DDxTouch_MQTT_1.0.18.pdf
        //         message : command 
        //     }
        //     mqttPublish(mqttObject)
        // }
        //FIXME:

        // se stato paratia è chiusa => apro
        if(bulkHeadStatus != 'offline') {
            if(bulkHeadStatus != 'inactive') {
                if(bulkHeadStatus === 'closed') {
                    mqttPublish(mqttBulkOpen)
                }
            }
        }

        // se stato paratia è aperta => erogo
        if(bulkHeadStatus != 'offline') {
            if(bulkHeadStatus != 'inactive') {
                if(bulkHeadStatus === 'open') {
                    let body = { 
                        group : "A",
                        canale : 0,
                        ts: 123
                    }
                    let command = {
                        group:body.group, 
                        product1: Number(body.canale), 
                        product2: Number(body.canale),
                        ts: Number(body.ts) // int
                    }
                    let mqttObject = {
                        topic : 'Dispensers/command/dispense', // TODO: vedi documentazione > DDxTouch_MQTT_1.0.18.pdf
                        message : command 
                    }
                    mqttPublish(mqttObject)
                }
            }
        }
        
        // quando mqtt torna paratia aperta => eseguo la dispense
        registerHandler('Bulkhead/telemetry/status', message => {
            let parsedMessage = JSON.parse(message)
            // TODO:
            // - scrittura su json stati
            // - scrittura su log

            if(parsedMessage.status == 'open') {
                let body = { 
                    group : "A",
                    canale : 0,
                    ts: 123
                }
                let command = {
                    group:body.group, 
                    product1: Number(body.canale), 
                    product2: Number(body.canale),
                    ts: Number(body.ts) // int
                }
                let mqttObject = {
                    topic : 'Dispensers/command/dispense', // TODO: vedi documentazione > DDxTouch_MQTT_1.0.18.pdf
                    message : command 
                }
                mqttPublish(mqttObject)
            }
        });

        console.log('%c################################################ sequenziale()\n', 'color: cyan')
    });

    // ****************************************************************
    // mqtt (green)
    // ****************************************************************
    client.on('message', (topic, message) => {
        console.log('\n%c################################################ client.on(message)', 'color: #48fb47')
        // console.log('MQTT > received message:', topic, message.toString())

        let parsedMessage = JSON.parse(message)
        let formInputs = document.querySelectorAll('input.form-check-input')

        if (topicsRegistered[topic]) {
            topicsRegistered[topic](message);
        }

        let n_max_canali_gruppo = canaliNumero;
        // if (parsedMessage.group == "A") n_max_canali_gruppo = 10
        // else if (parsedMessage.group == "B") n_max_canali_gruppo = 2

        if (topic === 'Dispensers/telemetry/dispenseComplete' || 'Dispensers/telemetry/dispenseFailed') {
            console.log('%cerogazione_manuale da on message:', 'color: #48fb47', erogazione_manuale)
            if(erogazione_manuale == false){
                if (parsedMessage.product+1 < n_max_canali_gruppo) {

                    console.log('%cpassa','color: #48fb47', n_max_canali_gruppo)

                    setTimeout(function() {
                        let body = { 
                            group : parsedMessage.group,
                            canale : parsedMessage.product+1,
                            ts: 123
                        }
                        let command = {
                            group:body.group, 
                            product1: Number(body.canale), 
                            product2: Number(body.canale),
                            ts: Number(body.ts) // int
                        }
                        let mqttObject = {
                            topic : 'Dispensers/command/dispense', // TODO: vedi documentazione > DDxTouch_MQTT_1.0.18.pdf
                            message : command 
                        }
                        mqttPublish(mqttObject)

                    }, 1000)
                }
            } 
            else if (erogazione_manuale == true) {
                console.log('%c----------------------> PASSA', 'color: #48fb47')
                //disableInputs(formInputs)
            }
        }
        if (topic === 'Dispensers/telemetry/dispenseComplete') {
            // verde
            console.log('%ccoloro di verde motore!', 'color: #48fb47')

            let motore = parsedMessage.product + 1
            if(parsedMessage.group == "A") {
                document.getElementById('motore_A_'+motore).style.background = 'green';
            }

            if(erogazione_manuale == false){
                if (parsedMessage.product+1 == n_max_canali_gruppo) {
                    enableInputs(formInputs)
                    // stopErogazione()
                    stop.disabled = true
                }
            }
            else if (erogazione_manuale == true) {
                erogazione_manuale == false
                console.log('%cerogazione_manuale da complete:','color: #48fb47', erogazione_manuale)
                enableInputs(formInputs)
                // stopErogazione()
                stop.disabled = true
                document.getElementById('motore_A_'+motore).style.background = 'green'
            }
        }
        else if (topic === 'Dispensers/telemetry/dispenseFailed') {
            // rosso
            console.log('%ccoloro di rosso motore!', 'color: #48fb47')

            let motore = parsedMessage.product +1
            if(parsedMessage.group == "A") {
                document.getElementById('motore_A_'+motore).style.background = 'red';
            }

            if(erogazione_manuale == false){
                if (parsedMessage.product+1 == n_max_canali_gruppo) {
                    enableInputs(formInputs)
                    // stopErogazione()
                    stop.disabled = true
                }
            }
            else if (erogazione_manuale == true) {
                erogazione_manuale == false
                console.log('%cerogazione_manuale da failed:','color: #48fb47', erogazione_manuale)
                enableInputs(formInputs)
                // stopErogazione()
                stop.disabled = true
                document.getElementById('motore_A_'+motore).style.background = 'green'
            }
        }

        console.log('%c################################################ client.on(message)\n', 'color: #48fb47')
    })

})