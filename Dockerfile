FROM node:22-alpine
WORKDIR /app

COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

COPY . .
RUN npm run build

COPY prisma ./prisma
RUN npx prisma generate

EXPOSE 4000
CMD ["node", "dist/src/main.js"]
