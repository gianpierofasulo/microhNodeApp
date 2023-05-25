
const file_contabilita = './public/data/contabilita/contabilita.json';
const file_contabilita_motori = './public/data/contabilita/contabilita_motori.json';
const JSONStore = require('../classes/JsonStore.class.js');
const ContabilitaClass = require('../classes/Contabilita.class');
const modalClass = require('../classes/Modal.class');


exports.resetContabilita = () => {
        try {
            let reset = ContabilitaClass.resetContabilita();
            console.error(reset);
            return reset;

        } catch (err) {
            console.error(err);
            message = 'Azzeramento non riuscito'
        	return message;
        }

};

