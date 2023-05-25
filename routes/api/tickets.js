const express = require('express')
const router = express.Router()
const TicketsController = require('../../controllers/tickets.controller');
let bodyParser = require('body-parser');
router.use(bodyParser.json());


router.get("/tickets/", function(req, res) {
    try {
        const data = TicketsController.getTickets();
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send(e);
        console.log('err', e)
    }
});
router.post("/ticket/remove", function(req, res) {
    try {
        const data = TicketsController.annullaTicket(req.body);
        res.status(200).send(data || []);
    } catch (e) {
        res.status(500).send([e]);
        console.log('err. getProduct', e)
    }
});
router.get("/tickets/:id", function(req, res) {
    try {
        const data = TicketsController.getTicket(req.params.id);
        res.status(200).send(data || []);
    } catch (e) {
        res.status(500).send([e]);
        console.log('err. getProduct', e)
    }
});






module.exports = router;
