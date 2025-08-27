@echo off
echo 🚀 Starting Naagrik Application with Docker...

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running. Please start Docker Desktop first.
    exit /b 1
)

echo 🐳 Docker is running

REM Stop any existing containers
echo 🛑 Stopping existing containers...
docker-compose down -v

REM Build and start all services
echo 🏗️ Building and starting services...
docker-compose up --build -d

REM Wait for services to be ready
echo ⏳ Waiting for services to be ready...
timeout /t 30 /nobreak >nul

REM Check if MongoDB is ready
echo 🔍 Checking MongoDB status...
docker exec naagrik-mongodb mongosh --eval "rs.status()" --quiet

REM Check if application is ready
echo 🔍 Checking application health...
curl -f http://localhost:3000/api/health 2>nul || echo Application is starting up...

echo ✅ Setup complete!
echo 🌐 Application: http://localhost:3000
echo 📊 MongoDB: localhost:27017
echo.
echo To view logs: docker-compose logs -f
echo To stop: docker-compose down

pause
