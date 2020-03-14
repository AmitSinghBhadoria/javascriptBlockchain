const sha256 = require('crypto-js/sha256');

class Block {
    constructor(index, timestamp, data, previousHash = ''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nounce = 0;
    }

    calculateHash() {
        return sha256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data )+ this.nounce).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nounce++;
            this.hash = this.calculateHash();
        }
    }
}

class BlockChain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
    }

    createGenesisBlock() {
        return new Block(0, '01/01/2019', "Genesis Block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length -1];
    }

    addNewBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty );
        this.chain.push(newBlock);
    }

    isChainValid() {
        for(let i = 0; i< this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1]
            if(currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }
            if(currentBlock.previousHash  !== previousBlock.hash) {
                return false;
            }
            return true;
        }
    }
}

let javascriptBlockchain = new BlockChain();
console.log("mining Block 1")
javascriptBlockchain.addNewBlock(new Block(1, '10/10/2019', 'hi This is Amit'));
console.log("mining Block 2")
javascriptBlockchain.addNewBlock(new Block(2, '10/10/2020', 'hi this is divya'));

console.log(JSON.stringify(javascriptBlockchain, null, 4));