const express = require('express')
const router = express.Router()
const endpoint = require('../../endpoints')
const request = require('request')
const path = require('path');
const fs = require('fs');
const formidable = require('formidable');
//const { usb, getDeviceList, findByIds, findBySerialNumber, WebUSBDevice } = require( 'usb');
const session = require('express-session');

//Controllers
const configController = require('../../controllers/config.controller.js')
const channelsController = require('../../controllers/channels.controller.js')
const bannerController = require('../../controllers/banner.controller.js')
const vetrinaController = require('../../controllers/vetrina.controller.js')
const ticketsController = require('../../controllers/tickets.controller.js')
const ipController = require('../../controllers/ip.controller.js')
const perifericheController = require('../../controllers/periferiche.controller.js')
const motori = perifericheController.getMotori();
const translateController = require('../../controllers/translate.controller.js')
const ChannelController = require('../../controllers/channels.controller');

//Classes
const JSONStore = require('../../classes/JsonStore.class.js');
const Logger = require('../../classes/Logger.class');
const Utils = require('../../classes/Utils.class');




// Funzione di Middleware per gestire la sessione per l'autenticazione
let sessionChecker = (req, res, next) => {
    console.log(`Session Checker: ${req.session.id}`);
    console.log(req.session);
    if (req.session.profile) {
        console.log(`Found User Session`);
        next();
    } else {
        console.log(`No User Session Found`);
        res.redirect('/service/login');
    }
};

// settagio della sessione
router.use(session({
    name: `daffyduck`,
    secret: 'ximplia-secret-session',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // This will only work if you have https enabled!
        maxAge: 60000 // 1 min
    }
}));

router.get('/logout', function (req, res) {
    console.log('LOGOUT', req.session)
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
        } else {

            res.redirect('/');
        }
    });

});

//Language
const lingue = translateController.getLanguages();
const getLanguage = function (req, res, next) {
    let lang_obj = translateController.getCurrentLanguage(req.current_lang);
    if (lang_obj) {
        req.language = lang_obj.current_lang;
        req.current_lang = lang_obj.lang;
    }
    next()
}

router.use(getLanguage);
if (process.env.DEBUG == 1) {
    console.log('\n[ ------------------------------------------------------ ]');
    console.log('[ @index.js > ambiente globale: ' + global.AMBIENTE + ' ]');
    console.log('[ ------------------------------------------------------ ]\n');
    console.log('\n[ ------------------------------------------------------ ]');
    console.log('[ @index.js > ambiente sviluppo: ' + global.IS_DEVELOPMENT + ' ]');
    console.log('[ ------------------------------------------------------ ]\n');
}

router.get('/', (req, res, next) => {
    let c = configController.getConfig('all');
    res.render('manager/index', {
        active: 'dashboard',
        current: 'dashboard',
        title: 'Manager',
        config: c.generali[0],
        ip: endpoint.IP_REMOTE,
        behavior: c.behavior[0],
        isDevelopment: global.IS_DEVELOPMENT
    })
})

//---------------- MENU PRIMO LIVELLO ----------------->

router.get('/general', (req, res, next) => {
    let c = configController.getConfig('all');

    res.render('manager/menu/general', {
        active: 'general',
        current: 'general',
        title: 'General',
        config: c.generali[0],
        ip: endpoint.IP_REMOTE,
        behavior: c.behavior[0],
        isDevelopment: global.IS_DEVELOPMENT
    })
})

router.get('/service', sessionChecker, (req, res, next) => {
    let c = configController.getConfig('all');
    // console.log(JSON.stringify(req.headers.referer));
    /*   let url = req.headers.referer
      if (url) {
          // prendo il referrer della pagina di provenienza che se diversa da login fa redirect al login
          let pagina = url.split("/").pop();
          console.log('PAGE = ', pagina);
          if (pagina == 'login') {
              res.render('manager/menu/service', {
                  active: 'service',
                  title: 'Service',
                  config: c.generali[0],
                  ip: endpoint.IP_REMOTE,
                  behavior: c.behavior[0],
                  isDevelopment: global.IS_DEVELOPMENT
              })
          } else {
              res.redirect('/service/login');
          }
      }  */

    res.render('manager/menu/service', {
        active: 'service',
        title: 'Service',
        current: 'service',
        config: c.generali[0],
        ip: endpoint.IP_REMOTE,
        behavior: c.behavior[0],
        isDevelopment: global.IS_DEVELOPMENT
    })



})

router.get('/activity', (req, res, next) => {
    let c = configController.getConfig('all');
    res.render('manager/menu/activity', {
        active: 'activity',
        title: 'Activity',
        current: 'activity',
        config: c.generali[0],
        ip: endpoint.IP_REMOTE,
        behavior: c.behavior[0],
        isDevelopment: global.IS_DEVELOPMENT
    })
})

router.get('/report', (req, res, next) => {
    let c = configController.getConfig('all');
    res.render('manager/menu/report', {
        active: 'report',
        title: 'Report',
        current: 'report',
        config: c.generali[0],
        ip: endpoint.IP_REMOTE,
        behavior: c.behavior[0],
        isDevelopment: global.IS_DEVELOPMENT
    })
})

router.get('/file-manager', (req, res, next) => {
    let c = configController.getConfig('all');
    res.render('manager/menu/file-manager', {
        active: 'file-manager',
        title: 'File Manager',
        current: 'file-manager',
        config: c.generali[0],
        ip: endpoint.IP_REMOTE,
        behavior: c.behavior[0],
        isDevelopment: global.IS_DEVELOPMENT
    })
})

router.get('/shop', (req, res, next) => {
    let c = configController.getConfig('all');
    res.render('manager/menu/shop', {
        active: 'shop',
        title: 'Shop',
        current: 'shop',
        config: c.generali[0],
        motori,
        ip: endpoint.IP_REMOTE,
        behavior: c.behavior[0],
        isDevelopment: global.IS_DEVELOPMENT
    })
})

router.get('/amministrazione', (req, res, next) => {
    let c = configController.getConfig('all');
    res.render('manager/menu/amministrazione', {
        active: 'amministrazione',
        title: 'Amministrazione',
        current: 'amministrazione',
        config: c.generali[0],
        ip: endpoint.IP_REMOTE,
        behavior: c.behavior[0],
        isDevelopment: global.IS_DEVELOPMENT
    })
})

//---------------------------------------->

//---------------- GENERAL ----------------->

router.get('/general/impostazioni', (req, res, next) => {
    let c = configController.getConfig('all');
    console.log('language', req.language)
    console.log('lingue', lingue)
    console.log('generali controller');
    console.log(c);
    res.render('manager/general/impostazioni', {
        active: 'general',
        title: 'Generali',
        current: 'impostazioni',
        lingue,
        lang: req.language,
        config_venditore: c.info_venditore[0],
        config: c.generali[0],
        isDevelopment: global.IS_DEVELOPMENT
    })
})


router.get('/general/gpio', (req, res, next) => {
    let ip = ipController.getCurrentIp();
    let c = configController.getConfig('all');
    const gpioStatus = perifericheController.getGpioStatus();
    // console.log('gpioStatus',gpioStatus)

    res.render('manager/general/gpio', {
        active: 'general',
        current: 'gpio',
        title: 'Controllo led',
        endpoint: endpoint,
        config: c.generali[0],
        ip,
        gpioStatus,
        isDevelopment: global.IS_DEVELOPMENT
    })
})

router.get('/general/stampe', (req, res, next) => {
    let c = configController.getConfig('all');
    res.render('manager/general/stampe', {
        active: 'general',
        current: 'stampe',
        title: 'Stampe',
        config_stampe: c.stampe[0],
        config: c.generali[0],
        ip: endpoint.IP_REMOTE,
        isDevelopment: global.IS_DEVELOPMENT
    })
})

router.get('/general/rete', (req, res, next) => {
    let c = configController.getConfig('all');
    let config_network = configController.getConfig('network');
    let config_network_system = configController.getConfig('network_system');
    res.render('manager/general/rete', {
        active: 'general',
        current: 'rete',
        title: 'Rete',
        config_network: config_network,
        config_network_system: config_network_system,
        config: c.generali[0],
        ip: endpoint.IP_REMOTE,
        isDevelopment: global.IS_DEVELOPMENT
    })
})

router.get('/general/syncjson', (req, res, next) => {
    let c = configController.getConfig('all');

    // Vedo listaq files in cartella media
    const directoryPath = path.join(__dirname, '../../public/data');

    const elencofiles = Utils.listafilescondata(directoryPath)
    // JSON IN CANALI
    const elencofilesCanali = Utils.listafilescondataInCartella(directoryPath + '/canali')
    // JSON IN CONTABILITA
    const elencofilesContabilita = Utils.listafilescondataInCartella(directoryPath + '/contabilita')
    // JSON IN LOGS
    const elencofilesLogs = Utils.listafilescondataInCartella(directoryPath + '/logs')

    const id_esercente = c.generali[0].id_esercente
    const matricola = c.generali[0].matricola

    const url = endpoint.LISTA_JSON + "?ide=" + id_esercente + '&matricola=' + matricola

    let listaFilesJSONCloud = ""

    // prendo la lista files dal CLOUD/CMS
    request({ url: url, json: true }, (error, response) => {
        //   console.log( response.body )
        if (error) {
            console.log('Problemi di connessione = ' + error)
        } else if (!response) {
            console.log('problemi lettura dati ')
        } else {
            listaFilesJSONCloud = response.body
        }


        res.render('manager/general/syncjson', {
            active: 'general',
            current: 'syncjson',
            title: 'Sync JSON',
            ip: endpoint.IP_REMOTE,
            isDevelopment: global.IS_DEVELOPMENT,
            listafileslocali: elencofiles,
            elencofilesCanali: elencofilesCanali,
            elencofilesContabilita: elencofilesContabilita,
            elencofilesLogs: elencofilesLogs,
            listaFilesJSONCloud: listaFilesJSONCloud
        })
    })


})

// -------------------------------------------->


//---------------- SHOP ----------------->

for (let i = 0; i < motori.length; i++) {
    if (motori[i].enabled == true) {
        router.get(`/shop/motori/${motori[i].group}`, (req, res, next) => {
            let canali = channelsController.getDynamicChannels(motori[i].group);
            let c = configController.getConfig('all');
            res.render(`manager/shop/motori`, {
                active: 'shop',
                current: 'motori',
                title: 'Motori',
                type: motori[i].group,
                config: c.generali[0],
                canali,
                ip: endpoint.IP_REMOTE,
                isDevelopment: global.IS_DEVELOPMENT
            })
        })
    }

}

router.get('/shop/vetrine', (_, res) => {
    const vetrine = vetrinaController.getVetrine(false);
    const directoryPath = path.join(__dirname, '../../public/assets/icons');
    const elencofiles = Utils.listafiles(directoryPath)
    const icons = elencofiles.filter(f => (/\.(gif|jpe?g|tiff?|png|webp|bmp|svg)$/i).test(f.name))
    console.log(icons)
    res.render('manager/shop/vetrine', {
        active: 'shop',
        current: 'vetrina',
        title: 'Vetrine',
        icons,
        vetrine,
        isDevelopment: global.IS_DEVELOPMENT
    })
})

router.get('/shop/vetrine/:id', (req, res) => {
    const id = req.params.id
    res.render('manager/shop/vetrina_digitale', {
        active: 'shop',
        current: 'vetrina',
        title: 'Vetrina',
        id_vetrina: id
    })
})

router.get('/shop/banner', (_, res, next) => {
    try {
        const banners = bannerController.getBanner();
        const directoryPath = path.join(__dirname, '../../public/media');
        const elencofiles = Utils.listafiles(directoryPath)
        const files = elencofiles.filter(f => (/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i).test(f.name))
        res.render('manager/shop/banner', {
            active: 'shop',
            title: 'Banner',
            current: 'banner',
            banners,
            files,
            ip: endpoint.IP_REMOTE,
            isDevelopment: global.IS_DEVELOPMENT
        })
    } catch (e) {
        res.status(500).send([e]);
        console.log('err. shop/banner', e)
    }
})


// -------------------------------------------->

//---------------- SERVICE ------------------->

router.get('/service/comportamento', (req, res, next) => {
    let c = configController.getConfig('all');

    res.render('manager/service/comportamento', {
        active: 'service',
        title: 'Comportamento',
        current: 'comportamento',
        motori,
        config: c.generali[0],
        behavior: c.behavior[0],
        ip: endpoint.IP_REMOTE,
        isDevelopment: global.IS_DEVELOPMENT
    })
})

router.get('/service/matricola', (req, res, next) => {
    let c = configController.getConfig('all');
    res.render('manager/service/matricola', {
        active: 'service',
        current: 'matricola',
        title: 'Identificativi',
        config: c.generali[0],
        ip: endpoint.IP_REMOTE,
        isDevelopment: global.IS_DEVELOPMENT
    })
})

router.get('/service/login', (req, res, next) => {

    res.render('manager/service/login', {
        active: 'login',
        title: 'Login service',
        ip: endpoint.IP_REMOTE,
        isDevelopment: global.IS_DEVELOPMENT
    })
})

router.post('/service/authenticate', (req, res, next) => {

    let user = req.body[0].user;
    let password = req.body[0].password;

    let controlloLogin = configController.authentication(user, password);
    if (controlloLogin) {
        req.session.profile = user;
        res.status(200).json({
            msg: "OK"
        });
    } else {
        res.status(200).json({
            msg: "KO"
        });
    }


})


// -------------------------------------------->

//---------------- AMMINISTRAZIONE ----------------->

router.get('/amministrazione/contabilita', (req, res, next) => {
    let vending_contabilita = configController.getContabilita('contabilita');
    let vending_contabilita_motori = configController.getContabilita('contabilita_motori');
    console.log(vending_contabilita_motori);
    let c = configController.getConfig('all');
    res.render('manager/amministrazione/contabilita', {
        active: 'amministrazione',
        title: 'Contabilità',
        current: 'contabilita',
        contabilita: vending_contabilita,
        contabilita_motori: vending_contabilita_motori,
        config: c.generali[0],
        ip: endpoint.IP_REMOTE,
        isDevelopment: global.IS_DEVELOPMENT
    })
})
router.get('/amministrazione/caricamonete', (req, res, next) => {
    let ip = ipController.getCurrentIp();
    res.render('manager/amministrazione/caricamonete', {
        active: 'amministrazione',
        current: 'caricamonete',
        title: 'Carica monete',
        ip,
        isDevelopment: global.IS_DEVELOPMENT
    })
})

router.get('/amministrazione/tickets', (req, res, next) => {
    let c = configController.getConfig('all');
    let tickets = ticketsController.getTickets();
    res.render('manager/amministrazione/tickets', {
        active: 'amministrazione',
        current: 'tickets',
        title: 'Tickets',
        config: c.generali[0],
        tickets,
        ip: endpoint.IP_REMOTE,
        isDevelopment: global.IS_DEVELOPMENT
    })
})



// -------------------------------------------->

//---------------- REPORT ------------------->



router.get('/report/versioni', (req, res, next) => {
    let c = configController.getConfig('all');
    res.render('manager/report/versioni-sw', {
        active: 'report',
        current: 'versioni',
        title: 'Versioni Software',
        config: c.generali[0],
        ip: endpoint.IP_REMOTE,
    })
})

router.get('/report/log', (req, res, next) => {
    // mi passo il numero di pagina
    let pagina = Number(req.query.page)
    // dati oggetto JSON
    let datiLog = Logger.readLog()
    // primo valore OGGETTO ARRAY JSOS - secondo Pagina corrente, - terzo Num. record per pagina
    if (pagina) {
        datipaging = Utils.paginazione(datiLog, pagina, 20)
    } else {
        datipaging = Utils.paginazione(datiLog, 1, 20)
        pagina = 1
    }

    res.render('manager/report/log', {
        active: 'report',
        current: 'log',
        title: 'Log',
        ip: endpoint.IP_REMOTE,
        isDevelopment: global.IS_DEVELOPMENT,
        datiLog: datiLog,
        datipaging: datipaging
    })
})


// -------------------------------------------->

//---------------- ACTIVITY ----------------->


router.get('/activity/allarmi', (req, res, next) => {

    const alarms = perifericheController.getAlarmsStatus();
    const coin = perifericheController.getCoinAcceptorStatus();
    const bill = perifericheController.getBillValidatorStatus();

    res.render('manager/activity/allarmi', {
        active: 'activity',
        current: 'allarmi',
        title: 'Allarmi',
        alarms,
        coin,
        bill,
        ip: endpoint.IP_REMOTE,
        isDevelopment: global.IS_DEVELOPMENT
    })
})



router.get('/activity/testperiferiche', (req, res, next) => {
    let ip = ipController.getCurrentIp();
    res.render('manager/activity/testperiferiche', {
        active: 'activity',
        current: 'testperiferiche',
        title: 'Test periferiche',
        ip,
        isDevelopment: global.IS_DEVELOPMENT
    })
})

router.get('/activity/testtouch', (req, res, next) => {

    res.render('manager/activity/testtouch', {
        active: 'testtouch',
        current: 'testtouch',
        title: 'Test touch',
        ip: endpoint.IP_REMOTE,
        isDevelopment: global.IS_DEVELOPMENT
    })
})

router.get('/activity/erogazionemanuale', (req, res, next) => {
    let ip = ipController.getCurrentIp();

    const motoriConf = perifericheController.getMotoriConf();
    console.log('array_motoriConf', motoriConf)

    for (let gruppo of motoriConf) {
        ChannelController.configureChannels(gruppo.group);
    }

    // const dispensersStatus = perifericheController.getDispensersStatus();

    const bulkheadStatus = perifericheController.getBulkheadStatus();
    console.log('bulkheadStatus', bulkheadStatus)

    const productDoorStatus = perifericheController.getProductdoorStatus();
    console.log('productDoorStatus', productDoorStatus)

    res.render('manager/activity/erogazionemanuale', {
        active: 'activity',
        current: 'erogazionemanuale',
        title: 'Erogazione manuale',
        ip,
        motoriConf,
        bulkheadStatus,
        productDoorStatus,
        isDevelopment: global.IS_DEVELOPMENT
    })
})



// -------------------------------------------->

//---------------- FILE MANAGER ----------------->


router.get('/file-manager/caricamultimedia', (req, res, next) => {

    // Vedo listaq files in cartella media
    const directoryPath = path.join(__dirname, '../../public/media');

    const elencofiles = Utils.listafiles(directoryPath)

    res.render('manager/file-manager/caricamultimedia', {
        active: 'file-manager',
        current: 'caricamultimedia',
        title: 'Carica multimedia',
        ip: endpoint.IP_REMOTE,
        isDevelopment: global.IS_DEVELOPMENT,
        listafileslocali: elencofiles
    })
})


router.get('/file-manager/caricamultimediausb', (req, res, next) => {

    // Vedo listaq files in cartella media
    const directoryPath = path.join(__dirname, '../../public/media');

    const elencofiles = Utils.listafiles(directoryPath)

    res.render('manager/file-manager/caricamultimediausb', {
        active: 'file-manager',
        current: 'caricamultimediausb',
        title: 'Carica caricamultimediausb',
        ip: endpoint.IP_REMOTE,
        isDevelopment: global.IS_DEVELOPMENT,
        listafileslocali: elencofiles
    })
})

router.get('/file-manager/caricamediausb', (req, res, next) => {
    let c = configController.getConfig('all');
    let id_esercente = c.generali[0].id_esercente

    // prendo la lista dei files esistenti già sulla macchina
    const directoryPath = path.join(__dirname, '../../public/media');
    const elencofiles = Utils.listafiles(directoryPath)

    res.render('manager/file-manager/caricamultimediausb', {
        active: 'file-manager',
        current: 'caricamultimediausb',
        title: 'Carica caricamultimediausb',
        config: c.generali[0],
        ip: endpoint.IP_REMOTE,
        isDevelopment: global.IS_DEVELOPMENT,
        listafileslocali: elencofiles
    })

})

router.post('/file-manager/caricamediausb', (req, res, next) => {

    const form = formidable({ multiples: true });

    form.parse(req, (err, fields, files) => {

        const directoryPath = path.join(__dirname, '../../public/media/');
        let controllaNumfiles = files['filetoupload'].length
        console.log('************ numero files = ', controllaNumfiles)
        let contatoreFiles = 0
        if (controllaNumfiles) {

            // Ciclo per tutti i files da uploadare
            for (let x in files['filetoupload']) {

                // filepath è il PATH della posizione temporanea dove viene messo il file da uploadare 
                var oldpath = files['filetoupload'][x]['filepath'];
                // newpath è il PATH di destinazione di dove si vuole salvare il file uploadato
                var newpath = directoryPath + files['filetoupload'][x]['originalFilename'];

                fs.rename(oldpath, newpath, function (err) {
                    if (err) throw err;
                    contatoreFiles++
                    // il redirect lo deve fare solo se ha finito altrimenti da errore di Headers already sent
                    if (controllaNumfiles == contatoreFiles) {
                        return res.redirect('/file-manager/caricamediausb');
                    }
                })

            }

        } else {
            // UN SOLO FILE
            var oldpath = files.filetoupload.filepath;
            var newpath = directoryPath + files.filetoupload.originalFilename;
            fs.rename(oldpath, newpath, function (err) {
                if (err) throw err;
                res.redirect('/file-manager/caricamediausb');
            });
        }

    });

});

router.get('/file-manager/caricamediacloud', (req, res, next) => {
    let c = configController.getConfig('all');

    // prendo la lista dei files esistenti già sulla macchina
    const directoryPath = path.join(__dirname, '../../public/media');
    const elencofiles = Utils.listafiles(directoryPath)

    let id_esercente = c.generali[0].id_esercente

    const url = endpoint.LISTA_MEDIA + "?ide=" + id_esercente
    // prendo la lista files dal CLOUD/CMS
    request({ url: url, json: true }, (error, response) => {

        if (error) {
            console.log('Problemi di connessione = ' + error)
        } else if (!response) {
            console.log('problemi lettura dati')
        } else {

            res.render('manager/file-manager/caricamultimedia', {
                active: 'file-manager',
                title: 'Carica multimedia',
                current: 'caricamediacloud',
                config: c.generali[0],
                ip: endpoint.IP_REMOTE,
                isDevelopment: global.IS_DEVELOPMENT,
                listafileslocali: elencofiles,
                listaFiles: response.body
            })

        }
    })
})



// -------------------------------------------->



module.exports = router;


