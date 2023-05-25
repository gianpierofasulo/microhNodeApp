const {
    fetchData
} = require('./config');
const endpoint = require('../../endpoints');
const modalClass = require('../../classes/Modal.class');
import KioskBoard from 'kioskboard';



// Initialize KioskBoard (default/all options)

KioskBoard.init({
  keysArrayOfObjects: [
        {
            "0": "Q",
            "1": "W",
            "2": "E",
            "3": "R",
            "4": "T",
            "5": "Y",
            "6": "U",
            "7": "I",
            "8": "O",
            "9": "P"
        },
        {
            "0": "A",
            "1": "S",
            "2": "D",
            "3": "F",
            "4": "G",
            "5": "H",
            "6": "J",
            "7": "K",
            "8": "L"
        },
        {
            "0": "Z",
            "1": "X",
            "2": "C",
            "3": "V",
            "4": "B",
            "5": "N",
            "6": "M"
        }
    ],
  keysSpecialCharsArrayOfStrings: ["#", "€", "%", "+", "-", "*","@","|"],
  keysNumpadArrayOfNumbers: null,
  language: 'en',
  theme: 'dark',
  autoScroll: true,
  capsLockActive: true,
  allowRealKeyboard: true,
  allowMobileKeyboard: false,
  cssAnimations: true,
  cssAnimationsDuration: 360,
  cssAnimationsStyle: 'slide',
  keysAllowSpacebar: true,
  keysSpacebarText: 'Space',
  keysFontFamily: 'sans-serif',
  keysFontSize: '22px',
  keysFontWeight: 'normal',
  keysIconSize: '25px',
  keysEnterText: 'Enter',
  keysEnterCallback: undefined,
  keysEnterCanClose: true,
});

let init = document.getElementsByClassName('js-kioskboard-input');

if(init.length > 0){
   KioskBoard.run('.js-kioskboard-input'); 
}

window.addEventListener("load", function() {

fetchData().then((data) => {

    window.autentica = (form_id) => {
           
        let form_login = document.getElementById(form_id);
        let formData = [];
        let formDataCloud = new FormData();
        let user = ''
        let password = ''
        
        for(let field of form_login){
            let name = field.getAttribute('name');
            if ( name == 'user'){ 
                 user = field.value
            }
            if ( name == 'password'){ 
                 password = field.value
            }

 
        } // END for fields
       
            if ( user == '' || password =='' ) {
                modal = new modalClass('Alert','MESSAGGIO','DATI INCOMPLETI');
            } else {
                    // Preparo i dati in post per auth da cloud
                    formDataCloud.append('indirizzo_email', user);
                    formDataCloud.append('password', password);
                   

                    fetch( endpoint.LOGIN.API_CLOUD, { 
                        method: "POST",
                        body: formDataCloud
                    })
                        .then( response => {
                            let jwt = ''
                            response.json().then( (data) => {
                                    // Risposta in caso di errore di autenticazione in CLOUD
                                       let ripostaCloud =  data.risposta
                                    // RIsposta in caso di autenticazione corretta in CLOUD   
                                    if (jwt) {
                                        jwt = data[0].JWT
                                    }
                                       console.log('RISPOSTA DA CLOUD -> ', data);
                            
                                        if ( ripostaCloud == 'KO') {
                                            // PROVA IN LOCALE *************************************
                                            // form data autenticazione locale
                                                            let obj = {
                                                                user : user,
                                                                password: password
                                                            }
                                                    // fare fetch per autenticazione
                                                    formData.push(obj);

                                                    fetch('/service/authenticate', { 
                                                        method:'POST',
                                                        headers: {
                                                            'Content-Type': 'application/json',
                                                        },
                                                        body: JSON.stringify(formData)

                                                    }).then((res) => {  
                                                        console.log('RES --------------> ', res)
                                                        return res.json();
                                                    
                                                        
                                                    }).then((data) => {
                                                    
                                                        console.log('data  return = ', data);
                                                        if ( data.msg == 'OK') {
                                                            
                                                            location.href = "/service"
                                                        } else {
                                                           new  modalClass('Alert','MESSAGGIO','AUTENTICAZIONE FALLITA!');
                                                        }
                                                        
                                                    
                                                    }).catch(function(err){
                                                        
                                                          new  modalClass('Alert','MESSAGGIO','ERRORE ' + err);
                                                        
                                                    })

                                        } else  {
                                            // console.log('TOKEN = ', jwt)
                                            location.href = "/service"
                                        }

                                    }
                                )                           
                           
                        }).catch(function(err){
                            console.log('ERRORE GET API URL -> ' , err)
                                    // PROVA IN LOCALE *************************************
                                            // form data autenticazione locale
                                            let obj = {
                                                user : user,
                                                password: password
                                            }
                                            // fare fetch per autenticazione
                                            formData.push(obj);

                                            fetch('/service/authenticate', { 
                                                method:'POST',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                },
                                                body: JSON.stringify(formData)

                                            }).then((res) => {  
                                                console.log('RES --------------> ', res)
                                                return res.json();
                                            
                                                
                                            }).then((data) => {
                                            
                                                console.log('data  return = ', data);
                                                if ( data.msg == 'OK') {
                                                    
                                                    location.href = "/service"
                                                } else {
                                                    new modalClass('Alert','MESSAGGIO','AUTENTICAZIONE FALLITA!');
                                                }
                                                
                                            
                                            }).catch(function(err){
                                                
                                                   new modalClass('Alert','MESSAGGIO','ERRORE ' + err);
                                                
                                            })
                        })
            
            }
   
    }

    // funzione che scarica file da CLOUD e ricopre JSON locale
    window.downloadjsondacloud = (form_id) => {

        let form_config = document.getElementById(form_id);
        let formData = [];
        let id_esercente = data.id_esercente;
        let divMessaggio = document.getElementById('messaggio');
        divMessaggio.classList.remove("d-none");

        for (let field of form_config) {
            let name = field.getAttribute('name');
            let checkbox = field.checked;

            if (name == 'nomefile' && checkbox == true) {

                let nomefile = field.value;
                const targetFile = nomefile
                // ATTENZIONE SUL SERVER FUNZIONA SOLO IN HTTPS - 
                const url = 'http://localhost/microhard_git/microhard-cms/public/jsontomachine/banner/4/01568899/' + nomefile
                // const url = 'https://microhard.ximplia.it/public/media/' + id_esercente + '/' + nomefile

                let obj = {
                    url: url,
                    targetFile: targetFile
                }

                formData.push(obj);

                fetch('/download-file-json', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)

                }).then((res) => {
                    console.log('RES --------------> ', res)
                    return res.json();


                }).then((data) => {

                    console.log('data download return = ', data.msg);
                    if (data.msg == 'ok') {
                        //alert ('File caricato correttamente')
                        new modalClass('Alert', 'MESSAGGIO', 'File SCARICATO correttamente');
                        // devo wrappare il reload in una funzione altrimenti il reload avviene presto e non si vede la modale
                        setTimeout(function() {
                            location.reload();
                        }, 2000)
                    }


                }).catch(function(err) {

                    // alert ('Errore DOWNLOAD' + err);
                    new modalClass('Alert', 'MESSAGGIO', 'ERRORE CARICAMENTO ' + err);

                })

            }
        }


    }

       // funzione che carica file SUL CLOUD
       window.caricajsondsuloud = (form_id) => {
        // console.log("DATI di data = ", data)
       
         let form_config = document.getElementById(form_id);
         let formData = [];
         let formDataNew = [];
         let id_esercente = data.id_esercente;
         let id_macchina = data.id_macchina;
         
         //let matricola = data.matricola;
         let divMessaggio = document.getElementById('messaggio');
         divMessaggio.classList.remove("d-none");
 
         for (let field of form_config) {
             let name = field.getAttribute('name');
             let checkbox = field.checked;
             let nomefile = '';
            
             if (name == 'nomefilelocale' && checkbox == true) {
             
                 nomefile = field.value
                
                 let obj = {                    
                     nomefile: nomefile
                 }
 
                 formData.push(obj);
 
                 fetch('/carica-file-json', {
                     method: 'POST',
                     headers: {
                         'Content-Type': 'application/json',
                     },
                     body: JSON.stringify(formData)
 
                 }).then((res) => {
                     console.log('RES --------------> ', res)
                     return res.json();
 
                 }).then((data) => {
 
                     console.log('DATI JSON DI RITORNO = ',  data );
                    
                     let obj2 = {
                         jsondata: data,
                         id_utente: id_esercente,
                         id_macchina: id_macchina
                     }
               
                     formDataNew.push(obj2);
                        // console.log('DATI IN POST ----> ',  obj2 );
                        let EndPointRichiesto = '';
                        // URL ENDPOINT
                        const URL_base = endpoint.ENDPOINT_JSON_CLOUD;
                        if (nomefile == 'banner.json') {
                              EndPointRichiesto = '/api/json_banner.php';
                         } else if ( nomefile == 'canali_A.json') {
                              EndPointRichiesto = '/api/json_canali_A.php';
                         } else if ( nomefile == 'catalogo.json') {
                            EndPointRichiesto = '/api/json_catalogoesercente.php';
                        } else if ( nomefile == 'config.json') {
                            EndPointRichiesto = '/api/json_config.php';
                        } else if ( nomefile == 'network.json') {
                            EndPointRichiesto = '/api/json_network.php';
                        } else if ( nomefile == 'contabilita.json') {
                            EndPointRichiesto = '/api/json_contabilita.php';
                        } else if ( nomefile == 'contabilita_motori.json') {
                            EndPointRichiesto = '/api/json_contabilita_motori.php';
                        }  else if ( nomefile == 'tickets.json') {
                            EndPointRichiesto = '/api/json_tickets.php';
                        }  else if ( nomefile == 'log.json') {
                            EndPointRichiesto = '/api/json_log.php';
                        }  else if ( nomefile == 'catalogo_generale.json') {
                            EndPointRichiesto = '/api/json_catalogo.php';
                        } else if ( nomefile == 'vetrina.json') {
                            EndPointRichiesto = '/api/json_vetrina.php';
                        } else if ( nomefile == 'categorie.json') {
                            EndPointRichiesto = '/api/json_vetrina_categorie.php';
                        }

                        console.log('nomefile ', nomefile);
                        let URL = URL_base + EndPointRichiesto;
                     
                         fetch(URL , {
                           method: 'POST',
                           headers: {
                               'Content-Type': 'application/json',
                           },
                           body: JSON.stringify(formDataNew)
               
                           }).then((res) => {
                                 console.log('RES server --------------> ', res )
                             
                                 return res.json();
               
                             }).then((data) => {
               
                               console.log('Risposta server = ', data);
 
                               if (data.risposta == 'ok') {
                                 // this.alert('DONLOAD COMPLETATO!! ')
                                 divMessaggio.classList.add("d-none");
                                 new modalClass('Alert', 'MESSAGGIO', 'CARICAMENTO SU CLOUD COMPLETATO ');
                                 setTimeout(function() {
                                    location.reload();
                                }, 3000)
                               }
                              
                           }).catch(function(err) {
                                 // console.log( 'Errore DOWNLOAD -> ' + err )
                                 new modalClass('Alert', 'MESSAGGIO', 'ERRORE CARICAMENTO ' + err);
               
                           })
 
                 }).catch(function(err) {
 
                      alert ('Errore DOWNLOAD' + err);
                     //new modalClass('Alert', 'MESSAGGIO', 'ERRORE CARICAMENTO ' + err);
 
                 })
 
             }
         }
 
 
     }

    window.caricamediatomachine = (form_id) => {

        let form_config = document.getElementById(form_id);
        let formData = [];
        let id_esercente = data.id_esercente
        let divMessaggio = document.getElementById('messaggio');
        divMessaggio.classList.remove("d-none");

        for (let field of form_config) {
            let name = field.getAttribute('name');
            let checkbox = field.checked;

            if (name == 'nomefile' && checkbox == true) {

                let nomefile = field.value;
                const targetFile = nomefile
                // ATTENZIONE SUL SERVER FUNZIONA SOLO IN HTTPS - 
                // const url = 'http://localhost/microhard_git/microhard-cms/public/media/' + id_esercente + '/' + nomefile
                const url = 'https://microhard.ximplia.it/public/media/' + id_esercente + '/' + nomefile

                let obj = {
                    url: url,
                    targetFile: targetFile
                }

                formData.push(obj);

                fetch('/download-file', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)

                }).then((res) => {
                    console.log('RES --------------> ', res)
                    return res.json();


                }).then((data) => {

                    console.log('data download return = ', data.msg);
                    if (data.msg == 'ok') {
                        //alert ('File caricato correttamente')
                        new modalClass('Alert', 'MESSAGGIO', 'File caricato correttamente');
                        // devo wrappare il reload in una funzione altrimenti il reload avviene presto e non si vede la modale
                        setTimeout(function() {
                            location.reload();
                        }, 2000)
                    }


                }).catch(function(err) {

                    // alert ('Errore DOWNLOAD' + err);
                    new modalClass('Alert', 'MESSAGGIO', 'ERRORE CARICAMENTO ' + err);

                })

            }
        }


    }


    window.cancellafile = (form_id) => {

        let form_config = document.getElementById(form_id);

        let formData = [];

        for (let field of form_config) {
            let name = field.getAttribute('name');

            // let checkbox = field.checked;

            if (name == 'nomefilelocale') {

                let nomefile = field.value;

                let obj = {
                    targetFile: nomefile
                }

                formData.push(obj);

                fetch('/cancella-file', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)

                }).then((res) => {
                    console.log('RES', res)
                    //return res.json();
                }).then((data) => {
                    console.log('data = ', data);
                }).catch(function(err) {
                    alert('Errore DELETE' + err);
                })

            }
        }
        // Ricarico la pagina
        location.reload()

    }

    window.saveConfig = (form_id, file) => { // Chek se IP VALIDI

        //console.log(form_id)
        //le chiavi del form devono essere uguali alle chiavi di scrittura su json
        let form_config = document.getElementById(form_id);
        let formData = [];
        for (let field of form_config) {
            let name = field.getAttribute('name');
            let key_config = field.getAttribute('data-config');
            // console.log('name = ' + name + ' -> key_config -> ' + key_config) 
            if (name) {
                let val = field.value;
                // Tolgo eventuali spazi che potrebbero dare problemi
                if (val == '1' || val == '0') Number(val); //per gestire il checkbox

                let obj = {
                    [name]: val,
                    type: key_config,
                    //file: 'config.json'
                    file: file + '.json'
                }

                formData.push(obj);
            }
        }

        console.log(formData)

        console.log('SaveConfig -> JSON.stringify(formData)', JSON.stringify(formData))

        //console.log(formData)
        //fetch(endpoint.APP_ADDRESS +'/update-config', { // scrive in network

        let save = () =>{

            fetch('/update-config', { // scrive in network
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)

        }).then((res) => {
            return res.json();

        }).then((data) => {
            //console.log('data', data);
            console.log('data', data);
            if (data.msg == 'JSON data is saved.') {
                location.reload();
            }

        }).catch(function(err) {

            //alert ('Errore salvataggio');
            //new modalClass('Alert', 'ERRORE', 'ERRORE - Salvataggio')
            console.log(err)

        })

        }

        new modalClass('Select', 'MESSAGGIO', 'Salvare la configurazione?',save)


        

    }

});
});
