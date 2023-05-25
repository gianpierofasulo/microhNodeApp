const JSONStore = require('../classes/JsonStore.class.js');

exports.getBanner = () => {
    const bannersFile = new JSONStore('./public/data/banner.json');
    const banners = bannersFile.read()
    return banners
};

exports.addBanner = (banner_id) => {
    const bannersFile = new JSONStore('./public/data/banner.json');
    const banners = bannersFile.read()
    const newBanner = {
        "enabled": true,
        "id": banner_id,
        "images": []
    }
    if (banners) {
        banners.push(newBanner)
        bannersFile.write(banners)
    } else {
        bannersFile.write([newBanner])
    }
    return banners
};

exports.addBannerImage = (banner_id, image) => {
    const bannersFile = new JSONStore('./public/data/banner.json');
    const banners = bannersFile.read()
    const banner = banners.find(b => b.id == banner_id)
    if (banner) {
        banner.images.push(image)
        bannersFile.write(banners)
    }
    return banners
};


exports.changeBannerStatus = (banner_id, status) => {
    const bannersFile = new JSONStore('./public/data/banner.json');
    const banners = bannersFile.read()
    const banner = banners.find(b => b.id == banner_id)
    if (banner) {
        banner.enabled = status;
        bannersFile.write(banners)
    }
    return banners
};

exports.deleteBannerImage = (banner_id, image) => {
    console.log(image, banner_id)
    const bannersFile = new JSONStore('./public/data/banner.json');
    const banners = bannersFile.read()
    const banner = banners.find(b => b.id == banner_id)
    if (banner) {
        const images = banner.images.filter(i => i != image)
        banner.images = images
        bannersFile.write(banners)
    }
    return banners
};
