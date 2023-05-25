const JSONStore = require('../classes/JsonStore.class.js');
const UtilsClass = require('../classes/Utils.class.js');
const ipController = require('./ip.controller')

exports.getProduct = (id) => {
    const catalogoFile = new JSONStore('./public/data/catalogo.json');
    const catalogo = catalogoFile.read()
    return catalogo.find(p => p.id == id)
};

exports.getProducts = () => {
    const vetrineFile = new JSONStore('./public/data/vetrina.json');
    const vetrine = vetrineFile.read()
    const catalogoFile = new JSONStore('./public/data/catalogo.json');
    const catalogo = catalogoFile.read()
    const channelsAFile = new JSONStore('./public/data/canali/canali_A.json');
    const channelA = channelsAFile.read()
    const channelsBFile = new JSONStore('./public/data/canali/canali_B.json');
    const channelB = channelsBFile.read()
    let canali = channelA.concat(channelB);
    const products = []
    vetrine.forEach(vetrina => vetrina.slots.forEach(e => products.push({
        ...e,
        ...catalogo.find(p => p.id == e.prodotto_id),
        canali: canali.filter(el => el.prodotto_id == e.prodotto_id).map(c => {
            return {
                canale: c.canale,
                larghezza: c.larghezza,
                group: c.group
            }
        })
    })))
    return products
};

exports.getChannel = (id) => {
    const channelsAFile = new JSONStore('./public/data/canali/canali_A.json');
    const channelsBFile = new JSONStore('./public/data/canali/canali_B.json');
    const channelA = channelsAFile.read()
    const channelB = channelsBFile.read()
    let channel = channelA.concat(channelB);
    return channel.find(c => c.canale == id)
};

exports.getChannelByAlias = (alias) => {
    const channelsAFile = new JSONStore('./public/data/canali/canali_A.json');
    const channelsBFile = new JSONStore('./public/data/canali/canali_B.json');
    const channelA = channelsAFile.read()
    const channelB = channelsBFile.read()
    let channel = channelA.concat(channelB);
    return channel.find(c => c.alias == alias)
};


exports.getProductInChannel = (id, channel, group) => {
    // const catalogoFile = new JSONStore('./public/data/catalogo.json');
    // const catalogo = catalogoFile.read()
    // return catalogo.find(p => p.id == id)
    const canaliFile = new JSONStore(`./public/data/canali/canali_${group}.json`);
    const canali = canaliFile.read().filter(c => c.canale == channel)
    const catalogoFile = new JSONStore('./public/data/catalogo.json');
    const catalogo = catalogoFile.read()
    const channels = canali.map(c => {
        const product = catalogo.find(p => p.id == c.prodotto_id)
        return {
            group: c.group,
            prodotto_id: product.id,
            canale: c.canale,
            alias: c.alias,
            stato: c.stato,
            larghezza: c.larghezza,
            related: c.related,
            titolo: product.titolo,
            immagine: product.immagine,
            vendibile: product.vendibile,
            vendibile_via_web: product.vendibile_via_web,
            prezzo: product.prezzo,
            prezzo_scontato: product.prezzo_scontato,
            profondita: product.profondita,
            minuti: product.minuti,
            ristretto_per_minori: product.ristretto_per_minori,
            descrizione: product.descrizione,
            codice_a_barre: product.codice_a_barre,
            category: product.category,
            subcategory: product.subcategory
        }
    })

    return channels[0];



};

exports.getProductByBarcode = (barcode) => {
    const catalogoFile = new JSONStore('./public/data/catalogo.json');
    const catalogo = catalogoFile.read()
    return catalogo.find(p => p.codice_a_barre == barcode)
};

//Per canali in frontend
exports.getProductChannels = () => {
    const canaliAFile = new JSONStore(`./public/data/canali/canali_A.json`);
    const canaliBFile = new JSONStore(`./public/data/canali/canali_B.json`);
    const canaliA = canaliAFile.read().filter(c => c.prodotto_id != null)
    const canaliB = canaliBFile.read().filter(c => c.prodotto_id != null)
    let canali = canaliA.concat(canaliB);
    const catalogoFile = new JSONStore('./public/data/catalogo.json');
    const catalogo = catalogoFile.read()
    return canali.map(c => {
        const product = catalogo.find(p => p.id == c.prodotto_id)
        function truncate(str, n) {
            return (str.length > n) ? str.slice(0, n - 1) + '&hellip;' : str;
        };
        return {
            group: c.group,
            type: c.type,
            prodotto_id: product.id,
            descrizione: UtilsClass.truncate(product.descrizione, 100),
            canale: c.canale,
            alias: c.alias,
            related: c.related,
            stato: c.stato,
            titolo: product.titolo,
            immagine: product.immagine,
            vendibile: product.vendibile,
            prezzo: product.prezzo,
            prezzo_scontato: product.prezzo_scontato,
            minori: product.ristretto_per_minori,
            larghezza: c.larghezza,
            category: product.category,
            subcategory: product.subcategory
        }
    })

};

exports.getChannels = () => {
    const channelsAFile = new JSONStore('./public/data/canali/canali_A.json');
    const channelsBFile = new JSONStore('./public/data/canali/canali_B.json');
    const channelA = channelsAFile.read()
    const channelB = channelsBFile.read()
    let channels = channelA.concat(channelB);
    return channels
};

exports.getDynamicChannels = (group) => {
    const canaliFile = new JSONStore(`./public/data/canali/canali_${group}.json`);
    return canali = canaliFile.read()
};


exports.removeChannel = (canale, group) => {
    const channelsFile = new JSONStore(`./public/data/canali/canali_${group}.json`);
    const channels = channelsFile.read();
    const find_channel = channels.find(c => c.canale == canale)

    if (find_channel) {
        find_channel.prodotto_id = null;
        find_channel.larghezza = 1;
        channelsFile.write(channels);
    }

    return find_channel;
};



exports.setChannel = (product,channel_id,group) => {
    const channelsFile = new JSONStore(`./public/data/canali/canali_${group}.json`);
    const channels = channelsFile.read()
    const find_channel = channels.find(c => c.canale == channel_id)
    if (find_channel) {
        find_channel.prodotto_id = Number(product.id_prodotto);
        find_channel.larghezza = Number(product.larghezza);
        find_channel.related = product.related == 0 ? null : Number(product.related)
        channelsFile.write(channels);
    }

    return find_channel;

};




exports.updateProduct = (body, id_prodotto) => {
    const catalogoFile = new JSONStore('./public/data/catalogo.json');
    const catalogo = catalogoFile.read()
    if (id_prodotto != 0) {
        const prod_catalogo = catalogo.find(p => p.id == id_prodotto)
        if (prod_catalogo) {
            Object.keys(prod_catalogo).forEach((k, i) => {
                if (body.hasOwnProperty(k)) {
                    if (k == 'id' || k == 'larghezza' || k == 'profondita' || k == 'prezzo' || k == 'prezzo_scontato') {
                        prod_catalogo[k] = Number(body[k]);
                    } else {
                        prod_catalogo[k] = body[k];
                    }
                }
            });

            catalogoFile.write(catalogo);
            let return_obj = { ...prod_catalogo, 'canale': body.canale, 'larghezza': body.larghezza, 'id_prodotto': prod_catalogo.id }
            return return_obj;
        }
    } else {

        let obj = ({ ...catalogo[0] });

        let i = catalogo.length - 1;
        let id = catalogo[i].id + 1;
        Object.keys(obj).forEach((k, i) => {
            if (body.hasOwnProperty(k)) {
                if (k == 'vendibile_via_web' || k == 'profondita' || k == 'prezzo' || k == 'prezzo_scontato' || k == 'ristretto_per_minori') {
                    obj[k] = Number(body[k]);
                } else {
                    obj[k] = body[k];
                }

            }
        });
        obj.id = id;
        obj.immagine = 'http://localhost:3000/data/img/catalogo/placeholder.svg';
        catalogo.push(obj);
        catalogoFile.write(catalogo);
        let return_obj = { ...obj, 'canale': body.canale, 'larghezza': body.larghezza, 'id_prodotto': obj.id }
        return return_obj;
    }

};

//Canali mqtt

exports.configureChannels = (group) => {
    const canaliFile = new JSONStore(`./public/data/canali/canali_${group}.json`);
    const canali = canaliFile.read().filter(e => e.prodotto_id != null)
    const catalogoFile = new JSONStore('./public/data/catalogo.json');
    const catalogo = catalogoFile.read()
    const channels = canali.map(e => {
        const product = catalogo.find(p => p.id == e.prodotto_id)
        return {
            group: e.group,
            product: Number(e.canale),
            value: Number(product.prezzo),
            depth: Number(product.profondita),
            width: Number(e.larghezza)
        }
    })
    const dispenser = require('../mqtt/Dispensers');
    dispenser.configure(channels);
    return channels;
};






