// TODO: eliminare

const fs = require('fs');
const qrcode = require('../qrcode.js');

/**
 * Represents a receipts.
 * @param {*} contanti 
 * @param {*} prezzo 
 * @param {*} resto 
 * @param {*} scontrino 
 */
exports.print = (contanti, prezzo, resto, scontrino) => {
  
let newData = 
`----------------------------

        MICROHARD srl
      Via dei Platani 7
       Cesenatico (FC)

----------------------------


            CONTANTI: \u20ac ${parseFloat(contanti / 100).toFixed(2)}
              PREZZO: \u20ac ${parseFloat(prezzo / 100).toFixed(2)}
               RESTO: \u20ac ${parseFloat(resto / 100).toFixed(2)}
   CREDITO RIMANENTE: \u20ac ${parseFloat(scontrino / 100).toFixed(2)}


----------------------------

          SCONTRINO
        NON FISCALE

      UTILIZZARE QRCODE
        PER UN NUOVO
          ACQUISTO

----------------------------








${' '}
`

  fs.writeFile("scontrino.txt", newData, (err) => {
      if (err) console.log(err);
      console.log("Successfully Written to File.");
  });
}; 