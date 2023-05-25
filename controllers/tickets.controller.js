const fetch = require('node-fetch');
const fileSystem = require("fs")
const { promises: fsPromises } = require("fs");
const JSONStore = require('../classes/JsonStore.class.js');

exports.getTicket = (id) => {
    const ticketsFile = new JSONStore('./public/data/contabilita/tickets.json');
    const tickets = ticketsFile.read()
    return tickets.find(t => t.id == id)
};


exports.getTickets = () => {
    const ticketsFile = new JSONStore('./public/data/contabilita/tickets.json');
    tickets = ticketsFile.read()


    const tickets_mappati = tickets.map(t => {

        let data_odierna = new Date();
        let date_validita = new Date(t.validity);
        let date_emissione = new Date(t.date);

        let stato;
        let stato_message;
        let annullato;

        if(!(date_validita.getTime() >= data_odierna.getTime())){
            stato = 'scaduto';
            stato_message = 'Ticket scaduto';
            annullato = true;
        }else if (t.enabled == true){
            stato = 'valido';
            stato_message = 'Ticket valido';
            annullato = false;
        }else if (t.enabled == false){
            stato = 'non_valido';
            stato_message = 'Ticket utilizzato';
            annullato = true;
        }

        let formatted_validita = date_validita.toLocaleDateString("it-IT", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit"
        }) + " " + date_validita.toLocaleTimeString("it-IT", {
          hour: "2-digit",
          minute: "2-digit"
        });

        let formatted_emissione = date_emissione.toLocaleDateString("it-IT", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit"
        }) + " " + date_emissione.toLocaleTimeString("it-IT", {
          hour: "2-digit",
          minute: "2-digit"
        });

        return {
            id: t.id,
            enabled: t.enabled,
            stato: stato,
            stato_message: stato_message,
            emissione: formatted_emissione,
            scadenza: formatted_validita,
            credito: t.credito,
            type: t.type,
            annullato:annullato
        }
    })

    return tickets_mappati;

};

exports.annullaTicket = (body) => {
    let id_ticket = body.id_ticket;
    const ticketsFile = new JSONStore('./public/data/contabilita/tickets.json');
    const tickets = ticketsFile.read()
    let ticket = tickets.find(t => t.id == id_ticket)

    if(ticket.enabled === false){
       ticket.enabled = true; 
    }else{
        ticket.enabled = false; 
    }
    

    ticketsFile.write(tickets);

}

