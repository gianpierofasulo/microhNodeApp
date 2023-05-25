const socketController = require('../../controllers/socket.controller')

window.addEventListener("load", function () {
    console.log('testperiferiche')

    function aggiorno(msg){
        let data = JSON.parse(msg);
        aggiornaDati(data);
    }

    socketController.stato_periferiche(aggiorno);

    let aggiornaDati = (data) => {
        console.log('data',data)

        // if(data.Alarms){
        //     // console.log(data.Alarms)
        //     for (let key of Object.keys(data.Alarms)){
        //         if (key != 'keyStatus' && key != 'ts'){
        //             let el = document.getElementById(key);
        //             let svg = el.querySelector('svg');
        //             if(data.Alarms[key] == 'alarmed'){
        //                 svg.classList.add('text-danger');
        //             }else{
        //                 svg.classList.remove('text-danger');
        //             } 
        //         }
        //     }
        // }
        // else if(data.CoinAcceptor){
        //     console.log('coin',data.CoinAcceptor)
        //     for (let key of Object.keys(data.CoinAcceptor)){
        //         if (key != 'channelsStatus' && key != 'ts'){
        //             let el = document.getElementById(key+'_coin');
        //             let svg = el.querySelector('svg');
        //             if(key == 'status') {
        //                 if(data.CoinAcceptor[key] == 'inactive' || data.CoinAcceptor[key] == 'disabled'){
        //                     svg.classList.add('text-danger');
        //                 }else{
        //                     svg.classList.remove('text-danger');
        //                 }
        //             } else if(key == 'error') {
        //                 if(data.CoinAcceptor[key] == 'sensor' || data.CoinAcceptor[key] == 'jammed'){
        //                     svg.classList.add('text-danger');
        //                 }else{
        //                     svg.classList.remove('text-danger');
        //                 }
        //             }
        //         }
        //     }
        // }
        // else if(data.BillValidator){
        //     console.log('bill',data.BillValidator)
        //     for (let key of Object.keys(data.BillValidator)){
        //         if (key != 'channelsStatus' && key != 'ts'){
        //             let el = document.getElementById(key+'_bill');
        //             let svg = el.querySelector('svg');
        //             if(key == 'status') {
        //                 if(data.BillValidator[key] == 'inactive' || data.BillValidator[key] == 'disabled'){
        //                     svg.classList.add('text-danger');
        //                 }else{
        //                     svg.classList.remove('text-danger');
        //                 }
        //             } else if(key == 'error') {
        //                 if(data.BillValidator[key] == 'sensor' || data.BillValidator[key] == 'jammed' || data.BillValidator[key] == 'stacker'){
        //                     svg.classList.add('text-danger');
        //                 }else{
        //                     svg.classList.remove('text-danger');
        //                 }
        //             }
        //         }
        //     }
        // }

    }
})