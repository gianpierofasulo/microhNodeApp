const express = require('express')
const router = express.Router()
const QrController = require('../../controllers/qrcode.controller');
let bodyParser = require('body-parser');
router.use(bodyParser.json());


router.get("/qr/get/:alias/:productId", function(req, res) {
    console.log('qr',req.params.productId)
    let qr = QrController.createQr(req.params.alias,req.params.productId);
    if (qr) {
        res.status(200).send(qr);
    }
});

module.exports = router;
