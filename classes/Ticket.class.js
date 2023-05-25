
const JSONStore = require('./JsonStore.class');
const UtilsClass = require('./Utils.class');
const TICKET_FILE = './public/data/contabilita/tickets.json';
const configController = require('../controllers/config.controller');
const config = configController.getConfig('all');

class Ticket {

    constructor(Transaction) {

            //Contabilita generale
            this.id = Transaction.id;
            this.enabled = true;
            this.credito = Transaction.resto_scontrino;
            this.date = new Date();
            this.validity = this.addWeeks(config.generali[0].validita_ticket_settimane);
            this.type = 'ticket_microhard';
            if(this.credito > 0){
                this.saveTicket();
            }
            
    }

    addWeeks(weeks) {
        let newdate = new Date();
        newdate.setDate(newdate.getDate() + 7 * weeks);
        console.log(weeks);
        console.log(newdate);
        return newdate
    }


    saveTicket(){
        const tickets_file = new JSONStore(TICKET_FILE);
        const tickets = tickets_file.read();

        let ticket_esistente = tickets.find(e => e.id == this.id);

        if(!ticket_esistente){
            let obj = {
                id: this.id,
                enabled: this.enabled,
                credito:this.credito,
                date: this.date,
                validity: this.validity,
                type: this.type
            }
            tickets.push(obj);
           
        }

        tickets_file.write(tickets);

    }
    static checkValidityTicket(ticket){
        const tickets_file = new JSONStore(TICKET_FILE);
        const tickets = tickets_file.read();

        let ticket_esistente = tickets.find(e => e.id == ticket.id);


        if(ticket_esistente){
            if(ticket_esistente.enabled == true){
               let data_odierna = new Date();
                let date_validita = new Date(ticket.validity);
                if(date_validita.getTime() >= data_odierna.getTime()){
                    ticket_esistente.enabled = false;
                    tickets_file.write(tickets);
                    return true;
                }else{
                    return 'Ticket scaduto';
                } 
            }else{
                return 'Ticket non valido';
            }
            

        }else{
            return 'Ticket non esistente';
        }


    }

    

}



module.exports = Ticket;


