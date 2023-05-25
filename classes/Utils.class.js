const path = require('path');
const fs = require('fs');
//const { readdir } = require('fs').promises;

module.exports = class Utils {
    constructor() {
    }

    static getTimestampInSeconds () {
        return Math.floor(Date.now() / 1000)
    }

    static getTimestamp () {
        return Math.floor(Date.now());
    }

    static getDateCurrent () {
        const today = new Date();
        const yyyy = today.getFullYear();
        let mm = today.getMonth() + 1; // Months start at 0!
        let dd = today.getDate();

        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;

        const formattedToday = dd + '/' + mm + '/' + yyyy;

        return formattedToday;
    }

    static paginazione(items, page, per_page) {

        var page = page || 1,
        per_page = per_page || 10,
        offset = (page - 1) * per_page,
      
          paginatedItems = items.slice(offset).slice(0, per_page),
          total_pages = Math.ceil(items.length / per_page);
        return {
          page: page,
          pre_page: per_page,
          per_page: page - 1 ? page - 1 : null,
          next_page: (total_pages > page) ? page + 1 : null,
          total: items.length,
          total_pages: total_pages,
          data: paginatedItems
        };
    }

    // restituisce la lista files e la loro grandezza in Kb nella directory passata come argomento
    static listafiles(directoryPath) {
      const elencofiles = fs.readdirSync( directoryPath, {withFileTypes: true})
                .filter(item => !item.isDirectory())
                .map(item  => { return { name: item.name, size: (fs.statSync(directoryPath + '/' +item.name).size /1024).toFixed(2) + ' Kb' } })

      return elencofiles;
    }

    // restituisce la lista files e la loro data di creazione
    static listafilescondata(directoryPath) { 
     
      let elencofiles = fs.readdirSync( directoryPath, {withFileTypes: true})
      .filter( item => !item.isDirectory() && item.name != 'token.json' && item.name != 'ip.json' && item.name != 'canali.json' && item.name != 'categorie.json'  )
      .map(item  => { return { name: item.name, datacreazione: (fs.statSync(directoryPath + '/' + item.name).ctime.toLocaleString() ) } })

      return elencofiles;
    }

    static listafilescondataInCartella(directoryPath) {
      let elencofiles = fs.readdirSync( directoryPath, {withFileTypes: true})
      .filter(item => !item.isDirectory())
      .map(item  => { return { name: item.name, datacreazione: (fs.statSync(directoryPath + '/' + item.name).ctime.toLocaleString() ) } })

      return elencofiles;
    }

 
    
    


    static truncate(str, n){
      return (str.length > n) ? str.slice(0, n-1) + '&hellip;' : str;
    };

}
