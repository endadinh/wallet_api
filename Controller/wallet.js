const Web3 = require('web3');
const axios = require('axios');
require('dotenv').config();

const tokenAddress = process.env.TOKEN_ADDRESS;
const API_KEY = process.env.API_KEY;
const RPCEndPoint = process.env.RPC;
const ABIJson = [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "Freeze", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "FrozenTransfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "MeltFrozen", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousMelter", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newMelter", "type": "address" }], "name": "MelterTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "MintFrozen", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "addToMelters", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_transferFeeAddress", "type": "address" }], "name": "addTransferFeeAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "availableBalance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "burn", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "burnFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "claimMelterAdmin", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" }], "name": "decreaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "destroyFrozen", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "feeaddr", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" }], "name": "increaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "maxSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "meltTokens", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "melteradmin", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_to", "type": "address" }, { "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "mint", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "mintFrozenTokens", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "pendingMelterAdmin", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "removeFromMelters", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_transferFeeAddress", "type": "address" }], "name": "removeTransferBurnAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_feeaddr", "type": "address" }], "name": "setFeeAddr", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_rate", "type": "uint256" }], "name": "setTransferFeeRate", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "transferFeeRate", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transferFrozenToken", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newMelter", "type": "address" }], "name": "transferMelterAdmin", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }];

class Wallet {
    web3;
    contract;
    bigNumber;
    decimals;
    divisor;
    constructor() {
        this.web3 = new Web3(new Web3.providers.HttpProvider(RPCEndPoint));
        this.contract = new this.web3.eth.Contract(ABIJson, tokenAddress);
        this.bigNumber = this.web3.utils.BN;
        this.decimals = new this.bigNumber.BN(6);
        this.divisor = new this.bigNumber(10).pow(this.decimals);
    }

    async createNew() {
        try {
            let newAccount = await this.web3.eth.accounts.create();
            return { code: 200, account: newAccount };
        }
        catch (err) {
            return { Fail: err }
        }


    }
    async checkValid(address) {
        try {
            let valid = await this.web3.utils.isAddress(address);
            return { code: 200, isValid: valid };
        }
        catch (err) {
            return { Fail: err }

        }
    }
    async getBalance(address) {
        try {
            let BNBBalanceBN = await this.web3.eth.getBalance(address);
            let BalanceBNB = await this.web3.utils.fromWei(BNBBalanceBN, "ether");
            console.log(await this.contract.methods.balanceOf(address).call());
            let BalanceGet = await this.contract.methods.balanceOf(address).call();
            console.log('balanceGet', BalanceGet)
            let balanceBN = new this.bigNumber(BalanceGet);
            console.log('balanceBN', balanceBN)
            let balanceAFT = balanceBN.div(this.divisor).toString();
            return { code: 200, BalanceBNB: Number(BalanceBNB).toFixed(6), BalanceAFT: Number(balanceAFT).toFixed(6) };
        }
        catch (err) {
            return { Fail: err }
        }
    }
    async getTransaction(address) {
        try {

            let latestBlock = await this.web3.eth.getBlockNumber();
            let startBlock = 0;
            let offset = 10;
            let data = await axios.get(`https://api.bscscan.com/api?module=account&action=txlist&address=${address}&startblock=${startBlock}&endblock=${latestBlock}&page=1&offset=${offset}&sort=desc&apikey=${API_KEY}`)
            return { code: 200, txs: data.data.result };
        }
        catch (err) {
            return { Fail: err }
        }

    }
    async sendBNB(sendAddress, privateKey, recipient, value) {
        try {
            let gas = await this.web3.eth.getGasPrice();
            let txSigned = await this.web3.eth.accounts.signTransaction({
                gasPrice: gas,
                gas: 2000000,
                to: recipient, // Required except during contract publications.
                from: sendAddress, // must match user's active address. 
                value: this.web3.utils.toWei(value, "ether"),
                chainId: this.web3.eth.getChainId(), // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
            }, privateKey)
            if (txSigned.rawTransaction) {
                let txsInfo = await this.web3.eth.sendSignedTransaction(txSigned.rawTransaction);
                return { txsInfo };
            }
            else {
                return { Fail: "Can't sign transaction !" }
            }
        }
        catch (err) {
            return { fail_with_error: err }
        }
    }

    async sendAFT(sendAddress, privateKey, recipient, value) {
        try {
            let number = new this.bigNumber(Number(value) * 10 ** 6);
            let data = await this.contract.methods['transfer'](recipient, this.web3.utils.toHex(number)).encodeABI();
            let gas = await this.web3.eth.getGasPrice();
            let txSigned = await this.web3.eth.accounts.signTransaction({
                gasPrice: gas,
                gas: 2000000,
                to: tokenAddress, // Required except during contract publications.
                from: sendAddress, // must match user's active address. 
                data: data,
                chainId: this.web3.eth.getChainId(), // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
            }, privateKey)
            if (txSigned.rawTransaction) {
                let txsInfo = await this.web3.eth.sendSignedTransaction(txSigned.rawTransaction);
                return { txsInfo };
            }
            else {
                return { Fail: "Can't sign transaction !" }
            }

        }
        catch (err) {
            return { fail_with_error: err }
        }
    }

}

module.exports = Wallet;