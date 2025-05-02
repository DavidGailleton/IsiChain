import Blockchain from "./class/Blockchain";
import express from 'express';
import bodyParser from 'body-parser';
import Block from "./class/Block";
import P2PServer from "./class/P2PServer";

const blockchain = new Blockchain();
const p2pServer = new P2PServer(blockchain);
const DIFFICULTY = 4

const app = express();
const HTTP_PORT = process.env.HTTP_PORT || 3000;

// Use middleware to parse JSON body
app.use(bodyParser.json());

app.get("/blocks", (request, response) => {
    response.status(200).send(JSON.stringify(blockchain.chain));
});

app.post("/mine", (request, response) => {
    try {
        const newBlock = Block.newMineBlock(
            blockchain.chain[blockchain.chain.length - 1],
            request.body || ""
        );

        blockchain.addBlock(newBlock);

        // Sync the blockchain with other peers after mining a new block
        p2pServer.syncChain();

        response.status(201).json({
            message: "Block mined successfully",
            block: newBlock
        });
    } catch (e) {
        console.log(e)
        response.status(400).json({ error: e });
    }
});

app.listen(HTTP_PORT, () => {
    console.log(`HTTP Server running at PORT: ${HTTP_PORT}`);
}).on("error", (error) => {
    // gracefully handle error
    throw new Error(error.message);
});

// Start the P2P server
p2pServer.listen();