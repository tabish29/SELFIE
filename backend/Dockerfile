# Usa un'immagine base ufficiale di Node.js che supporta ARM64
FROM node:16

# Imposta la directory di lavoro all'interno del container
WORKDIR /usr/src/app

# Installa Python e strumenti di build necessari per node-gyp
RUN apt-get update && apt-get install -y python3 make g++

# Copia il file package.json e package-lock.json nella directory di lavoro
COPY package*.json ./

# Installa le dipendenze del progetto
RUN npm install

# Copia il resto dei file del progetto nella directory di lavoro
COPY . .

# Costruisci eventuali moduli nativi (opzionale, spesso non necessario con npm install)
RUN npm rebuild bcrypt --build-from-source

# Esponi la porta su cui l'applicazione ascolta
EXPOSE 3000

# Comando per avviare l'applicazione
CMD ["node", "index.js"]
