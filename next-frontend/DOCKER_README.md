# 🐳 Docker Setup for Naagrik

This setup provides a complete containerized environment for the Naagrik application with MongoDB replica set support.

## 🚀 Quick Start

### One Command Setup
```bash
docker-compose up --build
```

Or use the convenient scripts:

**Windows:**
```cmd
start-docker.bat
```

**Linux/Mac:**
```bash
chmod +x start-docker.sh
./start-docker.sh
```

## 📋 What Gets Started

1. **MongoDB 7.0** with replica set (`rs0`)
   - Port: `27017`
   - Username: `admin`
   - Password: `naagrik123`
   - Database: `Nagrik`
   - Replica set for Prisma transactions

2. **Next.js Application**
   - Port: `3000`
   - Production build
   - Connected to MongoDB replica set
   - Health check endpoint: `/api/health`

## 🔧 Configuration

### Environment Variables
All environment variables are configured in `docker-compose.yml`:
- Database connection with replica set support
- Cloudinary configuration
- JWT secrets
- SMTP settings
- Map configuration

### MongoDB Replica Set
- Automatically initialized with security
- Application user created: `naagrik_user`
- Supports Prisma transactions
- Data persistence with Docker volumes

## 📊 Monitoring

### Health Checks
- **MongoDB**: Built-in health check with `mongosh`
- **Application**: Custom health endpoint at `/api/health`

### Logs
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f nextjs-app
docker-compose logs -f mongodb
```

## 🛠️ Management Commands

### Start Services
```bash
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### Rebuild and Start
```bash
docker-compose up --build -d
```

### Clean Everything (including data)
```bash
docker-compose down -v
docker system prune -a
```

### Access MongoDB Shell
```bash
docker exec -it naagrik-mongodb mongosh -u admin -p naagrik123 --authenticationDatabase admin
```

### Access Application Container
```bash
docker exec -it naagrik-app /bin/sh
```

## 🔍 Troubleshooting

### Check Service Status
```bash
docker-compose ps
```

### MongoDB Replica Set Status
```bash
docker exec naagrik-mongodb mongosh -u admin -p naagrik123 --authenticationDatabase admin --eval "rs.status()"
```

### Application Health
```bash
curl http://localhost:3000/api/health
```

### Common Issues

1. **Port conflicts**: Make sure ports 3000 and 27017 are not in use
2. **Docker not running**: Ensure Docker Desktop is started
3. **Replica set not ready**: Wait 30-60 seconds for initialization
4. **Build failures**: Check if all dependencies are properly installed

## 📁 Docker Files Structure

```
├── Dockerfile                 # Next.js application container
├── docker-compose.yml         # Complete service orchestration
├── .dockerignore              # Files to exclude from build
├── scripts/
│   └── init-replica.js        # MongoDB replica set initialization
├── start-docker.bat           # Windows startup script
└── start-docker.sh            # Linux/Mac startup script
```

## 🎯 Access Points

- **Application**: http://localhost:3000
- **Health Check**: http://localhost:3000/api/health
- **MongoDB**: mongodb://admin:naagrik123@localhost:27017/Nagrik?authSource=admin&replicaSet=rs0

## ⚙️ Production Notes

- All services include restart policies
- Data is persisted with Docker volumes
- Health checks ensure service reliability
- Replica set provides transaction support
- Security configured with authentication and keyfiles
