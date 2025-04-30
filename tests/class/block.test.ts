import Block from '../../src/class/Block';

describe("Block", () => {
    let data: string;
    let lastBlock: Block;
    let block: Block;

    beforeEach(() => {
        data = 'bar';
        lastBlock = Block.genesis();
        block = Block.mineBlock(lastBlock, data);
    });

    it("sets data to block", () => {
        expect(block.data).toEqual(data);
    });

    it("sets the lastHash to the value of the last block hash", () => {
        expect(block.lastHash).toEqual(lastBlock.hash);
    });
});