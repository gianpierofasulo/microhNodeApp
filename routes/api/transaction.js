const express = require('express')
const router = express.Router()
const TransactionController = require('../../controllers/transaction.controller');
let bodyParser = require('body-parser');
// parse application/json
router.use(bodyParser.json());

router.post("/new-transaction", function(req, res) {
    let obj = req.body
    let json = TransactionController.createTransaction(obj.state,obj.cash);
    if (json) {
        res.status(200).send(json);
    }
});


router.post("/update-transaction", function(req, res) {

    let json = TransactionController.updateTransaction(req.body.state,req.body.cash)
    
    if (json) {
        res.status(200).send(json);
    }
});

router.get("/transactions/get", function(req, res) {

    let json = TransactionController.getTransactions()
    
    if (json) {
        res.status(200).send(json);
    }
});




module.exports = router;
