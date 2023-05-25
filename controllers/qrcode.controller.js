// Dotenv
require('dotenv').config()
const ProductController = require('./channels.controller')

const QRCode = require('qrcode')

exports.createQr = (alias,prodotto_id) => {

    // Creating the data
    //get product info
    //let product = ProductController.getChannelByAlias(alias);


    let data = {
        url:'http://192.168.1.96:8888/microhard-checkout/index.html?alias='+alias+'&prodotto_id='+prodotto_id
    }

    // Converting the data into String format
    let stringdata = JSON.stringify(data)

    // Print the QR code to terminal
    QRCode.toString(stringdata,{type:'terminal'}, function (err, QRcode) {
        if(err) return console.log("error occurred")

        // Printing the generated code
        // console.log(QRcode)
    })

    // Converting the data into base64
    QRCode.toDataURL(stringdata, function (err, code) {
        if(err) return console.log("error occurred")

        // Printing the code
        // console.log(code)
    })

    QRCode.toFile('public/media/qr/payment/qrcode-payment.png', data.url, {
        color: {
        dark: '#000',   // Black dots
        light: '#fff'   // White background
        }
    }, function (err) {
        if (err) throw err
        console.log('Qr Code building done!')

    })
};