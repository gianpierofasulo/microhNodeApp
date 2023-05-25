const express = require('express')
const router = express.Router()
const ContabilitaController = require('../../controllers/contabilita.controller');
const configController = require('../../controllers/config.controller');
let bodyParser = require('body-parser');
router.use(bodyParser.json());


router.get("/contabilita/reset", function(req, res) {
    let reset = ContabilitaController.resetContabilita();
    if (reset) {
        res.status(200).send(reset);
    }
});

router.get("/contabilita/motori/get", function(req, res) {
    let vending_contabilita_motori = configController.getContabilita('contabilita_motori');
    if (vending_contabilita_motori) {
        res.status(200).send(vending_contabilita_motori);
    }
});



module.exports = router;
