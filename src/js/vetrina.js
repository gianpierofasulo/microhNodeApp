window.onload = async () => {
    const layoutSelect = document.getElementById("layoutSelect")
    layoutSelect.addEventListener("change", event => {
        setLayout(event.target.value)
        const parent = document.getElementById("vetrinaGrid")
        parent.dataset.layout = event.target.value
        loadGrid()
    })
    const cardSelect = document.getElementById("cardSelect")
    cardSelect.addEventListener("change", event => {
        setLayoutCard(event.target.value)
    })

    const subcategorySelect = document.getElementById("form_subcategories")
    subcategorySelect.addEventListener("change", function () {
        updateProductList('', this.value)
    });
    loadGrid()
    updateCategoryList()
}

async function updateCategoryList() {
    const resC = await fetch('/categorie/farmacia')
    const subcategories = await resC.json()
    const categoriesList = document.getElementById("form_subcategories")
    categoriesList.innerHTML = ""
    const optionElement = document.createElement('option')
    optionElement.value = ""
    optionElement.textContent = " -- "
    categoriesList.appendChild(optionElement)
    subcategories.forEach(o => {
        const optionElement = document.createElement('option')
        optionElement.value = o.id
        optionElement.textContent = o.label
        categoriesList.appendChild(optionElement)
    })
}

async function updateProductList(prodotto_id, subcategory = "") {
    const res = await fetch('/product/channels')
    const channels = await res.json()
    const list = document.getElementById("form_products")
    list.innerHTML = ""
    console.log(channels)
    channels.forEach(o => {
        if (o.subcategory == subcategory || subcategory == "") {
            const optionElement = document.createElement('option')
            optionElement.value = o.prodotto_id
            optionElement.textContent = o.titolo
            if (prodotto_id == o.prodotto_id) optionElement.selected = true
            list.appendChild(optionElement)
        }
    })
}

async function editSlot(id_slot, prodotto_id) {
    try {
        const subcategory = document.getElementById("form_subcategories").value
        await updateProductList(prodotto_id, subcategory)
        document.getElementById("form_label_products").innerHTML = `Selezione Prodotto Per Slot ${id_slot + 1}`
        document.getElementById("form_id_slot").value = id_slot
        const modal = document.getElementById("modalVetrinaDigitale")
        modal.style.display = "block"
    } catch (e) {
        console.log('err. editSlot', e)
    }
}

async function setLayoutCard(layout_card) {
    try {
        const id_vetrina = document.getElementById("form_id_vetrina").value
        await fetch(`/vetrina/${id_vetrina}/set_layout_card`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ layout_card })
        })
        loadGrid()
    } catch (e) {
        console.log('err. saveSlot', e)
    }
}

async function setLayout(layout) {
    try {
        const id_vetrina = document.getElementById("form_id_vetrina").value
        await fetch(`/vetrina/${id_vetrina}/set_layout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ layout })
        })
        loadGrid()
    } catch (e) {
        console.log('err. saveSlot', e)
    }
}

async function clearSlot(id_slot) {
    try {
        const id_vetrina = document.getElementById("form_id_vetrina").value
        if (confirm("Eliminare contenuto della slot?")) {
            await fetch(`/vetrina/${id_vetrina}/delete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id_slot })
            })
            loadGrid()
        }
    } catch (e) {
        console.log('err. saveSlot', e)
    }
}

function saveSlot() {
    const id_vetrina = document.getElementById("form_id_vetrina").value
    const id_slot = document.getElementById("form_id_slot").value
    const prodotto_id = document.getElementById("form_products").value
    const p = { id_slot, prodotto_id, id_vetrina }
    fetch('/vetrina/' + id_vetrina, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(p)
    }).then(() => {
        loadGrid()
        closeModal()
    })

}

function closeModal() {
    const modal = document.getElementById("modalVetrinaDigitale")
    modal.style.display = "none"
}

async function loadGrid() {
    const id_vetrina = document.getElementById("form_id_vetrina").value
    const resV = await fetch('/vetrina/' + id_vetrina)
    const vetrina = await resV.json()
    const title = document.getElementById("title_vetrina")
    title.innerHTML = vetrina.title
    const parent = document.getElementById("vetrinaGrid")
    parent.innerHTML = ""
    const layout = vetrina.layout
    const cols = layout.split("x")[0]
    const rows = layout.split("x")[1]
    const templateSlot = (id_slot, item) => `
        <div class="card-body d-flex justify-content-between flex-column" id="slot_${id_slot}">
        <div>
            <h5 class="card-title">Item ${id_slot + 1}</h5>
            ${item ? `<h6 class="card-subtitle mb-2">${item.titolo}</h6>` :
            `<h6 class="card-subtitle mb-2 text-muted">Vuoto</h6>`}
        </div>
                <a style="margin:auto" onclick="editSlot('${id_slot}', ${item ? item.prodotto_id : null})">
                    <div class="text-center">
                        ${item ? `<img class="card__image" src="${item.immagine}"/>` :
            `<p class="card__image text-center bi-bag-plus add-prod mb-3"></p>`}
                    </div>
                </a>
                <div class="text-center">
                    ${item ? `<a onclick="clearSlot(${id_slot})"><span class="bi-trash mb-3"></span></a>` : ""}
                </div>
        </div>`
    for (let r = 0; r < rows; r++) {
        const row = document.createElement('div');
        row.classList.add("gx-5", "mb-2", "d-flex", "flex-row", "card-list")
        for (let c = 0; c < cols; c++) {
            const id_slot = c + cols * r
            const slot = vetrina.slots.find(s => s.id_slot == id_slot)
            const card = document.createElement('div');
            card.classList.add("card", "flex-fill")
            card.innerHTML = templateSlot(id_slot, slot).trim()
            row.appendChild(card)
        }
        parent.appendChild(row)
    }
}


