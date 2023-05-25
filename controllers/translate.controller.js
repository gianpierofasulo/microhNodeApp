const fetch = require('node-fetch');
const JSONStore = require('../classes/JsonStore.class.js');
const configController = require('./config.controller.js')

exports.getLanguages = () => {
    let data = './public/data/lang/list.json';
    const languagesFile = new JSONStore(data);
    const languages = languagesFile.read()
    return languages;

}

exports.getFrontendLanguage = () => {
	let generali = configController.getConfig('generali');
    let lang = generali.client_lang;
	let langFile = new JSONStore(`./public/data/lang/frontend/${lang}/${lang}.json`);
    let current_lang = langFile.read()
    return current_lang;
}

exports.getSelectedLanguage = (lang) => {
    let lingua = lang;
    let generali = configController.getConfig('generali');
    if(lang == 'undefined'){
        lingua = generali.default_lang;
    }
	let langFile = new JSONStore(`./public/data/lang/frontend/${lingua}/${lingua}.json`);
    let current_lang = langFile.read()
    return current_lang;
}

exports.getCurrentLanguage = (current) => {
    let generali = configController.getConfig('generali');
    let lang = generali.default_lang;
    if(lang != current){
        const langFile = new JSONStore(`./public/data/lang/manager/${lang}/${lang}.json`);
        const current_lang = langFile.read()
        return {
        	langFile,
        	current_lang
        }
    }

}

