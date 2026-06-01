FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy prisma schema and generate client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy the rest of the source code
COPY . .

# Expose port
EXPOSE 3000

# Start server - setup database before starting
CMD ["sh", "-c", "npx prisma db push && npm run start"]
