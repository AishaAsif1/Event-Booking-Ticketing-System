# Backend
FROM node:20-alpine AS backend-env
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/prisma ./prisma/
RUN npx prisma generate
COPY backend/ ./
EXPOSE 5000
CMD ["npm", "run", "dev"] 

