
const { fetchData } = require('./config');
const modalClass = require('../../classes/Modal.class');
const endpoint = require('../../endpoints');



fetchData().then((data) => {

    window.connection = (idForm) => { 
        // Rimuovo modale da eventuali altri messaggi precedenti
        const element = document.getElementById('myModal');
        if (element) {
            element.remove();
        }
        let form_login = document.getElementById(idForm);
        let formData = new FormData();
        
        for(let field of form_login){
            //console.log('passo')
            let val = field.value;
            let name = field.getAttribute('name');
            formData.append(name, val);
        }
        console.log(formData);
        let classeFetch;
        fetch(endpoint.LOGIN.API_CLOUD, {
            method: "POST",
            body: formData
        })
            .then(response => {
                if(!response.ok){
                    throw Error(`Error: ${response.statusText}`);
                }               
                return response.json();//ritorna una promise
            })
            .then(json => {
                let messaggio = ''
                classeFetch = json;
                let JWT = ''
                //console.log(json.risposta)
                let autentica = json.risposta
                if ( autentica == 'ok') {
                //SALVO token JWT
                // console.log('TOKEN : ', classeFetch[0].JWT);
                JWT = classeFetch[0].JWT
                let formDati = [];
                let objJ = {
                    tokenjwt : JWT,
                    type: 'token',
                    file: 'token.json'
                   
                }
    
                formDati.push(objJ);
                
                 fetch(endpoint.APP_ADDRESS +'/update-config', {
                    method:'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formDati)
    
                }).then((res) => {
                    
                    return res.json();
                }).then((data) => {
                    //console.log('data', data);
                    
                }).catch(function(err){
                    //console.log(err)
                })
                } // END IF AUTENTICA
                else {
                    console.log('errore passw')
                    new modalClass('Alert','MESSAGGIO','Utente o password errata')
                    
                }
            })
            .catch(err =>{
                console.log(err);
            });
    }

    window.saveNetwork = (form_id,tipo) => { 
        // Rimuovo modale da eventuali altri messaggi precedenti
            const element = document.getElementById('myModal');
            if (element) {
                element.remove();
            }
        // Chek se IP VALIDI
        var pattern = /\b(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/;

        var inputCheck = document.getElementsByClassName("checkip");
        for (var i = 0; i < inputCheck.length; i++) {
            if (!pattern.test( inputCheck[i].value )) {
                alert ('IP ' + inputCheck[i].value + ' NON VALIDO')
                inputCheck[i].classList.add("alert");
                inputCheck[i].classList.add("alert-danger");
                return false;
            } else {
                inputCheck[i].classList.remove("alert");
                inputCheck[i].classList.remove("alert-danger");
            }     
        }

        //console.log(form_id)
        //le chiavi del form devono essere uguali alle chiavi di scrittura su json
        let form_config = document.getElementById(form_id);
        let formData = [];
        for(let field of form_config){
            let name = field.getAttribute('name');
            let key_config = field.getAttribute('data-config');
           // console.log('name = ' + name + ' -> key_config -> ' + key_config) 
            if(name){ 
                let val = field.value;
                let name_array = ['localIp_ip','netmask','gateway','dns_primario','dns_secondario']
                if(name_array.find(el => el == name)) val = val.replaceAll(' ','')
                // Tolgo eventuali spazi che potrebbero dare problemi
                if(val == '1' || val == '0') parseInt(val);//per gestire il checkbox
                let obj = {
                    [name] : val,
                    type: key_config,
                    //file: 'config.json'
                    file: tipo + '.json'
                }

                formData.push(obj);
            }
        }


        console.log('UpdateNetwork JSON.stringify(formData)', JSON.stringify(formData))

        // Salvo la config di RETE
        fetch('/update-network', { // scrive in network_system
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)

        }).then((res) => {
             return res.json();
        }).then((data) => {
            modale = ''
            if ( data.msg == 'JSON data is saved.') {
                // alert ('Salvataggio effettuato correttamente')
                new modalClass('Alert','MESSAGGIO','Salvataggio effettuato correttamente')
                
            }
            
        }).catch(function(err){
            console.log('------> ERRORE UPDATE NETWORK',err)
            new modalClass('Alert','ERRORE','ERRORE UPDATE NETWORK')
        })
        
    }

   

   return data;
});
