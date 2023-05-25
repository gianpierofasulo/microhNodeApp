const express = require('express')
const router = express.Router()
const translateController = require('../../controllers/translate.controller');

//list languages
router.get("/languages/get", function (req, res) {
    try {
        const data = translateController.getLanguages();
        res.status(200).send(data || []);
    } catch (e) {
        res.status(500).send([e]);
        console.log('err. getLanguages', e)
    }
});
//list languages
router.get("/languages/frontend/current/get", function (req, res) {
    try {
        const data = translateController.getFrontendLanguage();
        res.status(200).send([data]);
    } catch (e) {
        res.status(500).send([e]);
        console.log('err. getFrontendLanguage', e)
    }
});
router.get("/languages/frontend/get/", function (req, res) {
    let lang = req.query.lang;
    let data;
    try {
        if(lang != ''){
            data = translateController.getSelectedLanguage(lang);
        }else{
            data = translateController.getFrontendLanguage();
        }
        res.status(200).send([data]);
        
    } catch (e) {
        res.status(500).send([e]);
        console.log('err. getFrontendLanguage', e)
    }
});


module.exports = router;
