const axios = require('axios');
const crypto = require('crypto')

const sendRequest = async () => {
    await axios
    .post('http://localhost:3000/upload', {
        fileData: generateFileData()
    }, {
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        }
    })
    .then(res => {
        console.log(`statusCode: ${res.status}`);
    })
    .catch(err => {
        console.log(`err: ${err}`)
    })
}

const generateFileData = () => {
    const seed = '10011100101011011011010010101001011010010010010110101101010101101010101101101010011101011010111001010010010110101101010101001011101011'
    return seed.substring(seed.length * .25 * Math.random())
}

const RATE = 200
const sendRandomRequests = () => {
    sendRequest()
    setTimeout(sendRandomRequests, RATE + ((Math.random() * RATE) - RATE/2))
}

sendRandomRequests()