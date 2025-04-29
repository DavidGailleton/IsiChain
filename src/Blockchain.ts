import Block from './Block';

class Blockchain {
    public chain: Block[];

    constructor() {
        this.chain = [];
        this.chain.push(Block.genesis());
    }

    addBlock(block: Block): void {
        this.chain.push(block);
    }
}

export default Blockchain;