//
// creazione del banner
async function addNewBanner() {
    const inputBanner = document.getElementById("form_banner_id")
    const banner_id = inputBanner.value
    if (banner_id) {
        try {
            await fetch('/banner', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ banner_id })
            })
            closeModals()
            location.reload()
        } catch (e) {
            console.log('err. addNewBanner', e)
        }
    } else alert("Inserire il nome del banner")
}

function openNewBannerModal(banner_id) {
    try {
        const modal = document.getElementById("modalBannerManagerAddBanner")
        document.getElementById("form_banner_image_title").innerHTML = `Aggiungi immagine per banner "${banner_id}"`
        modal.style.display = "block"
    } catch (e) {
        console.log('err. addBanner', e)
    }
}

//
// aggiunta immagine al banner
function openImageModal(banner_id) {
    try {
        const modal = document.getElementById("modalBannerManagerAddImage")
        document.getElementById("form_banner_image_title").innerHTML = `Aggiungi immagine per banner "${banner_id}"`
        document.getElementById("form_banner_image_banner_id").value = banner_id
        modal.style.display = "block"
    } catch (e) {
        console.log('err. addBanner', e)
    }
}

async function addNewImage() {
    const banner_id = document.getElementById("form_banner_image_banner_id").value
    const images = document.querySelectorAll('input[name="image"]:checked')
    if (images.length) {
        const image = images[0].value;
        try {
            await fetch('/banner/' + banner_id + '/add_image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image })
            })
            closeModals()
            location.reload()
        } catch (e) {
            console.log('err. addNewImage', e)
        }
    } else alert("Selezionare una immagine")
}

//
// remove immagine al banner

async function removeImage(image, banner_id) {
    try {
        if (confirm("Eliminare immagine del banner?")) {
            await fetch('/banner/'+banner_id+'/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image })
            })
            location.reload()
        }
    } catch (e) {
        console.log('err. removeImage', e)
    }
}

async function changeBannerState(banner_id) {

    let status = document.getElementById('banner_status_'+banner_id).checked;
    try {
        await fetch('/banner/'+banner_id+'/state', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status })
        })
    } catch (e) {
        console.log('err. changeBannerState', e)
    }
}


function closeModals() {
    const modalImage = document.getElementById("modalBannerManagerAddImage")
    const modalBanner = document.getElementById("modalBannerManagerAddBanner")
    modalImage.style.display = "none"
    modalBanner.style.display = "none"
    //clear field
    const inputBanner = document.getElementById("form_banner_id")
    inputBanner.value = ""
}

