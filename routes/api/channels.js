const express = require('express')
const router = express.Router()
const ChannelsController = require('../../controllers/channels.controller');

router.get("/channels/configure", function(req, res) {
    try {
        const data = ChannelsController.configureChannels();
        res.status(200).send('configurato');

    } catch (e) {
        res.status(500).send(e);
        console.log('err', e)
    }
});

router.get("/channel/:group/:channel/delete", function(req, res) {
    try {
        const data = ChannelsController.removeChannel(req.params.channel, req.params.group);
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send(e);
        console.log('err', e)
    }
});

router.get("/channel/:id", function(req, res) {
    try {
        const data = ChannelsController.getChannel(req.params.id);
        res.status(200).send(data || []);
    } catch (e) {
        res.status(500).send([e]);
        console.log('err. getProduct', e)
    }
});


module.exports = router;
