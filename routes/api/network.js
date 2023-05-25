const express = require('express')
const router = express.Router()
const NetworkController = require('../../controllers/network.controller');
let bodyParser = require('body-parser');
// parse application/json
router.use(bodyParser.json());
const Downloader = require("nodejs-file-downloader");
const endpoint = require('../../endpoints');
const fileSystem = require("fs")
router.post("/update-network", function(req, res) {
    if(req.body) {
        let upd = NetworkController.setNetwork(req.body);
        if(upd){
            res.status(200).send(upd);
        }
    }

});

// download file selezionato
router.post("/download-file", function(req, res) {
 
     if(req.body) {
        const body = req.body
        let url = body[0].url;

        (async () => {
            //mettendo tutto in una async function, si riesce a gestire l'attesa per il download del file
          
            const downloader = new Downloader({
              url: url, //file name/URL/PATH 
              directory: "public/media/", //Cartella di destinazione se inesistente viene creata
              cloneFiles: false
            });
            try {
              const {filePath,downloadStatus} = await downloader.download(); 
          
              // mi serve per chiudere la richiesta altrimenti resta in pending la promise
              res.status(200).send('{"msg": "ok"}');
              
            } catch (error) {
              //si possono gestire eventualmente gli status codes tipo 400 o similari.
              console.log("Download failed", error);
            }
          })();   
     }
    
 });

 // leggo il file selezionato dall'utente e restituisco il contenuto del JSON selezionato
router.post("/carica-file-json", function(req, res) {
  
  let cartellalocale = "public/data/";
  
  if(req.body) {
     let body = req.body
     let nomefile = body[0].nomefile;

     if (nomefile == 'canali_A.json') {
        cartellalocale += 'canali/'
     } else if ( nomefile == 'contabilita.json' || nomefile == 'contabilita_motori.json'  || nomefile == 'tickets.json' ) {
        cartellalocale += 'contabilita/'
    } else if ( nomefile == 'log.json' ) {
      cartellalocale += 'logs/'
  }
     
     // in base al nome file leggo il file JSON
     const content = fileSystem.readFileSync( cartellalocale + nomefile, 'utf8' );

     console.log('FILE JSON', content)

    if (content) {
      // return content;
      res.status(200).send( JSON.stringify(content) );
    }

    } //END req body
});

 // download file JSON dal CLOUD ****************************************
router.post("/download-file-json", function(req, res) {
 
  if(req.body) {
     const body = req.body
     let url = body[0].url;

     (async () => {
         //mettendo tutto in una async function, si riesce a gestire l'attesa per il download del file
       
         const downloader = new Downloader({
           url: url, //file name/URL/PATH 
           directory: "public/data/", //Cartella di destinazione 
           cloneFiles: false
         });
         try {
           const {filePath,downloadStatus} = await downloader.download(); 
       
           // mi serve per chiudere la richiesta altrimenti resta in pending la promise
           res.status(200).send('{"msg": "ok"}');
           
         } catch (error) {
           //si possono gestire eventualmente gli status codes tipo 400 o similari.
           console.log("Download failed", error);
         }
       })();   
  }
 
});

 // delete file from machine
 router.post("/cancella-file", function(req, res) {
 
    if(req.body) {
        NetworkController.cancellaFile(req.body);     
         return  res.status(200).send('{"msg": "ok"}');
         
    }
    
});

// va a vedere tramite il loadNetwork se nel file si sistema se il DHCP è yes oppure no
router.get("/load-network", function(req, res) {
    let upd = NetworkController.loadNetwork(req.body);
    if(upd){
        res.status(200).send(upd);
    }
 
 });


module.exports = router;
