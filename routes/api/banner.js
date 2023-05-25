const express = require('express')
const router = express.Router()
const controller = require('../../controllers/banner.controller');

//list banner
router.get("/banner", function (_, res) {
    try {
        const data = controller.getBanner();
        res.status(200).send(data || []);
    } catch (e) {
        res.status(500).send([e]);
        console.log('err. getBanner', e)
    }
});

// create
router.post("/banner", function (req, res) {
    try {
        const data = controller.addBanner(req.body.banner_id);
        if (data) {
            res.status(200).send(data);
        }
    } catch (e) {
        res.status(500).send([e]);
        console.log('err. editBanner', e)
    }
});

// addImage
router.post("/banner/:banner_id/add_image", function (req, res) {
    try {
        const data = controller.addBannerImage(req.params.banner_id, req.body.image);
        if (data) {
            res.status(200).send(data);
        }
    } catch (e) {
        res.status(500).send([e]);
        console.log('err. addBannerImage', e)
    }
});

// changeStatus
router.post("/banner/:banner_id/state", function (req, res) {
    try {
        const data = controller.changeBannerStatus(req.params.banner_id, req.body.status);
        if (data) {
            res.status(200).send(data);
        }
    } catch (e) {
        res.status(500).send([e]);
        console.log('err. changeBannerStatus', e)
    }
});


// delete
router.post("/banner/:banner_id/delete", function (req, res) {
    try {
        const data = controller.deleteBannerImage(req.params.banner_id, req.body.image);
        if (data) {
            res.status(200).send(data);
        }
    } catch (e) {
        res.status(500).send([e]);
        console.log('err. getProductChannels', e)
    }
});


module.exports = router;
