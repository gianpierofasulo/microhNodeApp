import Chart from 'chart.js/auto';

//Vendite totali
window.addEventListener('load', async () => {
    getTransactions();
    getContabilitaMotori();
});


async function getContabilitaMotori(id_slot, prodotto_id) {
    try {
        const res = await fetch('/contabilita/motori/get')
        const contabilita_mototi = await res.json()
        let motori = [];
        let valori = [];

        let maggiore = 0;
        let prodotto_maggiore;
        
        for(let i = 0; i < contabilita_mototi.length; i++){
            let motore_numero = contabilita_mototi[i].motore + ' - ' + contabilita_mototi[i].alias;
            motori.push(motore_numero)
            valori.push((contabilita_mototi[i].incasso/100).toFixed(2));
            if(contabilita_mototi[i].incasso > maggiore){
                maggiore = contabilita_mototi[i].incasso;
                prodotto_maggiore = contabilita_mototi[i];
            }
            
        }

        const prod = await fetch(`/product/${prodotto_maggiore.prodotto}`)
        const prodotto = await prod.json()

        var data = {
            labels: motori,
            datasets: [{
              label: "Motori",
              backgroundColor: "rgba(187, 134, 252,0.2)",
              borderColor: "rgba(187, 134, 252,1)",
              borderWidth: 2,
              hoverBackgroundColor: "rgba(187, 134, 252,0.4)",
              hoverBorderColor: "rgba(187, 134, 252,1)",
              data: valori,
            }]
          };
          var options = {
            maintainAspectRatio: false,
            scales: {
              y: {
                stacked: true,
                grid: {
                  display: false,
                  color: "rgba(187, 134, 252,0.2)"
                }
              },
              x: {
                grid: {
                  display: false
                }
              }
            }
          };
          new Chart('chart-motori', {
            type: 'bar',
            options: options,
            data: data
          });

          

          let prodotto_maggiore_box = document.getElementById('prodotto-maggiore')
          let prodotto_maggiore_title = prodotto_maggiore_box.querySelector('h3');
          let prodotto_maggiore_body = prodotto_maggiore_box.querySelector('h2');
          let prodotto_maggiore_img = prodotto_maggiore_box.querySelector('img');

          prodotto_maggiore_body.innerHTML = (prodotto_maggiore.incasso/100).toFixed(2) + ' €';
          prodotto_maggiore_title.innerHTML = prodotto_maggiore.titolo_prodotto;
          prodotto_maggiore_img.src = prodotto.immagine;


    } catch (e) {
        console.log('err. getContabilitaMotori', e)
    }





}

async function getTransactions(id_slot, prodotto_id) {
    try {
        const res = await fetch('/transactions/get')
        const transactions = await res.json()

        // const list = document.getElementById("form_products")
        // list.innerHTML = ""
        let array_labels =  ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug","Ago","Set","Ott","Nov","Dic"];
        let array_month = [
          {month:'01',value:0,totale:0,label:"Gennaio"},
          {month:'02',value:0,totale:0,label:"Febbraio"},
          {month:'03',value:0,totale:0,label:"Marzo"},
          {month:'04',value:0,totale:0,label:"Aprile"},
          {month:'05',value:0,totale:0,label:"Maggio"},
          {month:'06',value:0,totale:0,label:"Giugno"},
          {month:'07',value:0,totale:0,label:"Luglio"},
          {month:'08',value:0,totale:0,label:"Agosto"},
          {month:'09',value:0,totale:0,label:"Settembre"},
          {month:'10',value:0,totale:0,label:"Ottobre"},
          {month:'11',value:0,totale:0,label:"Novembre"},
          {month:'12',value:0,totale:0,label:"Dicembre"}
        ];

        let totale_mese = 0;
        let toale_vendite = 0;

        for(let i = 0; i < transactions.length; i++){
            let date = transactions[i].date;
            let array_date = date.split('/');
            toale_vendite += transactions[i].prezzo_prodotto;
            for(let j = 0; j < array_month.length; j++){
              if(array_month[j].month == array_date[1]){
                //array_month[j].value += transactions[i].prezzo_prodotto;
                array_month[j].value += 1;
                array_month[j].totale += transactions[i].prezzo_prodotto;
              }
              
            }

        }

        var data = {
            labels: array_labels,
            datasets: [{
              label: "N° Vendite",
              backgroundColor: "rgba(89,196,191,0.2)",
              borderColor: "rgba(89,196,191,1)",
              borderWidth: 2,
              hoverBackgroundColor: "rgba(89,196,191,0.4)",
              hoverBorderColor: "rgba(89,196,191,1)",
              data: [
                array_month[0].value, 
                array_month[1].value,
                array_month[2].value, 
                array_month[3].value,
                array_month[4].value, 
                array_month[5].value,
                array_month[6].value
              ],
            }]
          };
          var options = {
            maintainAspectRatio: false,
            scales: {
              y: {
                stacked: true,
                grid: {
                  display: false,
                  color: "rgba(89,196,191,0.2)"
                }
              },
              x: {
                grid: {
                  display: false
                }
              }
            }
          };
          new Chart('chart', {
            type: 'bar',
            options: options,
            data: data
          });

          //totale vendite

          let totale_vendite_box = document.getElementById('incasso-totale').querySelector('h2');
          totale_vendite_box.innerHTML = (toale_vendite/100).toFixed(2) + ' €'

          let totale_mese_box = document.getElementById('incasso-mese').querySelector('h2');
          totale_mese_box.innerHTML = (array_month[1].totale/100).toFixed(2) + ' €'

          //totale mese


    } catch (e) {
        console.log('err. transaction_errors', e)
    }





}


