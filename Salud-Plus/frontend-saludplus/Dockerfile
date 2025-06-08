# Etapa 1: Build de Angular
FROM node:20 AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
RUN ls -l /app/dist/frontend-red-salud2/browser

# Etapa 2: Servir con Apache
FROM httpd:2.4-alpine
COPY --from=build /app/dist/frontend-red-salud2/browser/ /usr/local/apache2/htdocs/
EXPOSE 80
CMD ["httpd-foreground"]