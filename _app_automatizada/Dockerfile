FROM node:24-slim AS base
WORKDIR /srv/cf.database_automatic

#Navegagor para Puppeter PDF
RUN apt-get update && apt-get install -y --no-install-recommends \
  firefox-esr \
  fontconfig \
  fonts-freefont-ttf \
  fonts-noto-core \
  fonts-noto-color-emoji \
  fonts-liberation \
  fonts-dejavu-core \
  locales \
  && fc-cache -fv \
  && sed -i '/es_ES.UTF-8/s/^# //g' /etc/locale.gen \
  && locale-gen \
  && rm -rf /var/lib/apt/lists/*

ENV LANG=es_ES.UTF-8 \
    LANGUAGE=es_ES:es \
    LC_ALL=es_ES.UTF-8
    
COPY package*.json ./

# ---- Desarrollo ----
FROM base AS dev
ENV NODE_ENV=development
RUN npm ci
CMD ["npm", "run", "dev"]

# ---- Producción ----
FROM base AS prod
ENV NODE_ENV=production
RUN npm ci --omit=dev && npm cache clean --force
COPY . .
CMD ["node", "app.js"]