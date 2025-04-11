FROM alpine:3.18

WORKDIR /app

# Install dependencies
RUN apk add --no-cache wget unzip nodejs npm

# Download PocketBase
RUN wget https://github.com/pocketbase/pocketbase/releases/download/v0.21.2/pocketbase_0.21.2_linux_amd64.zip -O pb.zip \
    && unzip pb.zip && chmod +x pocketbase

RUN npm install axios
# Copy your init script
COPY init.js ./init.js

# Expose port
EXPOSE 8090

# Start PocketBase + Init Script
CMD ["sh", "-c", "./pocketbase serve --http=0.0.0.0:8090 & sleep 3 && ./pocketbase admin create test@example.com 1234567890 && node ./init.js && tail -f /dev/null"]
