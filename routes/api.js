const express = require('express');
const api_router = express.Router();
const Wallet = require('../Controller/wallet');
const response = require('../utils/response');
const walletClass = new Wallet;



 /**
   * @swagger
   * /wallet/create:
   *   get:
   *     description: Create new wallet
   *     responses:
   *       200:
   *         description: Create new wallet
   */


api_router.get('/create', async (req, res) => {
    try {
        let result = await walletClass.createNew();
        res.send(JSON.stringify(result));
    }
    catch (error) {
        return res.status(500).send(error);
    }


})

api_router.get('/valid', async (req, res) => {
    try {

        const address = req.body.address;
        let result = await walletClass.checkValid(address);
        res.send(JSON.stringify(result));
    }
    catch (error) {
        return res.status(500).send(error);
    }


})

/** 
 * @swagger 
 * paths:
 *  /wallet/balance:
 *    post:
 *      summary: Creates a new user.
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: body
 *          name: user
 *          description: The user to create.
 *          schema:
 *            type: object
 *            required:
 *              - userName
 *            properties:
 *              userName:
 *                type: string
 *              firstName:
 *                type: string
 *              lastName:
 *                type: string
 *      responses:
 *        201:
 *          description: Created
 * 
 */

api_router.post('/balance', async (req, res) => {
    try {
        const address = req.body.address;
        let result = await walletClass.getBalance(address);
        res.send(JSON.stringify(result));
    }
    catch (error) {
        return res.status(500).send(error);
    }

})

api_router.get('/get-transactions', async (req, res) => {
    try {

        const address = req.body.address;
        let result = await walletClass.getTransaction(address);
        res.send(JSON.stringify(result));

    }
    catch (error) {
        return res.status(500).send(error);
    }
})

api_router.get('/send-bnb', async (req, res) => {
    try {
        const sendAddress = req.body.sendAddress;
        const recipient = req.body.recipient;
        const privateKey = req.body.privateKey;
        const value = req.body.value;
        let result = await walletClass.sendBNB(sendAddress, privateKey, recipient, value);
        console.log(result);
        res.send(JSON.stringify(result));
    }
    catch (error) {
        return res.status(500).send(error);
    }
})

api_router.get('/send-aft', async (req, res) => {
    try {

        const sendAddress = req.body.sendAddress;
        const recipient = req.body.recipient;
        const privateKey = req.body.privateKey;
        const value = req.body.value;
        let result = await walletClass.sendAFT(sendAddress, privateKey, recipient, value);
        console.log(result);
        res.send(JSON.stringify(result));

    }
    catch (error) {
        return res.status(500).send(error);
    }
})




module.exports = api_router;