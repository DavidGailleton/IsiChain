import Blockchain from './Blockchain';
import Block from './Block';

describe("Blockchain", () => {
    let blockchain: Blockchain;
    let blockchain2: Blockchain;

    beforeEach(() => {
        blockchain = new Blockchain();
        blockchain2 = new Blockchain();
    });

    it("starts with genesis block", () => {
        expect(blockchain.chain[0]).toEqual(Block.genesis());
    });

    it("adds a new block", () => {
        const data: string = 'foo';
        const lastBlock = blockchain.chain[blockchain.chain.length - 1];
        const newBlock = Block.mineBlock(lastBlock, data);

        blockchain.addBlock(newBlock);

        expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(data);
    });

    it("validates a valid chain", () => {
        const data = 'foo';
        const lastBlock = blockchain2.chain[blockchain2.chain.length - 1];
        const newBlock = Block.mineBlock(lastBlock, data);

        blockchain2.addBlock(newBlock);

        expect(Blockchain.isValidChain(blockchain2.chain)).toBe(true);
    });

    it("invalidates a corrupted genesis block", () => {
        blockchain2.chain[0].data = 'corrupted';
        expect(Blockchain.isValidChain(blockchain2.chain)).toBe(false);
    });

    it("invalidates a corrupt chain", () => {
        const data = 'foo';
        const lastBlock = blockchain2.chain[blockchain2.chain.length - 1];
        const newBlock = Block.mineBlock(lastBlock, data);
        const corruptedBlock = new Block(1231006505000, "0000000000000000000000000000000000000000000000000000000000000000", "000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f", "The Times 03/Jan/2009 Chancellor on brink of second bailout for banks")

        blockchain2.addBlock(newBlock);
        blockchain2.chain[1] = corruptedBlock

        expect(Blockchain.isValidChain(blockchain2.chain)).toBe(false);
    });

    it("replaces the chain with a valid chain", () => {
        const data = 'goo';
        const lastBlock = blockchain2.chain[blockchain2.chain.length - 1];
        const newBlock = Block.mineBlock(lastBlock, data);

        blockchain2.addBlock(newBlock);
        blockchain.replaceChain(blockchain2.chain);

        expect(blockchain.chain).toEqual(blockchain2.chain);
    });

    it("does not replace the chain with less than or equal chain", () => {
        const data = 'foo';
        const lastBlock = blockchain.chain[blockchain.chain.length - 1];
        const newBlock = Block.mineBlock(lastBlock, data);

        blockchain.addBlock(newBlock);
        blockchain.replaceChain(blockchain2.chain);

        expect(blockchain.chain).not.toEqual(blockchain2.chain);
    });
});