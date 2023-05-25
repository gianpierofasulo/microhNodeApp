const fetch = require('node-fetch');
const fileSystem = require("fs")
const os = require('os');
const { promises: fsPromises } = require("fs");
const JSONStore = require('../classes/JsonStore.class.js');
const UtilsClass = require('../classes/Utils.class.js');



exports.getPeriferiche = () => {

    let data;
    let platform = os.platform();

    if(platform == 'linux') {
        data = '/etc/ddxtouch/ddxtouch.conf';
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('ddxtouch.conf controller content > ',data)
        }
        
    }
    else {
        data = './public/private/periferiche/periferiche.json';
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('periferiche.json controller content > ',data)
        }
    }

    const perifericheFile = new JSONStore(data);
    return perifericheFile.read()
};

exports.listPeriferiche = () => {
    let data;
    let platform = os.platform();
    if(platform == 'linux') {
        data = '/etc/ddxtouch/ddxtouch.conf';
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('ddxtouch.conf controller content > ',data)
        }
    }
    else {
        data = './public/private/periferiche/periferiche.json';
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('periferiche.json controller content > ',data)
        }
    }
    let periferiche = {};
    
    const perifericheFile = new JSONStore(data);
    const periferiche_list = perifericheFile.read();

    

    for(let i = 0; i < periferiche_list['peripherals'].length; i++){
        periferiche[periferiche_list['peripherals'][i].id] = periferiche_list['peripherals'][i]
    }

    return periferiche;

}



exports.getMotori = () => {
    let data;
    let platform = os.platform();

    if(platform == 'linux') {
        data = '/etc/ddxtouch/ddxtouch.conf';
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('ddxtouch.conf controller content > ',data)
        }
        
    }
    else {
        data = './public/private/periferiche/periferiche.json';
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('periferiche.json controller content > ',data)
        }
        
    }
    const perifericheFile = new JSONStore(data);
    const periferiche = perifericheFile.read()
    //Array tipi motori
    let dispensers = [];

    if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
        console.log('periferiche controller getMotori',periferiche);
    }

    for(let i = 0; i < periferiche['peripherals'].length; i++){
        
        if(periferiche['peripherals'][i].id == 'Dispensers'){
           dispensers.push(periferiche['peripherals'][i]);
           if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
                console.log('periferiche controller dispensers',dispensers[i]);
            }
        }
    }
    return dispensers;

}

exports.getMotoriConf = () => {
    let data;
    let platform = os.platform();

    if(platform == 'linux') {
        data = '/etc/ddxtouch/ddxtouch.conf';
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('ddxtouch.conf controller content > ',data)
        }
        
    }
    else {
        data = './public/private/periferiche/periferiche.json';
        if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
            console.log('periferiche.json controller content > ',data)
        }
        
    }

    const perifericheFile = new JSONStore(data);
    const periferiche = perifericheFile.read()

    //Array tipi motori
    let dispensers = [];

    for(let i = 0; i < periferiche['peripherals'].length; i++){
        
        if(periferiche['peripherals'][i].id == 'Dispensers'){
           dispensers.push(periferiche['peripherals'][i]);
           if(process.env.DEBUG == 1 && process.env.DEBUG_PERIPHERALS == 1) {
                console.log('periferiche controller dispensers',dispensers[i]);
            }
           
        }
    }

    console.log('periferiche controller getMotoriConf 2',dispensers);

    return dispensers;

}

/**
 * 
 * @returns {Object}
 */
exports.getGpioStatus = () => {
    const statusFile = new JSONStore('./public/private/periferiche/gpio.json');
    const status = statusFile.read()
    return status;
}

/**
 * 
 * @returns {Object}
 */
exports.getBulkheadStatus = () => {
    const statusFile = new JSONStore('./public/private/periferiche/bulkhead.json');
    const status = statusFile.read()
    return status;
}

/**
 * 
 * @returns {Object}
 */
exports.getProductdoorStatus = () => {
    const statusFile = new JSONStore('./public/private/periferiche/productdoor.json');
    const status = statusFile.read()
    return status;
}

/**
 * 
 * @returns {Object}
 */
exports.getDispensersStatus = () => {
    const statusFile = new JSONStore('./public/private/periferiche/dispensers.json');
    const status = statusFile.read()
    return status;
}

/**
 * 
 * @returns {Object}
 */
exports.getAlarmsStatus = () => {
    const statusFile = new JSONStore('./public/private/periferiche/alarms.json');
    const status = statusFile.read()
    return status;
}

/**
 * 
 * @returns {Object}
 */
exports.getCoinAcceptorStatus = () => {
    const statusFile = new JSONStore('./public/private/periferiche/coinacceptor.json');
    const status = statusFile.read()
    return status;
}

/**
 * 
 * @returns {Object}
 */
exports.getBillValidatorStatus = () => {
    const statusFile = new JSONStore('./public/private/periferiche/billvalidator.json');
    const status = statusFile.read()
    return status;
}
