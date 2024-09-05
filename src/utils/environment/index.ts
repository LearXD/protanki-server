import dotenv from 'dotenv';

export class Environment {
    public static init() {
        dotenv.config();
    }

    public static getEnv() {
        return process.env["NODE_ENV"]
    }

    public static getServerPort(): number {
        return process.env.SERVER_PORT ? parseInt(process.env.SERVER_PORT) : 1337;
    }

    public static getDiscordWebhookUrl(): string {
        return process.env.DISCORD_WEBHOOK_URL || '';
    }

}