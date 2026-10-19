# --- Etapa 1: Build ---
FROM node:22-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Asegúrate de que el script de build de tu package.json genere la carpeta dist
# RUN npm run build --configuration=production
ARG BUILD_CONFIGURATION=production
RUN npx ng build --configuration=$BUILD_CONFIGURATION

# --- Etapa 2: Producción con Nginx ---
FROM nginx:alpine
# Reemplaza 'spotify-angular' por el nombre real de la carpeta que Angular genera en /dist
COPY --from=build /app/dist/spotify-angular/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]