const fetch = require('node-fetch');
const { exec } = require("child_process");
const endpoints = require('../endpoints');
const fileSystem = require("fs")
const {promises: fsPromises} = require("fs");
const vending_network = './public/data/network.json'
const network = require('network');
const endpoint = require('../endpoints');
const ConfigController = require('./config.controller');
const networkConfig = ConfigController.getConfig('network_system');
const os = require('os');
const fs = require('fs')
const https = require('https')
const path = require('path');

/**
 * setNetwork
 * @param {*} req 
 * @returns {*} {message: ConfigController.updateJson}
 */
exports.setNetwork = (req) => {

    if(process.env.DEBUG == 1) {
        console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@ REQ', req[1].localIp_ip);
        console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@ networkConfig',networkConfig);

        console.log('\n[ ------------------------------------------------------ ]');
        console.log('[ @network.controller.js > setNetwork() > REQ: '+platform);
        console.log('[ @network.controller.js > setNetwork() > networkConfig: ',networkConfig);
        console.log('[ ------------------------------------------------------ ]\n');
    }

    if(req){
        // FIXME: prendere i dati direttamente dal form e non dal json!
        let dhcp = req[0].dhcp;
        if(dhcp == 1) dhcp = 'true';
        else dhcp = 'false';
        let ip = req[1].localIp_ip;
        let gateway = req[3].gateway;

        if(process.env.DEBUG == 1) {
            console.log('\n[ ------------------------------------------------------ ]');
            console.log('[ @network.controller.js > setNetwork() > DHCP: '+dhcp);
            console.log('[ @network.controller.js > setNetwork() > IP: '+ip);
            console.log('[ @network.controller.js > setNetwork() > GATEWAY: '+gateway);
            console.log('[ ------------------------------------------------------ ]\n');
        }

        let platform = os.platform();

        if(process.env.DEBUG == 1) {
            console.log('\n[ ------------------------------------------------------ ]');
            console.log('[ @network.controller.js > setNetwork() > platform: '+platform);
            console.log('[ ------------------------------------------------------ ]\n');
        }

        // FIXME:
        // assegnare permessi di esecuzione a file tramite: chmod +x network.sh
        // assegnare gruppo root a file tramite: chown root:root network.sh
        // FIXME:

        if(platform == 'linux') {
            exec("scripts/network.sh " + dhcp + " " + ip + " " + gateway, (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    return;
                }
                console.log(`stdout: ${stdout}`);
            });

            //TODO: eseguire comando systemctl start systemd-networkd
            exec("scripts/reboot.sh", (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    return;
                }
                console.log(`stdout: ${stdout}`);
            });
        }

        // TODO: riavvio scheda rete tramite comando: systemctl start systemd-networkd
        let upd = ConfigController.updateJson(req);
        if(upd){
            return upd;
        }
    }
};

/**
 * cancellaFile
 * @param {*} req 
 */
exports.cancellaFile = (req) => {
    const directoryPath = path.join(__dirname, '../public/media/');
    let targetFile = req[0].targetFile;

    fs.unlink(directoryPath + targetFile, (err) => {
        if (err) {
            throw err;
        }
    
    });
  
};

/**
 * loadNetwork
 * @param {*} req 
 * @returns {object} {network: network.get_active_interface} 
 */
exports.loadNetwork = async (req) => {

    let platform = os.platform();
    if(process.env.DEBUG == 1) {
        console.log('\n[ ------------------------------------------------------ ]');
        console.log('[ @network.controller.js > loadNetwork() > platform: '+platform);
        console.log('[ ------------------------------------------------------ ]\n');
    }

    let content = '';
    if(platform == 'linux') {
        content = fileSystem.readFileSync("/etc/systemd/network/eth0.network", 'utf8' );
        if(process.env.DEBUG == 1) {
            console.log('\n[ ------------------------------------------------------ ]');
            console.log('[ @network.controller.js > loadNetwork() > eth0.network content: '+content);
            console.log('[ ------------------------------------------------------ ]\n');
        }
        
    }
    else {
        content = fileSystem.readFileSync("./public/data/network/rete.txt", 'utf8' );
        if(process.env.DEBUG == 1) {
            console.log('\n[ ------------------------------------------------------ ]');
            console.log('[ @network.controller.js > loadNetwork() > rete.txt content: '+content);
            console.log('[ ------------------------------------------------------ ]\n');
        }
        
    }

    if(content) {

        const result = content.includes('DHCP=yes');
   
        if (result) {

            // DHCP = YES
            network.get_active_interface( async function (err, obj) {

                let risultato = new Promise((resolve, reject) =>{
                    resolve (obj)
                })
                
                // SCRIVO IL FILE network.json **************
                if(process.env.DEBUG == 1) {
                    console.log('\n[ ------------------------------------------------------ ]');
                    console.log('[ @network.controller.js > loadNetwork() > network interface:',await risultato);
                    console.log('[ ------------------------------------------------------ ]\n');
                }

                let networkData = []

                if  ( await risultato ) {

                    // LEGGO IP
                    // se vuoto scrivo
                    // altrimenti no
                    const data = require('../public/data/network.json');
                    let ip_esistente = data.network_system[0]['localIp_ip']
                    let dhcp_file = data.network_system[0]['dhcp']

                    // if (!ip_esistente) {
                    // FIXME: è giusto???
                    if (dhcp_file == 1) {
        
                            networkData.push({
                                localIp_ip : obj.ip_address,
                                type: 'network_system',
                                file: 'network.json'
                            });

                            networkData.push({
                                gateway: obj.gateway_ip,
                                type: 'network_system',
                                file: 'network.json'
                            });

                            networkData.push({
                                netmask: obj.netmask,
                                type: 'network_system',
                                file: 'network.json'
                            });

                            networkData.push({
                                dns_primario: '8.8.8.8',
                                type: 'network_system',
                                file: 'network.json'
                            });

                            networkData.push({
                                dns_primario: '8.8.4.4',
                                type: 'network_system',
                                file: 'network.json'
                            });


                            let upd = ConfigController.updateJson(networkData);
                            if(upd){
                                return upd;
                            }

                    } // END IF SU IP ESISTENTE
        
                }
        
            })
        } 
        else {
            return result;
        }
    }

};