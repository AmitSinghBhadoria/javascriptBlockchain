const sha256 = require('crypto-js/sha256');

class Block {
    constructor(index, timestamp, data, previousHash = ''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return sha256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data )).toString();
    }
}

class BlockChain {
    constructor() {
        this.chain = [];
    }

    createGenesisBlock() {
        return new Block(0, '01/01/2019', "Genesis Block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length -1];
    }

    addNewBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }
}