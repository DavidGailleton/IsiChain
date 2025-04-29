import Blockchain from './Blockchain';
import Block from './Block';

describe("Blockchain", () => {
    let blockchain: Blockchain;

    beforeEach(() => {
        blockchain = new Blockchain();
    });

    it("starts with genesis block", () => {
        expect(blockchain.chain[0]).toEqual(Block.genesis());
    });

    it("adds a new block", () => {
        const data: string = 'foo';
        const lastBlock = blockchain.chain[blockchain.chain.length - 1];
        const newBlock = Block.mineBlock(lastBlock, data);

        blockchain.addBlock(newBlock);

        expect(blockchain.chain[blockchain.chain.length - 1]).toEqual(newBlock);
        expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(data);
    });
});