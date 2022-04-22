const Web3 = require('web3');

const holderAddress = "0xaf8a7611aEEd90Aa6ab4D8257b7DE42575698F29"

class TransactionChecker {
    web3;
    account;

    constructor(account) {
        this.web3 = new Web3(new Web3.providers.HttpProvider('https://data-seed-prebsc-1-s1.binance.org:8545/'));
        this.account = account.toLowerCase();
    }

    async checkBlock() {
        console.log(this.account);
        let block = await this.web3.eth.getBlock('latest');
        let number = block.number;
        console.log('Searching block' + number);
        if (block != null & block.transactions != null) {
            for (let txHash of block.transactions) {
                let tx = await this.web3.eth.getTransaction(txHash);
                // console.log('tx',tx);
                if (tx.to != null) {
                    if (this.account === tx.to.toLowerCase() || this.account === tx.from.toLowerCase() ) {
                        console.log('tx',tx);
                        console.log('Transaction found on block :' + number);
                        console.log({ address: tx.from, value: this.web3.utils.fromWei(tx.value, 'ether'), timestamp: new Date(), hash: tx.hash });
                    }
                }
            }
        }
    }
}

let txChecker = new TransactionChecker(holderAddress);
setInterval(() => {
    txChecker.checkBlock()
}, 5*6000);
