#!/bin/bash

echo "🚀 Starting Naagrik Application with Docker..."

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

echo "🐳 Docker is running"

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose down -v

# Build and start all services
echo "🏗️ Building and starting services..."
docker-compose up --build -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
sleep 30

# Check if MongoDB is ready
echo "🔍 Checking MongoDB status..."
docker exec naagrik-mongodb mongosh --eval "rs.status()" --quiet

# Check if application is ready
echo "🔍 Checking application health..."
curl -f http://localhost:3000/api/health || echo "Application is starting up..."

echo "✅ Setup complete!"
echo "🌐 Application: http://localhost:3000"
echo "📊 MongoDB: localhost:27017"
echo ""
echo "To view logs: docker-compose logs -f"
echo "To stop: docker-compose down"
