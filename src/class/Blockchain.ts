import Block from './Block';
import sha256 from 'crypto-js/sha256'

class Blockchain {
    public chain: Block[];

    constructor() {
        this.chain = [];
        this.chain.push(Block.genesis());
    }

    addBlock(block: Block): void {
        this.chain.push(block);
    }

    /*static blockHash(block: Block): string {
        const { lastHash, timestamp, data } = block;
        return sha256(sha256(lastHash + timestamp.toString())).toString();
    }*/

    static blockHash(block: Block, lastBlock: Block) {
        const calculatedHash = sha256(sha256(lastBlock.hash + lastBlock.timestamp.toString())).toString();
        return calculatedHash;
    }

    static isValidChain(chain: Block[]): boolean {
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
            return false;
        }

        for (let i = 1; i < chain.length; i++) {
            const block = chain[i];
            const lastBlock = chain[i - 1];

            if (block.lastHash !== lastBlock.hash) {
                return false;
            }

            if (block.hash !== this.blockHash(block, lastBlock)) {
                return false;
            }
        }

        return true;
    }

    replaceChain(chain: Block[]): void {
        if (Blockchain.isValidChain(chain) && chain.length > this.chain.length) {
            this.chain = chain;
        }
    }
}

export default Blockchain;