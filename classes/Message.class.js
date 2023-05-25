
const JSONStore = require('./JsonStore.class');
const UtilsClass = require('./Utils.class');

class Message {

    //Type (String): Alert, Dialog
    //Text (String): testo del messaggio
    //Display (boolean)

    //Returning object
    //text:"Erogazione in corso",
    //display:true,
    //type:'alert',
    //alert:true

    constructor(type,text,display,state) {
      //Contabilita generale
      this.type = type;
      this.text = text;
      this.display = display;
      this.state = state;

    }

    printMessage(){

      let display = 'display_';
      
      let obj = {
          text: this.text,
          type: this.type,
          [display+this.type]: this.display,
          [this.type]: true,
          state : this.state
      }

      return obj

    }

    setText(text){
      this.text = text;
    }

    setState(state){
      this.state = state;
    }
    setDisplay(display){
      this.display = display;
    }


}

module.exports = Message;


