const express = require('express')
const router = express.Router()
const IpController = require('../../controllers/ip.controller');
let bodyParser = require('body-parser');
router.use(bodyParser.json());


router.get("/ip/get", function(req, res) {
    let ip = IpController.getCurrentIp();
    if (ip) {
        res.status(200).send(ip);
    }
});

module.exports = router;
