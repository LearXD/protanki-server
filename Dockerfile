FROM node:lts-alpine AS node-build
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build

FROM node:lts-alpine AS node-prod
WORKDIR /app

COPY assets ./assets
COPY .env ./.env
COPY --from=node-build /app/node_modules ./node_modules
COPY --from=node-build /app/dist ./dist

EXPOSE 1337
CMD ["node", "dist/index.js"]

