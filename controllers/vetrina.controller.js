const JSONStore = require('../classes/JsonStore.class.js');
const ChannelsController = require('./channels.controller');

exports.getVetrine = (onlyEnabled = true) => {
    const vetrineFile = new JSONStore('./public/data/vetrina.json');
    let vetrine = vetrineFile.read()
    const catalogoFile = new JSONStore('./public/data/catalogo.json');
    const catalogo = catalogoFile.read()
    const channelsAFile = new JSONStore('./public/data/canali/canali_A.json');
    const channelA = channelsAFile.read()
    const channelsBFile = new JSONStore('./public/data/canali/canali_B.json');
    const channelB = channelsBFile.read()
    let canali = channelA.concat(channelB);
    if (onlyEnabled) vetrine = vetrine.filter(v => !!v.isEnabled)
    return vetrine.map(vetrina => {
        const slot = vetrina.slots.map(e => ({
            ...e,
            ...catalogo.find(p => p.id == e.prodotto_id),
            canali: canali.filter(el => el.prodotto_id == e.prodotto_id).map(c => {
                return {
                    canale: c.canale,
                    larghezza: c.larghezza,
                    group: c.group,
                    related: c.related
                }
            })
        }))
        vetrina.slots = slot
        return vetrina;
    })
}

exports.getVetrina = (id_vetrina) => {
    const vetrineFile = new JSONStore('./public/data/vetrina.json');
    const vetrine = vetrineFile.read()
    const vetrina = vetrine.find(v => v.id == id_vetrina) || {}
    const products = ChannelsController.getProducts();
    vetrina.slots.forEach(s => {
        const p = products.find(p => p.id == s.prodotto_id)
        s.titolo = p ? p.titolo : " n.d. "
        s.immagine = p ? p.immagine : ""
        s.descrizione = p ? p.descrizione : "n.d"
        s.prezzo = p ? p.prezzo : "n.d."
    })
    return vetrina
}

exports.saveProductVetrina = (id_vetrina, data) => {
    const vetrineFile = new JSONStore('./public/data/vetrina.json');
    const vetrine = vetrineFile.read()
    const vetrina = vetrine.find(v => v.id == id_vetrina) || []
    const indexSlot = vetrina.slots.findIndex(e => e.id_slot == data.id_slot)
    if (indexSlot < 0) vetrina.slots.push({ id_slot: data.id_slot, prodotto_id: data.prodotto_id });
    else vetrina.slots[indexSlot].prodotto_id = data.prodotto_id;
    vetrineFile.write(vetrine)
    return 'ok'
};

exports.deleteProductVetrina = (id_vetrina, data) => {
    const vetrineFile = new JSONStore('./public/data/vetrina.json');
    const vetrine = vetrineFile.read()
    const vetrina = vetrine.find(v => v.id == id_vetrina) || []
    vetrina.slots = vetrina.slots.filter(e => e.id_slot != data.id_slot)
    vetrineFile.write(vetrine)
};

exports.changeVetrinaLayout = (vetrina_id, layout) => {
    const vetrineFile = new JSONStore('./public/data/vetrina.json');
    const vetrine = vetrineFile.read()
    const vetrina = vetrine.find(b => b.id == vetrina_id)
    if (vetrina) {
        vetrina.layout = layout;
        vetrineFile.write(vetrine)
    }
    return vetrine
};

exports.changeVetrinaLayoutCard = (vetrina_id, layout_card) => {
    const vetrineFile = new JSONStore('./public/data/vetrina.json');
    const vetrine = vetrineFile.read()
    const vetrina = vetrine.find(b => b.id == vetrina_id)
    if (vetrina) {
        vetrina.layout_card = layout_card;
        vetrineFile.write(vetrine)
    }
    return 'ok'
};

exports.changeVetrinaStatus = (vetrina_id, status) => {
    const vetrineFile = new JSONStore('./public/data/vetrina.json');
    const vetrine = vetrineFile.read()
    const vetrina = vetrine.find(b => b.id == vetrina_id)
    if (vetrina) {
        vetrina.isEnabled = status;
        vetrineFile.write(vetrine)
    }
    return vetrine
};

exports.changeVetrinaOver18 = (vetrina_id, status) => {
    const vetrineFile = new JSONStore('./public/data/vetrina.json');
    const vetrine = vetrineFile.read()
    const vetrina = vetrine.find(b => b.id == vetrina_id)
    if (vetrina) {
        vetrina.over_18 = status;
        vetrineFile.write(vetrine)
    }
    return vetrine
};

exports.changeVetrinaIcon = (vetrina_id, icon) => {
    const vetrineFile = new JSONStore('./public/data/vetrina.json');
    const vetrine = vetrineFile.read()
    const vetrina = vetrine.find(b => b.id == vetrina_id)
    if (vetrina) {
        vetrina.icon = 'http://localhost:3000/assets/icons/'+icon;
        vetrineFile.write(vetrine)
    }
    return vetrine
};
