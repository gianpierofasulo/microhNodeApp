const fetch = require('node-fetch');
const endpoints = require('../endpoints');
const fileSystem = require("fs")
const { promises: fsPromises } = require("fs");
const vending_config = './public/data/config.json'
const vending_contabilita = './public/data/contabilita/contabilita.json';
const JSONStore = require('../classes/JsonStore.class.js');
const { filter } = require('compression');

exports.getContabilita = (tipo) => {//<--- da eliminare
    let message;
    if (tipo !== undefined) {

        let jsonFile;
        if(tipo == 'contabilita'){
            jsonFile = './public/data/contabilita/' + 'contabilita.json';
        }else if (tipo == 'contabilita_motori'){
            jsonFile = './public/data/contabilita/' + 'contabilita_motori.json';
        }

        try {
            let Store = new JSONStore(jsonFile);
            let data = Store.read();
            return data;

        } catch (err) {
            console.error(err);
        }

    } else {
        message = 'Paramentro non correttamente passato.'
        return message;
    }
};

exports.updateContabilita = (obj) => { //<--- da eliminare

    if (obj) {

        let content = fileSystem.readFileSync(vending_contabilita, 'utf8');
        content = JSON.parse(content)

        var objLength = obj.length;

        while (objLength--) {
            var item = obj[objLength];
            let b = Object.keys(item);

            content.contabilita[0][b] += item[b];

            fileSystem.writeFileSync(vending_contabilita, JSON.stringify(content));

            if (objLength == 0) {

                let message = {
                    msg: 'JSON data is saved.'
                }
                return message;
            }
        }
    }

};

exports.authentication = (user, password) => {
    let configUpdate_file = './public/data/network.json';
    let content = fileSystem.readFileSync(configUpdate_file, 'utf8');
    content = JSON.parse(content)
    let utenteJson = content.network[0].indirizzo_email;
    let passwordJson = content.network[0].password;
    if (user == utenteJson && password == passwordJson) {
        return true
    } else {
        return false
    }

};

exports.getConfig = (tipo) => {
    let message;
    if (tipo !== undefined) {
        let generali = ['generali', 'info_venditore', 'behavior', 'stampe', 'vetrina', 'all'];
        let network = ['network', 'network_system'];
        let token = ['token'];
        let jsonFile;

        if (generali.find(el => el == tipo)) {
            jsonFile = './public/data/' + 'config.json';
        } else if (network.find(el => el == tipo)) {
            jsonFile = './public/data/' + 'network.json';
        } else if (token.find(el => el == tipo)) {
            jsonFile = './public/data/' + 'token.json';
        }

        let data;
        try {
            let Store = new JSONStore(jsonFile);
            data = Store.read();
            if (tipo != 'all') {
                if (data) {
                    for (let g of data[tipo]) {
                        return g
                    }
                }
            } else {
                return data
            }

        } catch (err) {
            console.error(err);
        }

    } else {
        message = 'Paramentro non correttamente passato.'
        return message;
    }

};

exports.updateJson = (req) => {

    if (req) {
        let configUpdate_file = './public/data/' + req[0]['file'];

        let content = fileSystem.readFileSync(configUpdate_file, 'utf8');

        content = JSON.parse(content)

        let objLength = req.length;

        while (objLength--) {
            let item = req[objLength];
            let b = Object.keys(item);
            let val = b[0]
            let type = b[1]
            let file = b[2]
            let conf_type = item[type]
            let conf_val = item[val]

            if(conf_val == "1" || conf_val == "0") conf_val = Number(conf_val);

            content[conf_type][0][val] = conf_val;

            fileSystem.writeFileSync('./public/data/' + item[file], JSON.stringify(content));

            if (objLength == 0) {

                let message = {
                    msg: 'JSON data is saved.'
                }
                return message;
            }
        }
    }

};

