import { Server } from "./server";
import { Logger } from "./utils/logger";

const server = new Server();

process.on('uncaughtException', (err) => {
    Logger.error('Uncaught Exception:', err);
    server.close();
});

server.start(1338);