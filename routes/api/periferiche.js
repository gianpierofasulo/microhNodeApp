const express = require('express')
const router = express.Router()
const perifericheController = require('../../controllers/periferiche.controller');

router.get("/periferiche/get", function(req, res) {
    try {
        const data = perifericheController.listPeriferiche();
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send([e]);
        console.log('err. getProductChannels', e)
    }
});

module.exports = router;