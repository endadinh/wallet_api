const express = require('express');
const api_router = express.Router();
const Wallet = require('../Controller/wallet');
const response = require('../utils/response');
const walletClass = new Wallet;


api_router.get('/create', async (req, res) => {
    let result = await walletClass.createNew();
    res.send(JSON.stringify(result));


})

api_router.get('/valid', async (req, res) => {

    const address = req.body.address;
    let result = await walletClass.checkValid(address);
    res.send(JSON.stringify(result));

})

api_router.get('/balance', async (req, res) => {
    const address = req.body.address;
    let result = await walletClass.getBalance(address);
    res.send(JSON.stringify(result));

})

api_router.get('/get-transactions', async (req, res) => {
    const address = req.body.address;
    let result = await walletClass.getTransaction(address);
    res.send(JSON.stringify(result));
})

api_router.get('/send-bnb', async (req, res) => {
    const sendAddress = req.body.sendAddress;
    const recipient = req.body.recipient;
    const privateKey = req.body.privateKey;
    const value = req.body.value;
    let result = await walletClass.sendBNB(sendAddress, privateKey, recipient, value);
    console.log(result);
    res.send(JSON.stringify(result));
})

api_router.get('/send-aft', async (req, res) =>  { 
    const sendAddress = req.body.sendAddress;
    const recipient = req.body.recipient;
    const privateKey = req.body.privateKey;
    const value = req.body.value;
    let result = await walletClass.sendAFT(sendAddress, privateKey, recipient, value);
    console.log(result);
    res.send(JSON.stringify(result));
})




module.exports = api_router;