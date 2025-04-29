import sha256 from 'crypto-js/sha256';

class Block {
    public timestamp: number;
    public lastHash: string;
    public hash: string;
    public data: string;

    constructor(timestamp: number, lastHash: string, hash: string, data: string) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
    }

    toString() {
        return this.timestamp.toString() + this.lastHash + this.hash + this.data;
    }

    static genesis(): Block {
        return new Block(1231006505000, "0000000000000000000000000000000000000000000000000000000000000000", "000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f", "The Times 03/Jan/2009 Chancellor on brink of second bailout for banks")
    }

    static mineBlock(lastBlock: Block, data: string): Block {
        const newHash: string = sha256(sha256(lastBlock.hash + lastBlock.timestamp.toString())).toString();
        const newBlock: Block = new Block(Date.now(), lastBlock.hash, newHash, data);
        return newBlock;
    }
}

export default Block;