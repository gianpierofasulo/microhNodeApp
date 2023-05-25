async function changeVetrina18(vetrina_id) {
    let status = document.getElementById('vetrina_status_' + vetrina_id).checked;
    try {
        await fetch('/vetrina/' + vetrina_id + '/over_18', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status })
        })
    } catch (e) {
        console.log('err. changeVetrina18', e)
    }
}


async function changeVetrineState(vetrina_id) {
    let status = document.getElementById('vetrina_status_' + vetrina_id).checked;
    try {
        await fetch('/vetrina/' + vetrina_id + '/state', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status })
        })
    } catch (e) {
        console.log('err. changeVetrinaState', e)
    }
}

function closeModals() {
    const modal = document.getElementById("modalVetrineIcons")
    modal.style.display = "none"
}

function openVetrineIconsModal(vetrina_id) {
    try {
        const modal = document.getElementById("modalVetrineIcons")
        modal.style.display = "block"
        document.getElementById("form_vetrine_image_title").innerHTML = `Cambia immagine per Vetrina "${vetrina_id}"`
        document.getElementById("form_vetrine_image_vetrina_id").value = vetrina_id
    } catch (e) {
        console.log('err. addBanner', e)
    }
}

async function changeVetrineIcon() {
    const vetrina_id = document.getElementById("form_vetrine_image_vetrina_id").value
    const icons = document.querySelectorAll('input[name="image"]:checked')
    if (icons.length) {
        const icon = icons[0].value;
        try {
            await fetch('/vetrina/' + vetrina_id + '/change_icon', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ icon })
            })
            closeModals()
            location.reload()
        } catch (e) {
            console.log('err. addNewImage', e)
        }
    } else alert("Selezionare una immagine")
}

