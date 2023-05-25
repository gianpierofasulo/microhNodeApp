const Utils = require('./Utils.class')
const ConfigController = require('../controllers/config.controller')
const config = ConfigController.getConfig('generali');
const JSONStore = require('./JsonStore.class')
const activeTransaction = './public/data/transaction/active-transaction.json';
const transactionList = './public/data/transaction/transaction-list.json';
const Logger = require('./Logger.class');
const ChannelController = require('../controllers/channels.controller');

/**
 * Sati della Transazione
 * 
 * New - Apertura
 * Pending - Inserimento denaro o scelta prodotto
 * Complete - Pagamento avvenuto
 * Cancelled - Annullamento transazione
 * 
 */

module.exports = class Transaction {
    
    constructor() {

        let transaction = this.initTransaction();
        return transaction;

    }


    checkTransaction = () => {
          let Store = new JSONStore(activeTransaction);
          let active = Store.read();
            if(process.env.DEBUG == 1 && process.env.DEBUG_TRANSACTION == 1) {
                console.log('@@ DATA FROM TRANSACTION',active);
            }
          
          if(active){
            return active;
          }else{
            if(process.env.DEBUG == 1 && process.env.DEBUG_TRANSACTION == 1) {
                console.log('@@ DATA FROM TRANSACTION',active);
            }
            return false;
            
          }
          
    }

    

    initTransaction(){

        let active_transaction = this.checkTransaction();
        
        console.log('active trans',active_transaction)

        if(active_transaction.id != null){
            this.id = active_transaction.id;
            this.date = active_transaction.date;
            this.matricola = active_transaction.matricola;
            this.prodotto = active_transaction.prodotto;
            this.prezzo_prodotto = active_transaction.prezzo_prodotto;
            this.canale = active_transaction.canale;
            this.state = active_transaction.state;
            this.totale = active_transaction.totale;
            this.incasso_banconote = active_transaction.incasso_banconote;
            this.incasso_monete = active_transaction.incasso_monete;
            this.incasso_pos = active_transaction.incasso_pos;
            this.incasso_cashless = active_transaction.incasso_cashless;
            this.incasso_scontrino = active_transaction.incasso_scontrino;
            this.resto_monete = active_transaction.resto_monete;
            this.resto_scontrino = active_transaction.resto_scontrino; 
        }else{
            console.log('new',active_transaction)
            const today = new Date();
            const date = today.toLocaleDateString('it-IT', { year: 'numeric', month: '2-digit', day: '2-digit' });
            this.date = date;
            this.id = 't-' + Utils.getTimestampInSeconds();
            this.matricola = config.matricola;
            this.prodotto = null;
            this.prezzo_prodotto = 0;
            this.canale = null;
            this.state = 'pending';
            this.totale = 0;
            this.incasso_banconote = 0;
            this.incasso_monete = 0;
            this.incasso_pos = 0;
            this.incasso_cashless = 0;
            this.incasso_scontrino = 0;
            this.resto_monete = 0;
            this.resto_scontrino = 0;
        }

        return this;
        
        
    }

    setState(state){
        this.state = state;
    } 

    setValues(cash,type){

        this.totale += cash;

        if(type == 'banconota'){
            this.incasso_banconote += cash;
        }
         if(type == 'cashless'){
            this.incasso_cashless += cash;
        }
        if(type == 'moneta'){
            this.incasso_monete += cash;
        }
        if(type == 'scontrino'){
            this.incasso_scontrino += cash;
        }

    }

    setChannel(canale){
        this.canale = canale;
    }
    setProduct(prodotto_id,prezzo_prodotto){
        this.prodotto = prodotto_id;
        this.prezzo_prodotto = prezzo_prodotto;
    }

    setResto(type,value){
        if(type == 'scontrino') this.resto_scontrino = value;
        if(type == 'monete') this.resto_monete = value;
    }

    saveTransaction(){

        const transaction = {
            id: this.id,
            matricola: this.matricola,
            state: this.state,
            totale: this.totale,
            date: this.date,
            prodotto :this.prodotto,
            prezzo_prodotto: this.prezzo_prodotto,
            canale: this.canale,
            incasso_banconote: this.incasso_banconote,
            incasso_monete: this.incasso_monete,
            incasso_pos :this.incasso_pos,
            incasso_cashless: this.incasso_cashless,
            incasso_scontrino: this.incasso_scontrino,
            resto_monete :this.resto_monete,
            resto_scontrino :this.resto_scontrino
        };

        let Store = new JSONStore(activeTransaction);
        Store.write(transaction);

        //Log
        const log = {
            id: this.id,
            state: this.state,
            icon: 'bi-cash-stack text-warning',
            description: 'Scrittura nuova transazione'
        }
        Logger.log('transaction',log);
        return transaction;

    }

    setState(state){
        this.state = state;
    }


    completeTransaction(){

        this.setState('complete');

        const transaction = {
            id: this.id,
            matricola: this.matricola,
            state: this.state,
            totale: this.totale,
            date: this.date,
            prodotto :this.prodotto,
            prezzo_prodotto : this.prezzo_prodotto,
            canale: this.canale,
            incasso_banconote: this.incasso_banconote,
            incasso_monete: this.incasso_monete,
            incasso_pos :this.incasso_pos,
            incasso_cashless: this.incasso_cashless,
            incasso_scontrino: this.incasso_scontrino,
            resto_monete :this.resto_monete,
            resto_scontrino :this.resto_scontrino
        };

        let StoreTransactions = new JSONStore(transactionList);
        let list = StoreTransactions.read();
        if(list){
            list.push(transaction);
            StoreTransactions.write(list);
        } else{
            list = [];
            list.push(transaction);
            StoreTransactions.write(list);

        } 

        //Svuoto active
        let Store = new JSONStore(activeTransaction);
        Store.write(null);


        //Log
        const log = {
            id: this.id,
            state: this.state,
            icon: 'bi-cash-stack text-success',
            description: `Transazione ${this.state}`
        }

        Logger.log('transaction',log);



        return this;

    }


    static lastTransaction(array){
        const lastTransaction = array[array.length - 1];
        return lastTransaction
    }




}
