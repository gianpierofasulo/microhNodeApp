// TODO: eliminare

const fs = require('fs');
var toFixed = require('tofixed');

// ****************************************
// ****************************************

var checkFile = () => {
    try {
        var noteString = fs.readFileSync('./vm/contabilita.json', null,JSON.stringify(0));
        return JSON.parse(noteString);
    } catch (e) {
        if(process.env.DEBUG) {
            console.log('No file, creating new file for money in the machine!');
        }
        fs.writeFileSync('./vm/contabilita.json', JSON.stringify(0));
    }
};

var leggiCredito = () => {
    let rawdata = fs.readFileSync('./vm/contabilita.json');
    if(process.env.DEBUG) {
        console.log('@@@ moneyHandler > contabilita > ',JSON.parse(rawdata));
    }
    return JSON.parse(rawdata)
}

var salvaCredito = (money) => {

    // prendo dati da socket
    money = JSON.parse(money);
    console.log('@@@ moneyHandler > money > ',money);
    
    // prendo dati da file
    contabilita = leggiCredito();
    // console.log('credito',credito);
    
    // sommo dati da socket a dati da file
    let creditoNew;
    if(contabilita && money) {
        creditoNew = {
            contabilita : [
                {
                    guadagno: Number(contabilita.contabilita[0].guadagno) + Number(money.prezzo),
                    incasso : Number(contabilita.contabilita[0].incasso) + Number(money.incasso),
                    resto_scontrino: 0,
                    resto_moneta: 0,
                    resto_totale: Number(contabilita.contabilita[0].resto_totale) + Number(money.resto)
                }
            ]
        }
        // creditoNew = {
        //     venduto: Number(credito.guadagno) + Number(money.prezzo),
        //     incassato : Number(credito.incasso) + Number(money.incasso),
        //     resto: Number(credito.resto_totale) + Number(money.resto)
        // }
    }
    console.log('@@@ moneyHandler > creditoNew > ', creditoNew);

    // scrivo nel file i nuovi dati
    let data = JSON.stringify(creditoNew);
    fs.writeFileSync('./vm/contabilita.json', data);
}

module.exports = {
    checkFile,
    leggiCredito,
    salvaCredito
};