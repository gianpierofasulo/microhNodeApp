const express = require('express')
const router = express.Router()
const Controller = require('../../controllers/categorie.controller');

//list categorie
router.get("/categorie/:type", function (req, res) {
    try {
        const type = req.params.type
        const data = Controller.getCategorie();
        res.status(200).send(data[type] || []);
    } catch (e) {
        res.status(500).send([e]);
        console.log('err. getCategorie', e)
    }
});

module.exports = router;
