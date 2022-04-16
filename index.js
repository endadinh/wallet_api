const express = require('express');
const path = require('path');
const http = require('http');
const Web3 = require('web3');
const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545/');


const holderAddress = "0xaf8a7611aEEd90Aa6ab4D8257b7DE42575698F29"
const USDTAddress = "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd";
const ABIJson = [
    {"constant":true,"inputs":[{"name":"who","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},
];
// const reload = require('reload');



const app = express();
const port = 3030;

app.get('/',async (req,res) => { 
    const contract = new web3.eth.Contract(ABIJson, USDTAddress);
    const newAccount = await web3.eth.accounts.create();
    const balance  = await web3.eth.getBalance(holderAddress);
    const newBalance = await web3.utils.fromWei(balance,"ether");
    const USDTBalance = await contract.methods.balanceOf(holderAddress).call();
    const USDTBalanceReal = await web3.utils.fromWei(USDTBalance,"ether");
    console.log(USDTBalanceReal);
    async function getData() { 
        const result = {
            address : newAccount.address,
            privateKey: newAccount.privateKey,
            valid: web3.utils.isAddress(newAccount.address),
            BNBBalance: newBalance,
            USDTBalance: USDTBalanceReal

        }
        return result;
    }

    // response
    const response = await getData().then((result) => {
        if (typeof result != 'string') {
            result = JSON.stringify(result, undefined, 2);
        }
        result = result.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return JSON.stringify(JSON.parse(result),null,2);

    });
    res.send(response)

}) 

// var server = http.createServer(app)

// reload(server, app, 100)

app.listen(port, () => { 
    console.log(`Listen on ${port}!`);
});