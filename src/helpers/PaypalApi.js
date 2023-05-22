let baseUrl = 'https://api-m.sandbox.paypal.com';
const base64 = require('base-64');

const clientId = 'AWtlW8nUEWBcbCKs7aEugjoAhq4rZuoGAZVbTBa1Opqz9oNpnaT5-lJ76DnSMaxh1eFGGU-Z2PUX1jPh';
const secret = 'EO3DxOn9Xul2eSfcnBI0PRkj4FDoqSWYN5N6qLkXzoq1VjSDyJADsRgQcmG3wfqoxBfIjYQGHBIaTTKz';

const generateToken = async () => {
    const headers = new Headers();
    headers.append('Authorization', 'Basic ' + base64.encode(clientId + ':' + secret));
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    const options = {
        method: 'POST',
        headers: headers,
        body: 'grant_type=client_credentials'
    }

    return new Promise((resolve, reject) => {
        fetch(baseUrl + '/v1/oauth2/token', options)
            .then(res => res.text())
            .then(res => {
                //console.log("generateToken: ", res);
                const { access_token } = JSON.parse(res);
                resolve(access_token);
            })
            .catch(err => {
                console.log("generateToken err: ", err);  
                reject(err);
            });
    });
};

const createOrder = async (token, data) => {
    const option = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(data),
    };

    return new Promise((resolve, reject) => {
        fetch(baseUrl + '/v2/checkout/orders', option)
            .then(res => res.text())
            .then(res => {
                //console.log("createOrder: ", res);
                const response = JSON.parse(res);
                resolve(response);
            })
            .catch(err => {
                console.log("createOrder err: ", err);  
                reject(err);
            });
    });
};

const capturePayment = async (id, token) => {
    const option = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
    }

    return new Promise((resolve, reject) => {
        fetch(baseUrl + `/v2/checkout/orders/${id}/capture`, option)
            .then(res => res.text())
            .then(res => {
                console.log("capturePayment: ", res);
                const response = JSON.parse(res);
                resolve(response);
            })
            .catch(err => {
                console.log("capturePayment err: ", err);  
                reject(err);
            });
    });
};

export default {
    generateToken, createOrder, capturePayment
};