const LOG_FILE = './public/data/logs/log.json';

module.exports = class Logger {
  constructor() {
    this.logs;
  }

  static log(type,message) {
    // Creiamo un oggetto log con il messaggio e la data corrente
    const log = {
      type: type,
      message,
      date: new Date(),
    };

    const JSONStore = require('./JsonStore.class');
    let Store = new JSONStore(LOG_FILE);
    this.logs = Store.read()
    // Aggiungiamo il log all'array dei logs
    this.logs.push(log);

    // Scriviamo il file
    Store.write(this.logs);
  }

  static readLog() {
    const JSONStore = require('./JsonStore.class');
    let Store = new JSONStore(LOG_FILE);
    this.logs = Store.read()
    return this.logs;
  }


}

