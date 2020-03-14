const sha256 = require("crypto-js/sha256");

class Block {
  constructor(timestamp, transactions, previousHash = "") {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nounce = 0;
  }

  calculateHash() {
    return sha256(
      this.index +
        this.previousHash +
        this.timestamp +
        JSON.stringify(this.data) +
        this.nounce
    ).toString();
  }

  mineBlock(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nounce++;
      this.hash = this.calculateHash();
    }
  }
}

class Transactions {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}

class BlockChain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }

  createGenesisBlock() {
    return new Block("01/01/2019", "Genesis Block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  minePendingTransactions(miningRewardAddress) {
    //in public blockchains there are many  pending transactions  so the miners get to choose which transactions they want to include.
    // the block size cannot exceed 1 megabyte
    let block = new Block(Date.now(), this.pendingTransactions);
    block.mineBlock(this.difficulty);
    console.log("Block Successfully mined!");
    this.chain.push(block);

    this.pendingTransactions = [
      new Transactions(null, miningRewardAddress, this.miningReward)
    ];
  }

  createTransaction(transaction) {
      this.pendingTransactions.push(transaction);
  }

  getBalanceOfAddress(address) {
      let balance = 0;
      this.chain.forEach(block => {
          for (const trans of block.transactions) {
            if(trans.fromAddress === address){
                balance -= trans.amount;
              }
              if(trans.toAddress === address) {
                  balance += trans.amount;
              }
          }
      });
      return balance;
  }

  addNewBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }

  isChainValid() {
    for (let i = 0; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
      return true;
    }
  }
}

let javascriptBlockchain = new BlockChain();
//address  1 and address 2 will be public key of someones account
javascriptBlockchain.createTransaction(new Transactions('address1', 'address2', 100))
javascriptBlockchain.createTransaction(new Transactions('address2', 'address1', 50))

console.log('\n Starting the miner ...');
javascriptBlockchain.minePendingTransactions('amit-address');


console.log('\n Balance of Amit is .. ' ,javascriptBlockchain.getBalanceOfAddress('amit-address'));
console.log('\n Starting the miner ...');
javascriptBlockchain.minePendingTransactions('amit-address');
console.log('\n Balance of Amit is .. ' ,javascriptBlockchain.getBalanceOfAddress('amit-address'));
