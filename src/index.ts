import { Server } from "./server";
import { Logger } from "./utils/logger";

const server = new Server();

process.on('uncaughtException', (err) => {
    Logger.error('Uncaught Exception:', err);
    // TODO: save server data and stop server
});

server.start(1338);