// P2PServer.ts
import WebSocket from 'ws';
import Blockchain from './Blockchain';
import Block from './Block';

// Define message types for better code organization
enum MESSAGE_TYPES {
    CHAIN = 'CHAIN'
}

interface P2PMessage {
    type: MESSAGE_TYPES;
    data: any;
}

class P2PServer {
    private blockchain: Blockchain;
    private sockets: WebSocket[];
    private p2pPort: number;
    private peers: string[];

    constructor(blockchain: Blockchain) {
        this.blockchain = blockchain;
        this.sockets = [];
        this.p2pPort = parseInt(process.env.P2P_PORT || '5001');
        this.peers = process.env.PEERS ? process.env.PEERS.split(',') : [];
    }

    // Start the server and connect to peers
    listen(): void {
        const server = new WebSocket.Server({ port: this.p2pPort });

        server.on('connection', (socket: WebSocket) => {
            console.log('New connection established');
            this.connectSocket(socket);
        });

        this.connectToPeers();

        console.log(`P2P server listening on port: ${this.p2pPort}`);
    }

    // Connect to peer nodes specified in the PEERS env variable
    connectToPeers(): void {
        this.peers.forEach(peer => {
            // Create a socket for each peer
            const socket = new WebSocket(peer);

            socket.on('open', () => {
                console.log(`Connected to peer: ${peer}`);
                this.connectSocket(socket);
            });

            socket.on('error', () => {
                console.log(`Connection failed to peer: ${peer}`);
            });
        });
    }

    // Add the socket to the array and handle messages
    connectSocket(socket: WebSocket): void {
        this.sockets.push(socket);
        console.log(`Socket connected, total sockets: ${this.sockets.length}`);

        // Set up message handler for this socket
        this.messageHandler(socket);

        // Send the current blockchain to the newly connected peer
        this.sendChain(socket);
    }

    // Handle incoming messages
    messageHandler(socket: WebSocket): void {
        socket.on('message', (message: string) => {
            const data = JSON.parse(message) as P2PMessage;

            console.log(`Received message: ${data.type}`);

            switch (data.type) {
                case MESSAGE_TYPES.CHAIN:
                    // Replace the chain if the received chain is valid and longer
                    this.blockchain.replaceChain(data.data);
                    break;
            }
        });
    }

    // Send this node's blockchain to a specific peer
    sendChain(socket: WebSocket): void {
        socket.send(JSON.stringify({
            type: MESSAGE_TYPES.CHAIN,
            data: this.blockchain.chain
        }));
    }

    // Broadcast the current blockchain to all connected peers
    syncChain(): void {
        this.sockets.forEach(socket => {
            this.sendChain(socket);
        });
        console.log('Blockchain synced with all peers');
    }
}

export default P2PServer;