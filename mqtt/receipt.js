// JSDoc

require('dotenv').config()

if(process.env.PRINTER == 1) {

    /**
     * Generazione di uno scontrino in maniera dinamica.<br>
     * I dati che vengono stampati vengono recuperati dalla pagina `stampe` nel manager. 
     * @module receipt
     * 
     */

    /**
     * Stampa dello scontrino tramite caricamento immagine QR code e compilazione dati tramite pagina `stampe`:
     * @param {Number} contanti - credito inserito
     * @param {Number} prezzo - prezzo
     * @param {Number} resto - resto
     * @param {Number} scontrino - credito rimanente
     * 
     */
    exports.print = (contanti, prezzo, resto, scontrino) => {
        
        const escpos = require('escpos');                                           // importazione del pacchetto escpos
        const path = require('path');                                               // importazione del pacchetto path
        escpos.USB = require('escpos-usb');                                         // importazione del pacchetto escpos-usb
        const device  = new escpos.USB();                                           // creazione nuova istanza di escpos.USB()
        const printer = new escpos.Printer(device);                                 // creazione nuova istanza di Printer()
        const qrcode = path.join(__dirname, 'qrcode.png');                          // percorso dell'immagine qrcode.png
        const configController = require('../controllers/config.controller');       // importazione del modulo config.controller
        const config = configController.getConfig('all');                           // lettura delle configurazione
        const stampe = config.stampe[0];                                            // lettura delle stampe da config

        /**
         * Creazione dello scontrino da stampare:
         * tramite la funzione escpos.Image.load() è possibile caricare l'immagine da stampare;
         * tramite la funzione device.open() è possibile chiamare la printer e stampare i dati desiderati;
         * 
         * @function load
         * 
         */
        escpos.Image.load(qrcode, function(image){
            device.open(function(){
                printer
                    .font('B')
                    .align('CT')
                    .size(1, 1)
                    .text('------------------------')
                    .newLine()
                    .newLine()
                    .text(`${stampe.esercente}`)
                    .text(`${stampe.indirizzo}`)
                    .text(`${stampe.localita}`)
                    .text(`TEL: ${stampe.telefono}`)
                    .newLine()
                    .newLine()
                    .text('------------------------')
                    .align('RT')
                    .newLine()
                    .newLine()
                    .text(`${stampe.testo_contanti}: ${parseFloat(contanti / 100).toFixed(2)}  `)
                    .text(`${stampe.testo_prezzo}: ${parseFloat(prezzo / 100).toFixed(2)}  `)
                    .text(`${stampe.testo_resto}: ${parseFloat(resto / 100).toFixed(2)}  `)
                    .text(`${stampe.testo_credito_rimanente}: ${parseFloat(scontrino / 100).toFixed(2)}  `)
                    .newLine()
                    .newLine()
                    .text('------------------------')
                    .align('CT')
                    .newLine()
                    .text(`${stampe.testo_generico1}`)
                    .newLine()
                    .text(`${stampe.testo_generico2}`)
                    .text(`${stampe.testo_generico3}`)
                    .text(`${stampe.testo_generico4}`)
                    .newLine()
                    .text('------------------------')
                    .newLine()
                    .newLine()
                    .newLine()
                    .image(image, 'd24')
                    .then(() => { 
                        printer.newLine().newLine().newLine().newLine().newLine().cut().close(); 
                    });
            });
        });
    };
}