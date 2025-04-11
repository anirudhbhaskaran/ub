FROM node:alpine

# Install dependencies
RUN apk add --no-cache curl

# Create working directory
WORKDIR /app

# Copy files
COPY package*.json ./
RUN npm install

COPY . .

# Download PocketBase binary (or you can COPY a local one)
RUN curl -L -o pocketbase https://github.com/pocketbase/pocketbase/releases/download/v0.21.2/pocketbase_0.21.2_linux_amd64.zip && \
    unzip pocketbase_0.21.2_linux_amd64.zip && \
    chmod +x pocketbase && \
    rm pocketbase_0.21.2_linux_amd64.zip

# Make start script executable
RUN chmod +x start.sh

EXPOSE 5000 8090

CMD ["./start.sh"]
