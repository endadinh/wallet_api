const Web3 = require('web3');
const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.API_KEY;
const RPCEndPointTestnet = process.env.RPCTEST;
const RPCEndPointMainnet = process.env.RPCMAIN;
const ABIJson = [
    {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_spender",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_from",
                "type": "address"
            },
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "name": "",
                "type": "uint8"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "name": "balance",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            },
            {
                "name": "_spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "payable": true,
        "stateMutability": "payable",
        "type": "fallback"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    }
];





class Wallet {
    network;
    web3;
    contract;
    bigNumber;
    decimals;
    divisor;
    // constructor() {

    //     // this.contract = new this.web3.eth.Contract(ABIJson, tokenAddress);
    //     // this.bigNumber = this.web3.utils.BN;
    //     // this.decimals = new this.bigNumber.BN(decimals);
    //     // this.divisor = new this.bigNumber(10).pow(this.decimals);
    // }

    async createNew(network) {
        try {
            const rpc = await this.checkNetwork(Number(network));
            if (rpc != "") {
                this.web3 = await new Web3(new Web3.providers.HttpProvider(rpc));
                let newAccount = await this.web3.eth.accounts.create();
                return { code: 200, account: newAccount };
            }
            else {
                return { code: 500, Error: 'Require Network' };
            }
        }
        catch (err) {
            return { code: 500, Error: err }
        }


    }
    async checkValid(network, address) {


        try {
            const rpc = await this.checkNetwork(Number(network));
            if (rpc != "") {
                this.web3 = await new Web3(new Web3.providers.HttpProvider(rpc));
                let valid = await this.web3.utils.isAddress(address);
                return { code: 200, isValid: valid };
            }
            else {
                return { code: 500, Error: 'Require Network' };
            }
        }
        catch (err) {
            return { code: 500, Error: err }
        }
    }
    async getBalance(network, address, tokenAddress) {
        try {
            const rpc = await this.checkNetwork(Number(network));
            if (rpc != "") {
                this.web3 = await new Web3(new Web3.providers.HttpProvider(rpc));
                this.bigNumber = await this.web3.utils.BN;
                this.contract = await new this.web3.eth.Contract(ABIJson, tokenAddress);
                let tokenDecimals = await this.contract.methods['decimals']().call();
                this.decimals = new this.bigNumber.BN(tokenDecimals);
                this.divisor = new this.bigNumber(10).pow(this.decimals);
                console.log('divisols', this.divisor);
                console.log('aaaaaaaaa', this.decimals, this.divisor);
                let BNBBalanceBN = await this.web3.eth.getBalance(address);
                let BalanceBNB = await this.web3.utils.fromWei(BNBBalanceBN, "ether");
                let BalanceGet = await this.contract.methods.balanceOf(address).call();
                let balanceBN = new this.bigNumber(BalanceGet);
                let balanceToken = balanceBN.div(this.divisor).toString();
                return { code: 200, BalanceBNB: Number(BalanceBNB).toFixed(6), BalanceToken: Number(balanceToken).toFixed(6) };
            }
            else {
                return { code: 500, Error: 'Require Network' };
            }

        }
        catch (err) {
            return { code: 500, error: "Can't get balance, maybe you requested wrong network" };
        }
    }
    async getTransaction(network, address, tokenAddress) {
        try {
            if (Number(network) === 1) {
                const rpc = await this.checkNetwork(Number(network));
                if (rpc != "") {
                    this.web3 = await new Web3(new Web3.providers.HttpProvider(rpc));
                    let latestBlock = await this.web3.eth.getBlockNumber();
                    let startBlock = 0;
                    let offset = 10;
                    let data = await axios.get(`https://api.bscscan.com/api?module=account&action=txlist&address=${address}&startblock=${startBlock}&endblock=${latestBlock}&page=1&offset=${offset}&sort=desc&apikey=${API_KEY}`)
                    let data1 = await axios.get(`https://api.bscscan.com/api?module=account&action=tokentx&contractaddress=${tokenAddress}&address=${address}&page=1&offset=${offset}&startblock=${startBlock}&endblock=${latestBlock}&sort=desc&apikey=${API_KEY}`);
                    return { code: 200, txsBEP20: data1.data.result, txsList: data.data.result };
                }
                else {
                    return { code: 500, Error: 'Require Network' };
                }
            }
            else if (Number(network) === 0) {
                const rpc = await this.checkNetwork(Number(network));
                if (rpc != "") {
                    this.web3 = await new Web3(new Web3.providers.HttpProvider(rpc));
                    let latestBlock = await this.web3.eth.getBlockNumber();
                    let startBlock = 0;
                    let offset = 10;
                    let data = await axios.get(`https://api-testnet.bscscan.com/api?module=account&action=txlist&address=${address}&startblock=${startBlock}&endblock=${latestBlock}&page=1&offset=${offset}&sort=desc&apikey=${API_KEY}`)
                    let data1 = await axios.get(`https://api-testnet.bscscan.com/api?module=account&action=tokentx&contractaddress=${tokenAddress}&address=${address}&page=1&offset=${offset}&startblock=${startBlock}&endblock=${latestBlock}&sort=desc&apikey=${API_KEY}`);
                    return { code: 200, txsBEP20: data1.data.result, txsList: data.data.result };
                }
                else {
                    return { code: 500, Error: 'Require Network' };
                }
            }
            else {
                return { code: 500, Error: 'Only Mainnet for this request' };
            }
        }
        catch (err) {
            return { code: 500, Error: "Can't get Transactions" }
        }
    }


    async sendBNB(network, sendAddress, privateKey, recipient, value) {
        try {
            const rpc = await this.checkNetwork(Number(network));
            if (rpc != "") {
                this.web3 = await new Web3(new Web3.providers.HttpProvider(rpc));
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
                    let txs = await this.web3.eth.sendSignedTransaction(txSigned.rawTransaction);
                    return {code:200, txsInfo: txs };
                }
                else {
                    return { Fail: "Can't sign transaction !" }
                }
            }
            else {
                return { code: 500, Error: 'Require Network' };
            }
        }
        catch (err) {
            return { code: 500, Error: err }
        }
    }


    async sendToken(network, sendAddress, privateKey, recipient, value, tokenAddress) {
        try {
            const rpc = await this.checkNetwork(Number(network));
            if (rpc != "") {
                this.web3 = await new Web3(new Web3.providers.HttpProvider(rpc));
                this.bigNumber = await this.web3.utils.BN;
                this.contract = await new this.web3.eth.Contract(ABIJson, tokenAddress);
                let tokenDecimals = await this.contract.methods['decimals']().call();
                let calNumber = value * 10 ** tokenDecimals;
                let number = new this.bigNumber(calNumber.toLocaleString('fullwide', { useGrouping: false }));
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
                console.log('txSigned', txSigned);
                if (txSigned.rawTransaction) {
                    let txs = await this.web3.eth.sendSignedTransaction(txSigned.rawTransaction);
                    return {code:200, txsInfo: txs };
                }
                else {
                    return { Fail: "Can't sign transaction !" }
                }
            }
            else {
                return { code: 500, Error: 'Require Network' };
            }
        }
        catch (err) {
            return { code: 500, Error: err }
        }
    }

    async checkNetwork(network) {
        if (network === 0) {
            return RPCEndPointTestnet;
        } else if (network === 1) {
            return RPCEndPointMainnet;
        } else {
            return "";
        }
    }

}

module.exports = Wallet;