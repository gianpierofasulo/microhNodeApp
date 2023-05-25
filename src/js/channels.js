
const { fetchData } = require('./config');
const modalClass = require('../../classes/Modal.class');
const socketController = require('../../controllers/socket.controller')

window.addEventListener("load", function() {

    let barcode_field = document.getElementById('formBarcode');
    socketController.barcode(barcode_field);

    let vetrina = document.getElementById('vetrina');
    let matricola = document.getElementById('matricola');

    fetchData().then((data) => {

        window.remove_channel = (group) => {

            let canale = document.getElementById('FormCanale').value;
            if (canale) {
                fetch('/channel/' + group + '/' + canale + '/delete').then((res) => {
                    return res.json();
                }).then((data) => {
                    let reload = () => {
                        location.reload();
                    }
                    if (data) {
                        modal = new modalClass('Select', 'MESSAGGIO', 'Canale svuotato correttamente', reload);

                    }

                }).catch(function(err) {
                    console.log(err)
                    modal = new modalClass('Alert', 'MESSAGGIO', 'Canale non svuotato');
                });
            }
        }

        window.update_channel = (group) => {
            let form_update_prod = document.getElementById('update_prod');
            let id_prodotto = document.getElementById('FormProdotto').value;
            let canale = document.getElementById('FormCanale').value;
            let formData = {};
            for (let field of form_update_prod) {
                let name = field.getAttribute('name');

                let val = field.value;
                Object.assign(formData, { [name]: val });
            }

            if (formData.canale != null) {
                //Aggiorninamo catalogo
                let id_prod = formData.id_prodotto ? formData.id_prodotto : 0;
                fetch('/update-product/' + id_prod,
                    {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(formData)
                    }).then((res) => {
                        return res.json();
                    }).then((data) => {

                        let body_concat = {
                            ...data,
                            related:formData.related
                        }
                        //Aggiorniamo canale
                        if (body_concat) {
                            fetch('/product/channels/' + group + '/' + formData.canale,
                                {
                                    method: "POST",
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(body_concat)
                                }).then((res) => {
                                    return res.json();
                                }).then((data) => {

                                    let reload = () => {
                                        location.reload();
                                    }
                                    if (data) {
                                        modal = new modalClass('Select', 'MESSAGGIO', 'Canale salvato correttamente, aggiornare?', reload);

                                    }

                                }).catch(function(err) {
                                    console.log(err)
                                    if (data) {
                                        modal = new modalClass('Alert', 'MESSAGGIO', 'Canale non aggiornato');
                                    }

                                });
                        }

                    }).catch(function(err) {
                        console.log(err)
                        if (data) {
                            modal = new modalClass('Alert', 'MESSAGGIO', 'Catalogo non aggiornato');
                        }


                    });
            } else {

                modal = new modalClass('Alert', 'MESSAGGIO', 'Selezionare un canale');

            }

        }

        window.get_product = (group, code, canale, alias) => {
            let activation = document.getElementById('form-salvataggio-canale');
            activation.classList.add('active');

            if (code > 0) {
                fetch('/configure/' + group + '/' + code + '/' + canale).then(res => {
                    return res.json();
                }
                ).then(async (prod) => {
                    let categorie = []
                    try {
                        const res = await fetch('/categorie/' + prod.category, {
                            method: 'get',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        })
                        categorie = await res.json()
                    } catch (e) {
                        console.log('err. load categorie', e)
                    }

                    // creo select delle sottocategorie e assegno il valore
                    const catList = document.getElementById('categoriaProdotto')
                    catList.innerHTML = ''
                    const emptyOption = document.createElement("option");
                    emptyOption.value = '';
                    emptyOption.text = ' -- ';
                    catList.appendChild(emptyOption);
                    categorie.forEach(cat => {
                        var option = document.createElement("option");
                        option.value = cat.id;
                        option.text = cat.label;
                        catList.appendChild(option);
                    })
                    catList.value = prod.subcategory || '';

                    //console.log(data.id_esercente,data.id_macchina);
                    document.getElementById('formNome').value = prod.titolo;
                    document.getElementById('Profondita').value = prod.profondita;
                    document.getElementById('formAlias').value = alias;
                    document.getElementById('larghezza').value = prod.larghezza;
                    document.getElementById('related').value = prod.related;
                    document.getElementById('codice').value = prod.codice_a_barre;
                    document.getElementById('formPrezzo').value = prod.prezzo;
                    document.getElementById('descrizione').value = prod.descrizione;
                    //document.getElementById('immagine').value = prod.immagine;
                    document.getElementById('img').src = prod.immagine;
                    document.getElementById('FormProdotto').value = prod.prodotto_id;
                    document.getElementById('FormCanale').value = canale;
                    document.getElementById('vendibile').value = prod.vendibile;
                    document.getElementById('minori').value = prod.ristretto_per_minori;
                    document.getElementById('otc').value = prod.vendibile_via_web;
                    document.getElementById('esenteIva').value = prod.iva_id;

                    document.querySelectorAll('input[type=checkbox]')
                        .forEach(function(item) {
                            if (item.value == 1) {
                                item.checked = true
                            }
                        })

                }
                );
            } else {
                //Prodotto da associare
                document.getElementById('formNome').value = '';
                document.getElementById('formAlias').value = alias;
                document.getElementById('Profondita').value = '';
                document.getElementById('larghezza').value = '';
                document.getElementById('related').value = '';
                document.getElementById('codice').value = '';
                document.getElementById('formPrezzo').value = '';
                document.getElementById('descrizione').value = '';
                //document.getElementById('immagine').value  = '';
                document.getElementById('img').src = '';
                document.getElementById('FormProdotto').value = '';
                document.getElementById('FormCanale').value = canale;
                document.getElementById('categoriaProdotto').value = '';
            }

        }

        window.barcode_search = () => {
            let search = document.getElementById('formBarcode').value;
            let canale = document.getElementById('FormCanale').value;
            let product;
            let channel;
            if (search.length > 0) {
                fetch("/product/barcode/" + search).then((res) => {
                    return res.json();
                }).then((barcode) => {
                    if(barcode){
                        product = barcode;
                        fetch("/channel/" + canale).then((res) => {
                            return res.json();
                        }).then((data) => {
                            channel = data;
                            document.getElementById('formNome').value = product.titolo;
                            document.getElementById('Profondita').value = product.profondita;
                            document.getElementById('larghezza').value = channel.larghezza;
                            document.getElementById('related').value = channel.related;
                            document.getElementById('codice').value = product.codice_a_barre;
                            document.getElementById('formPrezzo').value = product.prezzo;
                            document.getElementById('descrizione').value = product.descrizione;
                            //document.getElementById('immagine').value = product.immagine;
                            document.getElementById('img').src = product.immagine;
                            document.getElementById('FormProdotto').value = product.id;

                            document.getElementById('vendibile').value = product.vendibile;
                            document.getElementById('minori').value = product.ristretto_per_minori;
                            document.getElementById('otc').value = product.vendibile_via_web;
                            document.getElementById('esenteIva').value = product.iva_id;
                            document.getElementById('categoriaProdotto').value = prod.categoria_prodotto || '';

                            document.querySelectorAll('input[type=checkbox]')
                                .forEach(function(item) {
                                    if (item.value == 1) {
                                        item.checked = true
                                    }
                                })


                    }).catch((error) => {
                        console.log('error', error);
                        

                    });

                    }else{
                        document.getElementById('formNome').value = '';
                        document.getElementById('Profondita').value = '';
                        document.getElementById('larghezza').value = '';
                        document.getElementById('codice').value = '';
                        document.getElementById('formPrezzo').value = '';
                        document.getElementById('descrizione').value = '';
                        document.getElementById('img').src = '';
                        document.getElementById('FormProdotto').value = '';
                        document.getElementById('related').value = '';
                        document.getElementById('vendibile').value = '';
                        document.getElementById('minori').value = '';
                        document.getElementById('otc').value = '';
                        document.getElementById('esenteIva').value = '';
                        document.getElementById('categoriaProdotto').value = '';
                    }

                    
                }).catch((error) => {
                    console.log('error', error);
                });
            }
        }
        return data;
    });

});
