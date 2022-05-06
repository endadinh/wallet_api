const express = require('express');
const api_router = express.Router();
const Wallet = require('../Controller/wallet');
const response = require('../utils/response');
const walletClass = new Wallet();


/**
 * @swagger
 *components: 
 *   schemas: 
 *     AccountResponse: 
 *       type: object
 *       properties: 
 *         code: 
 *           type: number
 *         account: 
 *           type: object
 *     BalanceResponse: 
 *       type: object
 *       properties: 
 *         code: 
 *           type: number
 *         BalanceBNB: 
 *           type: string
 *         BalanceToken:
 *           type: string
 *     ValidResponse: 
 *       type: object
 *       properties: 
 *         code: 
 *           type: number
 *         isValid: 
 *           type: boolean
 *     HistoryTx: 
 *       type: object
 *       properties: 
 *         code: 
 *           type: number
 *         txsBep20: 
 *           type: object
 *         txsList:
 *           type: object 
 *     TransactionResponse: 
 *       type: object
 *       properties: 
 *         code: 
 *           type: number
 *         TxsInfo:
 *           type: object         
 */



/**
 * @swagger
 * tags:
 *   name: Generate
 *   description: Generate new address and privateKey
 */

/**
 * @swagger
 * tags:
 *   name: Address
 *   description: Get information from wallet address.
 */



/**
* @swagger
* /wallet/create:
*   get:
*     description: Create new wallet + privatekey (on BSC Network);
*     tags: [Generate]
*     produces:
*       - application/json
*     parameters:
*       - name: network
*         description: Network wanna create (Mainnet = 1, Testnet = 0 )
*         in: query
*         required: true
*         type: number
*     responses:
*       200:
*         description: Return new generated address and privateKey
*         content: 
*             text/plain: 
*               schema: 
*                 $ref: "#/components/schemas/AccountResponse"
*             application/json: 
*               schema: 
*                 $ref: "#/components/schemas/AccountResponse"
*             text/json: 
*               schema: 
*                 $ref: "#/components/schemas/AccountResponse"
*           
*/

api_router.get('/create', async (req, res) => {
    const network = req.query.network;
    let result = await walletClass.createNew(network);
    res.send(JSON.stringify(result));
})


/**
 * @swagger
 * /wallet/valid:
 *   post:
 *     description: Check valid address
 *     tags: [Address]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: network
 *         description: Network wanna create (Mainnet = 1, Testnet = 0 )
 *         in: query
 *         required: true
 *         type: string
 *       - name: address
 *         description: wallet address.
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Check valid address
 *         content: 
*             text/plain: 
*               schema: 
*                 $ref: "#/components/schemas/ValidResponse"
*             application/json: 
*               schema: 
*                 $ref: "#/components/schemas/ValidResponse"
*             text/json: 
*               schema: 
*                 $ref: "#/components/schemas/ValidResponse"
 */

api_router.post('/valid', async (req, res) => {
    const network = req.query.network;
    const address = req.query.address;
    let result = await walletClass.checkValid(network, address);
    res.send(JSON.stringify(result));

})

/**
 * @swagger
 * tags:
 *   name: Balance
 *   description: Balance BNB and Token by Address
 */

/**
 * @swagger
 * /wallet/balance:
 *   post:
 *     description: Balance
 *     tags: [Balance]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: network
 *         description: Network wanna create (Mainnet = 1, Testnet = 0 )
 *         in: query
 *         required: true
 *         type: string
 *       - name: address
 *         description: User's address.
 *         in: query
 *         required: true
 *         type: string
 *       - name: tokenAddress
 *         description: Address of token to get balance .
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Balance by address
 *         content: 
*             text/plain: 
*               schema: 
*                 $ref: "#/components/schemas/BalanceResponse"
*             application/json: 
*               schema: 
*                 $ref: "#/components/schemas/BalanceResponse"
*             text/json: 
*               schema: 
*                 $ref: "#/components/schemas/BalanceResponse"
 */

api_router.post('/balance', async (req, res) => {
    const network = req.query.network
    const address = req.query.address;
    const tokenAddress = req.query.tokenAddress;
    console.log(address);

    let result = await walletClass.getBalance(network, address, tokenAddress);
    res.send(JSON.stringify(result));
})


/**
 * @swagger
 * /wallet/get-transactions:
 *   post:
 *     description: Get 10 recently txs by address
 *     tags: [Address]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: network
 *         description: Network wanna create (Mainnet = 1, Testnet = 0 )
 *         in: query
 *         required: true
 *         type: string
 *       - name: address
 *         description: wallet address.
 *         in: query
 *         required: true
 *         type: string
 *       - name: tokenAddress
 *         description: Address of token to get Txs.
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Transaction info
 *         content: 
*             text/plain: 
*               schema: 
*                 $ref: "#/components/schemas/HistoryTx"
*             application/json: 
*               schema: 
*                 $ref: "#/components/schemas/HistoryTx"
*             text/json: 
*               schema: 
*                 $ref: "#/components/schemas/HistoryTx"
 */


api_router.post('/get-transactions', async (req, res) => {
    try {
        const tokenAddress = req.query.tokenAddress
        const network = req.query.network
        const address = req.query.address;
        let result = await walletClass.getTransaction(network, address, tokenAddress);
        res.send(JSON.stringify(result));

    }
    catch (error) {
        return res.status(500).send(error);
    }
})


/**
 * @swagger
 * definitions:
 *   Address:
 *     required:
 *       - address
 *     properties:
 *       address:
 *         type: string
 *       path:
 *         type: string
 */


/**
 * @swagger
 * tags:
 *   - name: Transactions
 *     description: Send BNB
 */

/**
 * @swagger
 * /wallet/send-bnb:
 *   post:
 *     description: Send BNB to Address
 *     tags: [Transactions]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: network
 *         description: Network wanna create (Mainnet = 1, Testnet = 0 )
 *         in: query
 *         required: true
 *         type: string
 *       - name: sendAddress
 *         description: sendAddress.
 *         in: query
 *         required: true
 *         type: string
 *       - name: recipient
 *         description: recipient.
 *         in: query
 *         required: true
 *         type: string
 *       - name: privateKey
 *         description: private key.
 *         in: query
 *         required: true
 *         type: string
 *       - name: value
 *         description: value
 *         in: query
 *         required: true
 *         type: number
 *     responses:
 *       200:
 *         description: Transaction Info,
 *         content: 
*             text/plain: 
*               schema: 
*                 $ref: "#/components/schemas/TransactionResponse"
*             application/json: 
*               schema: 
*                 $ref: "#/components/schemas/TransactionResponse"
*             text/json: 
*               schema: 
*                 $ref: "#/components/schemas/TransactionResponse"
 */


api_router.post('/send-bnb', async (req, res) => {
    try {
        const network = req.query.network;
        const sendAddress = req.query.sendAddress;
        const recipient = req.query.recipient;
        const privateKey = req.query.privateKey;
        const value = req.query.value;
        let result = await walletClass.sendBNB(network, sendAddress, privateKey, recipient, value);
        console.log(result);
        res.send(JSON.stringify(result));
    }
    catch (error) {
        return res.status(500).send(error);
    }
})

/**
 * @swagger
 * /wallet/send-token:
 *   post:
 *     description: Send AFT to Address
 *     tags: [Transactions]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: network
 *         description: Network wanna create (Mainnet = 1, Testnet = 0 )
 *         in: query
 *         required: true
 *         type: string
 *       - name: sendAddress
 *         description: sendAddress.
 *         in: query
 *         required: true
 *         type: string
 *       - name: recipient
 *         description: recipient.
 *         in: query
 *         required: true
 *         type: string
 *       - name: privateKey
 *         description: private key.
 *         in: query
 *         required: true
 *         type: string
 *       - name: value
 *         description: value
 *         in: query
 *         required: true
 *         type: number
 *       - name: tokenAddress
 *         description: tokenAddress
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Transaction Info
 *         content: 
*             text/plain: 
*               schema: 
*                 $ref: "#/components/schemas/TransactionResponse"
*             application/json: 
*               schema: 
*                 $ref: "#/components/schemas/TransactionResponse"
*             text/json: 
*               schema: 
*                 $ref: "#/components/schemas/TransactionResponse"
 */

api_router.post('/send-token', async (req, res) => {
    try {
        const network = req.query.network;
        const sendAddress = req.query.sendAddress;
        const recipient = req.query.recipient;
        const privateKey = req.query.privateKey;
        const value = req.query.value;
        const tokenAddress = req.query.tokenAddress;
        let result = await walletClass.sendToken(network, sendAddress, privateKey, recipient, value, tokenAddress);
        console.log(result);
        res.send(JSON.stringify(result));

    }
    catch (error) {
        return res.status(500).send(error);
    }
})




module.exports = api_router;