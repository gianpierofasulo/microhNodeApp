const fileSystem = require("fs")

class JSONStore {
    constructor(filePath) {
        this.filePath = filePath;
    }

    read() {
        try {
            return JSON.parse(fileSystem.readFileSync(this.filePath, 'utf8'));
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    writeAsync(data) {
        try {
            return fileSystem.writeFile(this.filePath, JSON.stringify(data));
        } catch (error) {
            if(process.env.DEBUG == 1 && process.env.DEBUG_ERRORS == 1) {
                console.error('@@ ERRORS JSON STORE----->',error);
            }
            return false;
        }
    }
    write(data) {
        try {
            fileSystem.writeFileSync(this.filePath, JSON.stringify(data));
            return true;
        } catch (error) {
            if(process.env.DEBUG == 1 && process.env.DEBUG_ERRORS == 1) {
                console.error('@@ ERRORS JSON STORE----->',error);
            }
            return false;
        }
    }
}


module.exports = JSONStore;


