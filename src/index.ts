import Blockchain from "./class/Blockchain";
import express from 'express';
import Block from "./class/Block";

const blockchain = new Blockchain();

const app = express();

const PORT = 3000;

app.get("/blocks", (request, response) => {
    response.status(200).send(JSON.stringify(blockchain.chain));
});

app.post("/mine", (request, response) => {
    try {
        Block.mineBlock(blockchain.chain[blockchain.chain.length - 1], request.body || "");
        response.status(201).json({ message: "Block mined successfully" });
    } catch (e) {
        response.status(400)
        throw e;
    }
})

app.listen(PORT, () => {
    console.log("Server running at PORT: ", PORT);
}).on("error", (error) => {
    // gracefully handle error
    throw new Error(error.message);
});