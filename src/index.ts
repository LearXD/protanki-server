import { Logger } from "./utils/logger";
import { Server } from "./server";

const server = new Server();

process.on('uncaughtException', (err) => {
    Logger.error('Uncaught Exception:', err);
    server.close();
});

server.start(1338);