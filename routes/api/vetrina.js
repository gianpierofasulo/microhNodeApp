const express = require('express')
const router = express.Router()
const controller = require('../../controllers/vetrina.controller');

router.get("/vetrina", function(_, res) {
    try {
        const data = controller.getVetrine();
        res.status(200).send(data || []);
    } catch (e) {
        res.status(500).send([e]);
        console.log('err. getProductVetrina', e)
    }
});

router.get("/vetrina/:id_vetrina", function(req, res) {
    try {
        const id = req.params.id_vetrina
        const vetrina = controller.getVetrina(id, req.body);
        res.status(200).send(vetrina);
    } catch (e) {
        res.status(500).send([e]);
        console.log('err. saveProductVetrina', e)
    }
});

router.post("/vetrina/:id_vetrina", function(req, res) {
    try {
        const id = req.params.id_vetrina
        const vetrina = controller.saveProductVetrina(id, req.body);
        res.status(200).send(vetrina);
    } catch (e) {
        res.status(500).send([e]);
        console.log('err. saveProductVetrina', e)
    }
});

router.post("/vetrina/:id_vetrina/delete", function(req, res) {
    try {
        const id = req.params.id_vetrina
        controller.deleteProductVetrina(id, req.body);
        res.status(200).send([]);
    } catch (e) {
        res.status(500).send([e]);
        console.log('err. deleteProductVetrina', e)
    }
});

// changeCard
router.post("/vetrina/:id_vetrina/set_layout_card", function(req, res) {
    try {
        const id = req.params.id_vetrina
        const data = controller.changeVetrinaLayoutCard(id, req.body.layout_card);
        if (data) {
            res.status(200).send(data);
        }
    } catch (e) {
        res.status(500).send([e]);
        console.log('err. changeVetrinaLayout', e)
    }
});

// changeLayout
router.post("/vetrina/:id_vetrina/set_layout", function(req, res) {
    try {
        const id = req.params.id_vetrina
        const data = controller.changeVetrinaLayout(id, req.body.layout);
        if (data) {
            res.status(200).send(data);
        }
    } catch (e) {
        res.status(500).send([e]);
        console.log('err. changeVetrinaLayout', e)
    }
});

router.post("/vetrina/:id_vetrina/change_icon", function(req, res) {
    try {
        const id = req.params.id_vetrina
        const data = controller.changeVetrinaIcon(id, req.body.icon);
        if (data) {
            res.status(200).send(data);
        }
    } catch (e) {
        res.status(500).send([e]);
        console.log('err. changeVetrinaStatus', e)
    }
});
// changeStatus
router.post("/vetrina/:id_vetrina/state", function(req, res) {
    try {
        const id = req.params.id_vetrina
        const data = controller.changeVetrinaStatus(id, req.body.status);
        if (data) {
            res.status(200).send(data);
        }
    } catch (e) {
        res.status(500).send([e]);
        console.log('err. changeVetrinaStatus', e)
    }
});

router.post("/vetrina/:id_vetrina/over_18", function(req, res) {
    try {
        const id = req.params.id_vetrina
        const data = controller.changeVetrinaOver18(id, req.body.status);
        if (data) {
            res.status(200).send(data);
        }
    } catch (e) {
        res.status(500).send([e]);
        console.log('err. changeVetrinaOver18', e)
    }
});

module.exports = router;
