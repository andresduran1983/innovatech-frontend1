# Etapa 1: Construcción
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Etapa 2: Producción (Imagen liviana y segura)
FROM node:18-alpine
WORKDIR /app
# Copiamos solo lo necesario de la etapa anterior
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/server.js ./

# Definimos un usuario sin privilegios de root por seguridad
USER node

EXPOSE 3001
CMD ["node", "server.js"]