import { Logger } from "./utils/logger";
import { Server } from "./server";
import { Discord } from "./services/discord";
import { Environment } from "./utils/environment";
import { ServerError } from "./server/utils/error";

Environment.init();
const server = new Server();

process.on('uncaughtException', (error: Error | ServerError) => {
    Logger.error('Ocorreu um erro inesperado:');
    Logger.error(error)

    if(Environment.getEnv() === 'production') {
        Discord.sendError(error);
    }
    // server.close();
    // process.exit(1);
});

server.start(Environment.getServerPort());