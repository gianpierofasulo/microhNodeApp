const path = require('path');
const fs = require('fs');


module.exports = class Modal {
    constructor(type, title, message, callbackmodal) {

        this.type = type;
        this.title = title;
        this.message = message;
        this.okButton = this.okButton.bind(this);
        this.cancelButton = this.cancelButton.bind(this);
        this.modal;
        this.buildModal(this.type,this.title,this.messaggio);
        this.callbackmodal = callbackmodal;
        
    }


    buildModal(){

        if (this.type == 'Select') {

            const bodyPage = document.getElementsByTagName("body")[0]
            let codiceHtml = this.getTemplateSelect(this.title, this.message)
            bodyPage.innerHTML += codiceHtml

            document.getElementById('bottoneOK').addEventListener("click", this.okButton );
        
        }

        if (this.type =='Alert') {
            console.log('sono una alert');
            const bodyPage = document.getElementsByTagName("body")[0]
            let codiceHtml = this.getTemplateAlert(this.title, this.message)
            bodyPage.innerHTML += codiceHtml
           
        }

        let modal = document.getElementById('myModal');
        this.modal = modal;
        this.show();

        document.getElementById('bottoneCancel').addEventListener("click", this.cancelButton )

    }


    show(){
        this.modal.style.display = "block";
    }


    hide(){
        this.modal.style.display = "none";
    }


    okButton() {
        this.callbackmodal(true);
    }

    cancelButton() {
        this.hide();
    }
   
    getTemplateSelect(title, message) {

        const html = '<div class="modal" id="myModal" >'
                   +    '<div class="modal-dialog">'
                   +       '<div class="modal-content">'
                   +         '<div class="modal-header">'
                   +           '<h2 class="modal-title">'+ title +'</h2>'
                   +         '</div>'
                   +         '<div class="modal-body modal-border">'
                   +         '<h3 class="modal-message">'+ message +'</h3>' 
                   +         '</div>'
                   +         '<div class="col-12">'
                   +           '<div class="col-6" style="float:left;"><button type="button" class="btn btn-close-modal" id="bottoneCancel">ANNULLA</button></div>'
                   +           '<div class="col-6" style="float:right;"><button type="button" class="btn btn-confirm-modal" id="bottoneOK">CONFERMA</button></div>'
                   +         '</div>'
                   +       '</div>'
                   +     '</div>'
                   +   '</div>'
        this.html = html;
        return html
    }

    getTemplateAlert(title, message) {

        const html = '<div class="modal" id="myModal">'
                   +    '<div class="modal-dialog">'
                   +       '<div class="modal-content">'
                   +         '<div class="modal-header">'
                   +           '<h2 class="modal-title">'+ title +'</h2>'
                   +         '</div>'
                   +         '<div class="modal-body">'
                   +         '<h3>'+ message +'</h3>'
                   +         '</div>'
                   +         '<div class="modal-footer">'
                   +           '<button type="button" class="btn btn-close-modal" id="bottoneCancel">CHIUDI</button>'
                   +         '</div>'
                   +       '</div>'
                   +     '</div>'
                   +   '</div>'
        this.html = html;
        return html
    }

 
}
