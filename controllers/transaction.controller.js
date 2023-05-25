const fetch = require('node-fetch');
const JSONStore = require('../classes/JsonStore.class.js');
const Transaction = require('../classes/Transaction.class.js');
const activeTransaction = './public/data/transaction/active-transaction.json';
const listTransaction = './public/data/transaction/transaction-list.json';



exports.getTransactions = () => {

   let transactionsFile = new JSONStore(listTransaction);
   let transactions = transactionsFile.read();
   if(transactions){
      return transactions
     
   }

}

exports.checkTransaction = () => {

      let Store = new JSONStore(activeTransaction);
      let active = Store.read();
      let transaction;
      if(active){
         return true
        
      }

}

exports.createTransaction = (state,cash) => { 

   if (state) {
      let Store = new JSONStore(activeTransaction);
      let active = Store.read();
      let transaction;
      if(active){
         if(active.state == 'pending'){
            return active;
         }else{
            let obj = new Transaction(null,state,cash);
            transaction = obj.initTransaction();
            return transaction;
         }
      }else{
         let obj = new Transaction(null,state,cash);
         transaction = obj.initTransaction();
         return transaction;
      }
   
   }

};

exports.updateTransaction = (state,cash,type) => { 

   if (state) {
      let Store = new JSONStore(activeTransaction);
      let active = Store.read();
      let transaction = Transaction.updateTransaction(active,state,cash,type);
      return transaction;
   }

   return json

};