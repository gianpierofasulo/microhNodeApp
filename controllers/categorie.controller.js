const JSONStore = require('../classes/JsonStore.class.js');

exports.getCategorie = () => {
    const categorieFile = new JSONStore('./public/data/categorie.json');
    const categorie = categorieFile.read()
    return categorie
};
