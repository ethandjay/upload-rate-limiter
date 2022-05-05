const axios = require('axios');

const sendRequest = async () => {
    await axios
    .post('http://localhost:3000/upload', {
        fileData: '110101001000110',
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

const randomTimeout = () => {
    setTimeout(randomTimeout, (Math.random() * 400) - 200)
    sendRequest()
}
randomTimeout()