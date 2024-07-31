export class ServerError extends Error {
    constructor(
        public readonly message: string,
        public readonly author: string = 'Server',
    ) {
        super()
    }
}