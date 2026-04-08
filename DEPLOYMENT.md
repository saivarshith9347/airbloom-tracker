# 🚀 AirBloom Tracker - Deployment Guide

## Quick Deployment Options

### 1. Vercel (Recommended)

#### One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

#### Manual Deploy
```bash
# Install Vercel CLI
npm i -g vercel

# Build the project
npm run build

# Deploy
vercel --prod
```

#### Configuration
Create `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

### 2. Netlify

#### One-Click Deploy
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

#### Manual Deploy
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build the project
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

#### Configuration
Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### 3. GitHub Pages

#### Setup
```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"

# Deploy
npm run deploy
```

#### Configuration
Update `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/your-repo-name/',
  // ... rest of config
});
```

---

### 4. Docker

#### Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.conf
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

#### Build and Run
```bash
# Build image
docker build -t airbloom-tracker .

# Run container
docker run -p 80:80 airbloom-tracker
```

#### Docker Compose
```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "80:80"
    restart: unless-stopped
```

---

### 5. AWS S3 + CloudFront

#### Build
```bash
npm run build
```

#### Upload to S3
```bash
# Install AWS CLI
aws configure

# Create S3 bucket
aws s3 mb s3://airbloom-tracker

# Upload files
aws s3 sync dist/ s3://airbloom-tracker --delete

# Enable static website hosting
aws s3 website s3://airbloom-tracker --index-document index.html --error-document index.html
```

#### CloudFront Setup
1. Create CloudFront distribution
2. Set origin to S3 bucket
3. Configure custom error responses (404 → /index.html)
4. Enable HTTPS
5. Set up custom domain (optional)

---

### 6. Railway

#### Deploy
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up
```

#### Configuration
Create `railway.json`:
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run preview",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

---

### 7. Render

#### Configuration
Create `render.yaml`:
```yaml
services:
  - type: web
    name: airbloom-tracker
    env: static
    buildCommand: npm install && npm run build
    staticPublishPath: ./dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
```

#### Deploy
1. Connect GitHub repository
2. Render auto-detects configuration
3. Deploy automatically on push

---

## Environment Variables

### Production Setup

Create `.env.production`:
```env
VITE_API_URL=https://api.yourserver.com
VITE_THINGSPEAK_CHANNEL_ID=your_channel_id
VITE_THINGSPEAK_API_KEY=your_api_key
VITE_MAP_API_KEY=your_map_api_key
```

### Platform-Specific

#### Vercel
```bash
vercel env add VITE_API_URL production
```

#### Netlify
```bash
netlify env:set VITE_API_URL "https://api.yourserver.com"
```

#### Docker
```bash
docker run -e VITE_API_URL=https://api.yourserver.com airbloom-tracker
```

---

## Pre-Deployment Checklist

### ✅ Code Quality
- [ ] Run linter: `npm run lint`
- [ ] Run tests: `npm run test`
- [ ] Build succeeds: `npm run build`
- [ ] No console errors in production build

### ✅ Configuration
- [ ] Update API endpoints
- [ ] Set environment variables
- [ ] Configure CORS settings
- [ ] Update authentication endpoints

### ✅ Security
- [ ] Remove demo credentials
- [ ] Implement real authentication
- [ ] Enable HTTPS
- [ ] Set up CSP headers
- [ ] Configure rate limiting

### ✅ Performance
- [ ] Optimize images
- [ ] Enable gzip compression
- [ ] Configure caching headers
- [ ] Minimize bundle size
- [ ] Enable lazy loading

### ✅ SEO & Meta
- [ ] Update page titles
- [ ] Add meta descriptions
- [ ] Configure Open Graph tags
- [ ] Add favicon
- [ ] Create sitemap

---

## Post-Deployment

### Monitoring
```bash
# Check build logs
# Monitor error rates
# Track performance metrics
# Set up alerts
```

### Analytics
- Google Analytics
- Plausible
- Mixpanel
- Custom analytics

### Error Tracking
- Sentry
- LogRocket
- Rollbar
- Custom error logging

---

## Custom Domain Setup

### Vercel
```bash
vercel domains add yourdomain.com
```

### Netlify
```bash
netlify domains:add yourdomain.com
```

### DNS Configuration
```
Type: A
Name: @
Value: [Platform IP]

Type: CNAME
Name: www
Value: [Platform domain]
```

---

## SSL/TLS Certificate

Most platforms provide automatic SSL:
- Vercel: Automatic
- Netlify: Automatic
- Render: Automatic
- Railway: Automatic

For custom setups:
```bash
# Let's Encrypt with Certbot
certbot --nginx -d yourdomain.com
```

---

## CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## Rollback Strategy

### Vercel
```bash
# List deployments
vercel ls

# Rollback to previous
vercel rollback [deployment-url]
```

### Netlify
```bash
# List deploys
netlify deploy:list

# Restore previous
netlify deploy:restore [deploy-id]
```

### Docker
```bash
# Tag versions
docker tag airbloom-tracker:latest airbloom-tracker:v1.0.0

# Rollback
docker run airbloom-tracker:v1.0.0
```

---

## Performance Optimization

### Build Optimization
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts'],
          maps: ['leaflet', 'react-leaflet'],
        },
      },
    },
  },
});
```

### Caching Headers
```nginx
# nginx.conf
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

---

## Troubleshooting

### Build Fails
```bash
# Clear cache
rm -rf node_modules dist
npm install
npm run build
```

### Routes Not Working
- Ensure SPA fallback is configured
- Check `_redirects` or `vercel.json`
- Verify nginx configuration

### Environment Variables Not Loading
- Prefix with `VITE_`
- Rebuild after adding variables
- Check platform-specific syntax

---

## Support & Resources

- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [React Router Deployment](https://reactrouter.com/en/main/guides/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)

---

**Your app is ready for production! 🚀**
