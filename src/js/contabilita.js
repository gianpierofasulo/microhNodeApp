const modalClass = require('../../classes/Modal.class');

window.addEventListener("load", function() {
     window.resetContabilita = async () => {
        console.log('resetContabilita');
        
        try {
            let azzera = async () => {
                let res = await fetch('/contabilita/reset');
                location.reload();
            }

            new modalClass('Select','MESSAGGIO','Selezionare conferma per azzerare contabilita', azzera);
            
            //location.reload();
        } catch (e) {
            console.log('err. resetContabilita', e)
        }
    }
   
});

