// JSDoc

require('dotenv').config()
const QRCode = require('qrcode')

if(process.env.PRINTER == 1) {
    
    // importazione del modulo receipt
    const receipt = require('./receipt.js');

    /**
     * Il modulo si occupa della generazione di un qrcode in maniera dinamica.<br>
     * I dati che vengono stampati vengono passati come parametri nella callback del modulo create.
     * @module qrcode
     * 
     */

    /**
     * Creazione dell'immagine relativa al qrcode e, se in produzione, stampa dello scontrino:
     * @param {Number} contanti - credito inserito
     * @param {Number} prezzo - prezzo
     * @param {Number} resto - resto
     * @param {Number} resto_scontrino - resto in scontrino
     * @param {Number} resto_moneta - resto in moneta
     * @param {*} ticket - dati del ticket
     * 
     */
    exports.create = (contanti, prezzo, resto, resto_scontrino, resto_moneta, ticket) => {

        // Creazione di data
        let data = {...ticket}

        // Conversione dei dati in formato stringa
        let stringdata = JSON.stringify(data)

        /**
         * Stampa il qrcode a terminale
         * @function toDataURL
         * 
         */
        QRCode.toString(stringdata,{type:'terminal'}, function (err, QRcode) {
            if(err) return console.log("error occurred")
            // console.log(QRcode)
        })

        /**
         * Converte data in base64
         * @function toDataURL
         * 
         */
        QRCode.toDataURL(stringdata, function (err, code) {
            if(err) return console.log("error occurred")
            // console.log(code)
        })

        /**
         * Converte data in una immagine PNG
         * @function toFile
         * 
         */
        QRCode.toFile('mqtt/qrcode.png', stringdata, {
            color: {
            dark: '#000',   // punti neri qrcode
            light: '#fff'   // sfondo bianco qrcode
            }
        }, function (err) {
            if (err) throw err

            if(process.env.DEBUG == 1) {
                console.log('\n[ ------------------------------------------------------ ]');
                console.log('[ @qrcode.js > QRCode.toFile() > QR code creato!');
                console.log('[ ------------------------------------------------------ ]\n');
            }

            // se in produzione genero lo scontrino
            if(process.env.NODE_ENV == 'production') {
                receipt.print(contanti, prezzo, resto, resto_scontrino);
            }
        })
    };
}