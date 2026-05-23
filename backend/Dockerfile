# Backend production Dockerfile
FROM node:20-alpine AS backend-env

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm ci

COPY backend/prisma ./prisma/
RUN npx prisma generate

COPY backend/ ./

RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]