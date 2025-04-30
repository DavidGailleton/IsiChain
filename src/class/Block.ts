import sha256 from 'crypto-js/sha256';
import crypto from 'crypto-js';

class Block {
    public timestamp: number;
    public lastHash: string;
    public hash: string;
    public data: string;
    public bits: string; // difficulty for mining
    public nonce: number;

    constructor(timestamp: number, lastHash: string, hash: string, data: string, bits: number, nonce: number) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.bits = bits;
        this.nonce = nonce;
    }

    toString() {
        return this.timestamp.toString() + this.lastHash + this.hash + this.data;
    }

    static genesis(): Block {
        return new Block(1231006505000, "0000000000000000000000000000000000000000000000000000000000000000", "000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f", "The Times 03/Jan/2009 Chancellor on brink of second bailout for banks", 486604799, 2083236893)
    }

    static mineBlock(lastBlock: Block, data: string, bits: number, nonce: number = 0): Block {
        const newHash: string = sha256(sha256(lastBlock.hash + lastBlock.timestamp.toString())).toString();
        const newBlock: Block = new Block(Date.now(), lastBlock.hash, newHash, data, bits, nonce);
        return newBlock;
    }

    static newMineBlock(lastBlock: Block, data: string) {
        const hash256 = (data: any) => {
            const hash1 = sha256(data)
            const hash2 = sha256(hash1)
            return hash2;
        }

        const bitsToTarget = (bits: number) => {
            const exponent = bits >>> 24;
            const coefficient = bits & 0x00FFFFFF;

            if (exponent <= 3) {
                // Edge case: when exponent is 3 or less, we need to shift right
                return BigInt(coefficient) >> BigInt(8 * (3 - exponent));
            } else {
                // Normal case: shift left
                return BigInt(coefficient) << BigInt(8 * (exponent - 3));
            }
        }

        const formatTargetAsHex = (target: bigint): string => {
            // Convert to hex and remove '0x' prefix
            let hexString = target.toString(16);

            // Pad to 64 characters (32 bytes, 256 bits)
            return hexString.padStart(64, '0');
        }

        const lastBlockHash = lastBlock.hash;
        const timestamp = Date.now();
        const bits = lastBlock.bits;
        const nonce = 0;

        const header = (lastBlockHash + timestamp + bits).toString();

        while (0 !== 0) {

        }
    }
}

export default Block;