
const endpoint = require('../../endpoints');
const modalClass = require('../../classes/Modal.class');

window.addEventListener("load", function() {

            window.annullaTicket = (id_ticket) => {

                let obj = {id_ticket:id_ticket}

                 let checkAnnulla = () => {
                    fetch('/ticket/remove/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(obj)
                    }).then(e => e.json()).then(data => {
                        location.reload();
                    })
                }


                if(id_ticket){
                   new modalClass('Select','MESSAGGIO','Annullare il ticket? N.B. Il ticket non sarà più utilizzabile', checkAnnulla);
                   
                }

               

            }

});