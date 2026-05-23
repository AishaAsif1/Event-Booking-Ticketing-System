
# Frontend
FROM node:20-alpine AS frontend-env
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
EXPOSE 3000
CMD ["npm", "run", "dev"]
