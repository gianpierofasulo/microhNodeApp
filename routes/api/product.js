const express = require('express')
const router = express.Router()
const ChannelsController = require('../../controllers/channels.controller');

router.get("/product", function(req, res) {
    try {
        const data = ChannelsController.getProducts();
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send([e]);
        console.log('err. getProductChannels', e)
    }
});

router.get("/product/alias/:alias", function(req, res) {
    try {
        const data = ChannelsController.getChannelByAlias(req.params.alias);
        console.log('get channel by alias',data)
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send([e]);
        console.log('err. getProductChannels', e)
    }
});

router.get("/product/channels/", function(req, res) {
    try {
        const data = ChannelsController.getProductChannels();
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send([e]);
        console.log('err. getProductChannels', e)
    }
});

router.post("/product/channels/:group/:channel", function(req, res) {
    try {
        const data = ChannelsController.setChannel(req.body, req.params.channel, req.params.group);
        if (data) {
            const configure = ChannelsController.configureChannels(req.params.group);
            if (configure) {
                let obj = {
                    'data': data,
                    'configure': configure
                }
                res.status(200).send(obj);
            }
        }

    } catch (e) {
        res.status(500).send([e]);
        console.log('err. getProductChannels', e)
    }
});

router.get("/product/:id", function(req, res) {
    try {
        const data = ChannelsController.getProduct(req.params.id);
        res.status(200).send(data || []);
    } catch (e) {
        res.status(500).send([e]);
        console.log('err. getProduct', e)
    }
});



router.get("/product/barcode/:barcode", function(req, res) {
    try {
        const data = ChannelsController.getProductByBarcode(req.params.barcode);
        res.status(200).send(data || []);
    } catch (e) {
        res.status(500).send([e]);
        console.log('err. getProduct', e)
    }
});

router.post("/update-product/:id", function(req, res) {
    try {
        const data = ChannelsController.updateProduct(req.body, req.params.id);
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send([e]);
        console.log('err. getProduct', e)
    }
});


router.get("/configure/:group/:id/:channel", function(req, res) {
    try {
        const data = ChannelsController.getProductInChannel(req.params.id, req.params.channel, req.params.group);
        res.status(200).send(data || []);
    } catch (e) {
        res.status(500).send([e]);
        console.log('err. getProduct', e)
    }
});

module.exports = router;
