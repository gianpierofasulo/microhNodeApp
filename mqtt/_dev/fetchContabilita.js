// TODO: eliminare

require('dotenv').config()
const fetch = require('node-fetch');
const frontend_host = process.env.FRONTEND_SERVER

/**
 * API di scrittura contabilità
 * @param {object} data - (guadagno, incasso, resto_scontrino, resto_moneta, resto_totale)
 */
exports.inviaTotali = (data) => {
let formData = []
    function contabilita(data) {
        for (const [key, value] of Object.entries(data)) {
            console.log(`${key}: ${value}`);
            let chiave = key
            let push = false
            if(key == 'guadagno' && value > 0){
                chiave = 'guadagno'
                push = true
            }
            if(key == 'incasso' && value > 0){
                chiave = 'incasso'
                push = true
            }
            if(key == 'resto_scontrino' && value > 0){
                chiave = 'resto_scontrino'
                push = true
            }
            if(key == 'resto_moneta' && value > 0){
                chiave = 'resto_moneta'
                push = true
            }
            if(key == 'resto_totale' && value > 0){
                chiave = 'resto_totale'
                push = true
            }
            if(push) {
                let obj = {
                    [chiave]: Number(value)
                }
                formData.push(obj)
                console.log(formData)
            }
        }
    }
    contabilita(data)

    fetch('http://localhost:3000/update-contabilita', {
            method:'POST',
            headers: { 'Content-Type': 'application/json'},
            body:JSON.stringify(formData)
        }).then((res) => {
            return res.json();
        }).then((data) => {
            console.log('data', data);
        }).catch(function(err){
            console.log(err)
        })
};

exports.inviaResto = (data) => {
    let formData = []

    function contabilita(data) {
        for (const [key, value] of Object.entries(data)) {
            console.log(`chiave : valore > ${key} : ${value}`);
            let chiave = key
            let push = false
            if(key == 'resto_scontrino' && value > 0){
                chiave = 'resto_scontrino'
                push = true
            }
            if(key == 'resto_moneta' && value > 0){
                chiave = 'resto_moneta'
                push = true
            }
            if(key == 'resto_totale' && value > 0){
                chiave = 'resto_totale'
                push = true
            }
            if(push) {
                let obj = {
                    [chiave]: Number(value)
                }
                formData.push(obj)
                console.log('formData',formData)
            }
        }
    }
    contabilita(data)

    fetch('http://localhost:3000/update-contabilita', {
            method:'POST',
            headers: { 'Content-Type': 'application/json'},
            body:JSON.stringify(formData)
        }).then((res) => {
            return res.json();
        }).then((data) => {
            console.log('data', data);
        }).catch(function(err){
            console.log(err)
        })

};