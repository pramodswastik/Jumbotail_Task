# Deployment Guide - Phase 10

Complete guide for deploying the E-Commerce Search Engine microservice.

## 📋 Table of Contents

1. [Local Development Setup](#local-development-setup)
2. [Production Build](#production-build)
3. [Windows Deployment](#windows-deployment)
4. [Linux Deployment](#linux-deployment)
5. [Docker Deployment](#docker-deployment)
6. [Performance Tuning](#performance-tuning)
7. [Monitoring & Logging](#monitoring--logging)
8. [Troubleshooting](#troubleshooting)

---

## Local Development Setup

### Prerequisites

- Node.js 14.x or higher
- npm 6.x or higher
- Git
- Text editor (VS Code recommended)

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/pramodswastik/Jumbotail_Task.git
   cd Jumbotail_Task
   ```

2. **Install backend dependencies**

   ```bash
   npm install
   ```

3. **Create environment file**

   ```bash
   # Create .env file
   echo PORT=3000 > .env
   echo NODE_ENV=development >> .env
   echo DEBUG=app:* >> .env
   ```

4. **Install frontend dependencies**

   ```bash
   cd frontend
   npm install
   cd ..
   ```

5. **Start backend (Terminal 1)**

   ```bash
   npm start
   # Server runs on http://localhost:3000
   ```

6. **Start frontend (Terminal 2)**

   ```bash
   cd frontend
   npm run dev
   # Frontend runs on http://localhost:5173
   ```

7. **Verify installation**

   ```bash
   # Check backend health
   curl http://localhost:3000/health

   # Check catalog loaded
   curl http://localhost:3000/api/v1/search/stats
   ```

---

## Production Build

### Backend Optimization

```bash
# Install production dependencies only
npm install --production

# Create optimized .env
cat > .env << EOF
PORT=3000
NODE_ENV=production
DEBUG=
EOF
```

### Frontend Optimization

```bash
cd frontend

# Build for production
npm run build
# Output: frontend/dist/

# Analyze bundle
npm run build -- --analyze

# Serve built files locally for testing
npx serve dist
```

### Performance Optimization Tips

1. **Backend**
   - Use production-grade Node.js process manager (PM2, systemd)
   - Enable compression middleware
   - Implement caching for search results
   - Use clustering for multi-core systems

2. **Frontend**
   - Bundle is automatically optimized by Vite
   - CSS is minified and optimized
   - Code splitting for lazy loading
   - Gzip compression enabled

3. **Database** (When upgraded from in-memory)
   - Add MongoDB indexing on title, category, brand
   - Implement query result caching
   - Use connection pooling

---

## Windows Deployment

### Option 1: Direct Node.js Execution

```bash
# Navigate to project
cd d:\Desktop\Jumbotail_Task

# Install dependencies
npm install

# Create startup script (run-server.bat)
@echo off
set NODE_ENV=production
set PORT=3000
node server.js
```

### Option 2: Windows Service (Using NSSM)

```bash
# Download NSSM: https://nssm.cc/

# Install service
nssm install JumbotailSearchService "C:\Program Files\nodejs\node.exe" "d:\Desktop\Jumbotail_Task\server.js"

# Configure service
nssm set JumbotailSearchService AppDirectory "d:\Desktop\Jumbotail_Task"
nssm set JumbotailSearchService AppEnvironmentExtra NODE_ENV=production

# Start service
nssm start JumbotailSearchService

# Check status
nssm status JumbotailSearchService
```

### Option 3: PM2 (Recommended)

```bash
# Install PM2 globally
npm install -g pm2

# Create ecosystem config (ecosystem.config.js)
module.exports = {
  apps: [
    {
      name: 'jumbotail-search',
      script: './server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};

# Start with PM2
pm2 start ecosystem.config.js

# Make PM2 persistent
pm2 startup windows
pm2 save
```

### Option 4: IIS (Internet Information Services)

```bash
# Install iisnode
# https://github.com/tjanczuk/iisnode

# Create web.config
<configuration>
  <system.webServer>
    <handlers>
      <add name="iisnode" path="server.js" verb="*" modules="iisnode" />
    </handlers>
    <iisnode node_env="production" />
  </system.webServer>
</configuration>

# Deploy to IIS app folder
Copy-Item -Path "d:\Desktop\Jumbotail_Task\*" -Destination "C:\inetpub\wwwroot\jumbotail" -Recurse
```

---

## Linux Deployment

### Option 1: Systemd Service

```bash
# Create service file
sudo nano /etc/systemd/system/jumbotail.service

# Add this content:
[Unit]
Description=Jumbotail Search Engine
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/home/ubuntu/Jumbotail_Task
ExecStart=/usr/bin/node /home/ubuntu/Jumbotail_Task/server.js
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog

[Install]
WantedBy=multi-user.target

# Enable and start
sudo systemctl daemon-reload
sudo systemctl enable jumbotail
sudo systemctl start jumbotail

# Check status
sudo systemctl status jumbotail
sudo journalctl -u jumbotail -f
```

### Option 2: Nginx Reverse Proxy

```bash
# Install Nginx
sudo apt-get install nginx

# Create config
sudo nano /etc/nginx/sites-available/jumbotail

# Add this content:
upstream jumbotail_backend {
  server 127.0.0.1:3000;
}

upstream jumbotail_frontend {
  server 127.0.0.1:5173;
}

server {
  listen 80;
  server_name yourdomain.com;

  # Frontend
  location / {
    proxy_pass http://jumbotail_frontend;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }

  # API
  location /api/ {
    proxy_pass http://jumbotail_backend;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }

  # Enable gzip
  gzip on;
  gzip_types text/plain text/css application/json application/javascript;
}

# Enable site
sudo ln -s /etc/nginx/sites-available/jumbotail /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

### Option 3: PM2 with Nginx

```bash
# Install PM2 globally
sudo npm install -g pm2

# Create ecosystem config
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [
    {
      name: 'jumbotail-search',
      script: './server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
EOF

# Start with PM2
pm2 start ecosystem.config.js

# Make PM2 persistent
pm2 startup systemd -u ubuntu --hp /home/ubuntu
pm2 save
```

---

## Docker Deployment

### Dockerfile (Backend)

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application
COPY . .

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start application
CMD ["node", "server.js"]
```

### Dockerfile (Frontend)

```dockerfile
FROM node:18-alpine as builder

WORKDIR /app

COPY frontend/package*.json ./
RUN npm install

COPY frontend .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### docker-compose.yml

```yaml
version: "3.8"

services:
  backend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    restart: always
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: always

volumes:
  node_modules:
```

### Deploy with Docker

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Check logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## Performance Tuning

### Node.js Optimization

```javascript
// In server.js, before starting server

// 1. Enable compression
const compression = require("compression");
app.use(compression());

// 2. Set reasonable timeouts
server.setTimeout(60000); // 60 seconds

// 3. Increase max listeners
require("events").EventEmitter.defaultMaxListeners = 20;

// 4. Enable keep-alive
app.set("trust proxy", 1);
```

### Database Optimization (For MongoDB)

```javascript
// Add indexing for faster searches
db.products.createIndex({ title: "text", description: "text" });
db.products.createIndex({ category: 1, brand: 1 });
db.products.createIndex({ price: 1 });
db.products.createIndex({ rating: -1 });

// Enable caching in search service
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCachedSearch(query) {
  if (cache.has(query) && Date.now() - cache.get(query).timestamp < CACHE_TTL) {
    return cache.get(query).results;
  }
  return null;
}
```

### Frontend Optimization

```javascript
// In App.jsx

// 1. Lazy load components
const StatsView = React.lazy(() => import("./components/Stats"));

// 2. Debounce search
const debounce = (fn, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};

const debouncedSearch = debounce(handleSearch, 300);

// 3. Implement pagination
const [page, setPage] = useState(0);
const [resultsPerPage] = useState(20);
```

---

## Monitoring & Logging

### Application Logging

```javascript
// Create logger.js
const fs = require("fs");
const path = require("path");

const logStream = fs.createWriteStream(
  path.join(__dirname, "logs", "app.log"),
  { flags: "a" },
);

function log(level, message, data = {}) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    ...data,
  };

  const logLine = JSON.stringify(logEntry) + "\n";
  logStream.write(logLine);

  if (level === "error") {
    console.error(logLine);
  } else {
    console.log(logLine);
  }
}

module.exports = { log };
```

### Performance Monitoring

```javascript
// Monitor API response times
app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    log("info", `${req.method} ${req.path}`, {
      statusCode: res.statusCode,
      duration: `${duration}ms`,
    });
  });

  next();
});
```

### Health Check Endpoint

```javascript
// GET /health
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    memory: process.memoryUsage(),
    products: productStore.getAllProducts().length,
  });
});
```

---

## Troubleshooting

### Common Issues

**Port Already in Use**

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux
lsof -i :3000
kill -9 <PID>
```

**npm install fails**

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

**High Memory Usage**

```bash
# Check memory
node --max-old-space-size=4096 server.js

# Or update package.json
"scripts": {
  "start": "node --max-old-space-size=4096 server.js"
}
```

**CORS Errors**

```javascript
// In server.js
app.use(
  cors({
    origin: ["http://localhost:5173", "http://yourdomain.com"],
    credentials: true,
  }),
);
```

### Performance Issues

**Slow Search**

1. Check indices in database
2. Verify rate limiting isn't blocking requests
3. Monitor memory usage
4. Check for slow queries in logs

**Frontend Lag**

1. Check network tab for slow API responses
2. Verify bundle size hasn't grown
3. Use React DevTools to check for unnecessary re-renders
4. Check for memory leaks

---

## Checklist

- [ ] Node.js 14+ installed
- [ ] All dependencies installed
- [ ] .env configured correctly
- [ ] Backend starts without errors
- [ ] Frontend builds successfully
- [ ] All APIs respond correctly
- [ ] Frontend connects to backend
- [ ] Rate limiting works
- [ ] Logging configured
- [ ] Health check endpoint responds
- [ ] Performance metrics acceptable
- [ ] Security headers present
- [ ] CORS configured for production domain
- [ ] SSL/TLS certificate installed (for HTTPS)
- [ ] Backups configured

---

**For more details, see README.md and other documentation files.**
