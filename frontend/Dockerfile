# Usa l'immagine base di Node.js con Alpine
FROM node:alpine

# Imposta la directory di lavoro
WORKDIR /usr/src/app

# Copia i file del progetto nella directory di lavoro
COPY . .

# Installa le dipendenze del progetto
RUN npm install

# Aggiungi node_modules/.bin al PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# Esegui l'app Angular
CMD ["ng", "serve", "--host", "0.0.0.0"]
