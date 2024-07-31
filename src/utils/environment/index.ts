import dotenv from 'dotenv';

export class Environment {
    public static init() {
        dotenv.config();
    }

    public static getDiscordWebhookUrl(): string {
        return process.env.DISCORD_WEBHOOK_URL || '';
    }
}