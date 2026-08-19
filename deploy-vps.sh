#!/usr/bin/env bash
set -e

echo "🚀 Starting STR Platform Automated Deployment..."

# 1. Pull latest code from main branch
echo "📥 Pulling latest git repository updates..."
git pull origin main

# 2. Build Docker containers
echo "🐳 Building Docker images..."
docker-compose build --no-cache

# 3. Restart Docker services
echo "🔄 Restarting services..."
docker-compose down
docker-compose up -d

# 4. Reload NGINX
echo "🌐 Reloading Nginx reverse proxy..."
sudo systemctl reload nginx

echo "✅ STR Platform successfully deployed and running!"
