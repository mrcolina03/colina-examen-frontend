# Etapa 1: Construcción (Build)
FROM node:22-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: Servidor de Producción (Nginx)
FROM nginx:alpine as production-stage
# Copiamos los archivos compilados de React al directorio de Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html
# Copiamos nuestra configuración personalizada de Nginx (Proxy Inverso)
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]