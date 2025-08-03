# Étape 1 : Build Angular app
FROM node:20-alpine AS builder

# Crée un dossier de travail dans le conteneur
WORKDIR /app

# Copie les fichiers nécessaires pour installer les dépendances
COPY package.json package-lock.json* ./

# Installation des dépendances
RUN npm install

# Copie le reste du code
COPY . .

# Build Angular pour la production
RUN npm run build -- --configuration production

# Étape 2 : Serveur NGINX pour héberger les fichiers compilés
FROM nginx:alpine

# Supprime la config par défaut de NGINX
RUN rm -rf /usr/share/nginx/html/*

# Copie les fichiers Angular compilés dans NGINX
COPY --from=builder /app/dist/Front-Umbrella/browser /usr/share/nginx/html

# Copie une config personnalisée (optionnel mais recommandé pour Angular routes)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose le port 80
EXPOSE 80

# Lancement de NGINX
CMD ["nginx", "-g", "daemon off;"]
