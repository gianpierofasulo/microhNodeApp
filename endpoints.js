const IP_PROD = 'http://localhost'
const IP_LOCAL = 'http://localhost'
const IP_DEV = 'http://localhost'
const API_CLOUD = 'https://microhard.ximplia.it/public'
const API_LOCAL = 'http://localhost/microhard_git/microhard-cms/public'
const API_CLOUD_MEDIA = 'https://microhard.ximplia.it/public/media'
const HOST_LOGIC_PROD = IP_PROD+':3000' //macchina online
const HOST_LOGIC_DEV = IP_DEV+':3000' //macchina dedo
const HOST_APP_DEV = IP_LOCAL+':3000' //App locale
const HOST_APP_PROD = IP_PROD+':3000' //App su macchina

const endpoint = {
    //"CONTROLLER": API_CONTROLLER,
    "CATALOGUE": {
        "MATR_MACCHINA":API_CLOUD +"/api/ric_prod_cat_eserc_x_matr_macchina.php",
        "CATALOGO":API_CLOUD +"/api/catalogo_esercente.php",
        "CATALOGO_GEN":API_CLOUD +"/api/ric_prod_cat_gen.php",
        "TIPOLOGIA":API_CLOUD +"/api/ric_prod_cat_eserc_x_tipologia.php",
        "IMMAGINI":"https://microhard.ximplia.it/app/immaginiprodotti/",
        "CANALI":API_CLOUD + '/api/lista_canali_abilitati_per_matricola_macchina.php',
        "UPDATE_CANALE": API_CLOUD + '/api/updt_prodotto_catalogo_esercente.php',
        "BARCODE": API_CLOUD + '/api/ric_prod_cat_eser_x_barcode.php',
        "RICERCA_CANALE": API_CLOUD + '/api/ric_prod_x_canale_e_macchina.php',
        "MEDIA": IP_LOCAL + '/api/microhard_git/microhard-cms/public/media/'
    },

    "LOGIN": {
        "API_CLOUD":API_CLOUD +"/api/controlla_login.php",
    },
    "LISTA_MEDIA": API_CLOUD + '/api/lista_media.php',
    "LISTA_JSON": API_CLOUD + '/api/lista_sync_json.php',
    "ENDPOINT_JSON_CLOUD": API_CLOUD,
    "LOGIC_ADDRESS": HOST_LOGIC_PROD,
    "APP_ADDRESS": HOST_APP_DEV,
    "CONFIGURATION" : HOST_APP_DEV+'/config/',
    "IP_REMOTE":IP_PROD
}
module.exports = endpoint;
