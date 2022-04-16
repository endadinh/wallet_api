const Web3 = require('web3');
const holderAddress = "0xaf8a7611aEEd90Aa6ab4D8257b7DE42575698F29"

class TransactionChecker {
    web3;
    web3ws;
    account;
    subscription;

    constructor(account) {
        this.web3ws = new Web3(new Web3.providers.WebsocketProvider('wss://speedy-nodes-nyc.moralis.io/c13b3185d4d18c55ad1e6b16/bsc/testnet'));
        this.web3 = new Web3(new Web3.providers.HttpProvider('https://data-seed-prebsc-1-s1.binance.org:8545/'));
        this.account = account.toLowerCase();
    }

    subscribe(topic) {
        this.subscription = this.web3ws.eth.subscribe(topic, (err, res) => {
            if (err) console.error(err);
        })
    }

    watchTransactions() {
        console.log('Watching all pending transactions...');
        this.subscription.on('data', (txHash) => {
            console.log('data');
            setTimeout(async () => {
                try {
                    let tx = await this.web3.eth.getTransaction(txHash);
                    if (tx != null && tx.to != null && tx.from != null) {
                        if (this.account === tx.to.toLowerCase() || this.account === tx.from.toLowerCase()) {
                            console.log({ address: tx.from, value: this.web3.utils.fromWei(tx.value, 'ether'), timestamp: new Date() });
                        }
                    }
                } catch (err) {
                    console.error(err);
                }
            }, 1000)
        });

    }


}

let txChecker = new TransactionChecker(holderAddress);

setInterval(() => {
    txChecker.subscribe('logs');
    txChecker.watchTransactions();
}, 1000);