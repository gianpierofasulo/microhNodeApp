
const ChannelController = require('../controllers/channels.controller')
const JSONStore = require('./JsonStore.class.js');
const UtilsClass = require('./Utils.class.js');
const CONTABILITA_FILE = './public/data/contabilita/contabilita.json';
const CONTABILITA_MOTORI_FILE = './public/data/contabilita/contabilita_motori.json';

class Contabilita {

    constructor(Transaction) {

            //Contabilita generale
            this.incasso = Transaction.totale;
            this.incasso_monete = Transaction.incasso_monete;
            this.incasso_banconote = Transaction.incasso_banconote;
            this.incasso_cashless = Transaction.incasso_cashless;
            this.incasso_scontrino = Transaction.incasso_scontrino,
            this.incasso_pos = Transaction.incasso_pos;
            this.resto_scontrino = Transaction.resto_scontrino;
            this.resto_monete = Transaction.resto_monete;
            this.resto_totale = Transaction.resto_monete + Transaction.resto_scontrino;
            this.totale_venduto = Transaction.totale - this.resto_totale;
            this.motore = Transaction.canale;
            this.prodotto = Transaction.prodotto;
            this.prezzo_prodotto = Transaction.prezzo_prodotto;

            this.setContabilita();

            //Contabilita motori
            this.setContabilitaMotori();

    }




    setContabilita(){
        
        const contabilita_file = new JSONStore(CONTABILITA_FILE);
        const contabilita = contabilita_file.read();

        contabilita.incasso += this.incasso;
        contabilita.incasso_monete += this.incasso_monete;
        contabilita.incasso_banconote += this.incasso_banconote;
        contabilita.incasso_cashless += this.incasso_cashless;
        contabilita.incasso_pos += this.incasso_pos;
        contabilita.resto_scontrino += this.resto_scontrino;
        contabilita.resto_monete += this.resto_monete;
        contabilita.resto_totale += this.resto_totale;
        contabilita.totale_venduto += this.totale_venduto;
        contabilita.incasso_scontrino += this.incasso_scontrino;
        contabilita_file.write(contabilita);

    }


    setContabilitaMotori(){

        const contabilita_motori_file = new JSONStore(CONTABILITA_MOTORI_FILE);
        const motori = contabilita_motori_file.read();

        let prodotto = ChannelController.getProduct(this.prodotto);
        let channel = ChannelController.getChannel(this.motore);
        let price = 0
        let titolo = '';
        if(prodotto){
           price = this.prezzo_prodotto;
           titolo = prodotto.titolo; 
        } 
        if((this.motore != null) && (this.prodotto != null)){

            let motore = motori.find(e => e.motore == this.motore && e.prodotto == this.prodotto);
            if(motore){
                motore.incasso += price;
                motore.titolo_prodotto = titolo;
                motore.motore = this.motore;
                motore.alias = channel.alias;
                motore.prodotto = this.prodotto;
            }else{
                let obj = {
                    incasso: price,
                    titolo_prodotto: titolo,
                    motore:this.motore,
                    alias: channel.alias,
                    prodotto : this.prodotto
                }
                motori.push(obj);
            }

            contabilita_motori_file.write(motori);
        }

        

    }

    static resetContabilita(){
        let contabilita_file = new JSONStore(CONTABILITA_FILE);
        let contabilita = contabilita_file.read();

        Object.keys(contabilita).forEach((k, i) => {
            contabilita[k] = 0;
        });

        contabilita.azzeramento = UtilsClass.getDateCurrent();

        contabilita_file.write(contabilita);

        let contabilita_motori_file = new JSONStore(CONTABILITA_MOTORI_FILE);
        let contabilita_motori = contabilita_motori_file.read();
        contabilita_motori = [];
        contabilita_motori_file.write(contabilita_motori);

        return 'azzeramento'


    }

}



module.exports = Contabilita;


