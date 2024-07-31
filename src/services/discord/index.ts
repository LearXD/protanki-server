import { ServerError } from "@/server/utils/error";
import { Environment } from "@/utils/environment";

export class Discord {

    public static async sendError(error: Error | ServerError) {
        const url = Environment.getDiscordWebhookUrl();

        if (!url) { return }

        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "content": null,
                "embeds": [
                    {
                        "title": "💩 Novo Erro Registrado",
                        "description": `**Message**: ${error.message}\n**Stack**:\n\`\`\`${error.stack}shell\n\n\`\`\``,
                        "color": 16711680,
                        "fields": [
                            {
                                "name": "Causador:",
                                "value": error instanceof ServerError ? error.author : "Desconhecido",
                                "inline": true
                            }
                        ]
                    }
                ],
                "attachments": []
            })
        })
            .then((res) => res.text())
            .then((text) => console.log(text))
            .catch((err) => console.error(err))
    }
}