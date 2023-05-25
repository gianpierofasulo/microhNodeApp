const express = require('express')
const router = express.Router()
const ConfigController = require('../../controllers/config.controller');
let bodyParser = require('body-parser');


const transactionApi = require("./transaction")
router.use(transactionApi);

const networkApi = require("./network")
router.use(networkApi);

const productApi = require("./product")
router.use(productApi);

const contabilitaApi = require("./contabilita")
router.use(contabilitaApi);

const channelsApi = require("./channels")
router.use(channelsApi);

const bannerApi = require("./banner")
router.use(bannerApi);

const vetrinaApi = require("./vetrina")
router.use(vetrinaApi);

const categorieApi = require("./categorie")
router.use(categorieApi);

const TicketsApi = require("./tickets")
router.use(TicketsApi);

const IpApi = require("./ip")
router.use(IpApi);

const QrApi = require("./qr")
router.use(QrApi);

const perifericheApi = require("./periferiche")
router.use(perifericheApi);

const languagesApi = require("./languages")
router.use(languagesApi);


// parse application/json
router.use(bodyParser.json());

router.get("/config/:type", function (req, res) {
    let json
    if (req.params.type == 'contabilita') {
        json = ConfigController.getContabilita(req.params.type);
    } else {
        json = ConfigController.getConfig(req.params.type);
    }
    if (json) {
        res.status(200).send(json);
    }
});


router.post("/update-config", function (req, res) {
    if (req.body) {
        let upd = ConfigController.updateJson(req.body);
        if (upd) {
            res.status(200).send(upd);
        }
    }
});

module.exports = router;
