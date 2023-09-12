#!/bin/bash

# Install ngrok
echo "Installing ngrok..."
if ! [ -x "$(command -v ngrok)" ]; then
  wget https://bin.equinox.io/c/4VmDzA7iaHb/ngrok-stable-linux-amd64.zip
  unzip ngrok-stable-linux-amd64.zip
  chmod +x ngrok
  sudo mv ngrok /usr/local/bin/
fi

# Start ngrok
echo "Starting ngrok..."
ngrok http:localhost:3000 &

# Wait for ngrok to start and retrieve the URL
sleep 5  # You may need to adjust the sleep duration depending on your setup
ngrok_url=$(curl -s http://localhost:4040/api/tunnels | jq -r '.tunnels[0].public_url')

# Pass ngrok URL to Docker Compose service
echo "Setting NGROK_URL environment variable in Docker Compose..."
export NGROK_URL="$ngrok_url"
docker-compose up -d

echo "Your Docker Compose service is running with NGROK_URL: $NGROK_URL"
