# Deployment Guide

## Production Setup

### 1. Environment Configuration

Create `.env.production`:
```
DATABASE_URL="postgresql://user:password@production-db.example.com:5432/betting_tracker"
JWT_SECRET="your-super-secret-key-change-this"
ODDS_API_KEY="your-odds-api-key"
NEXT_PUBLIC_API_URL="https://betting-tracker.example.com"
NEXT_PUBLIC_WS_URL="https://betting-tracker.example.com"
```

### 2. Database Setup

```bash
# Run migrations
npx prisma migrate deploy

# Seed initial data (optional)
npx prisma db seed
```

### 3. Building for Production

```bash
npm run build
npm run start
```

### 4. Deployment Options

#### Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

#### Docker
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

```bash
docker build -t betting-tracker .
docker run -p 3000:3000 betting-tracker
```

#### AWS/EC2
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repo
git clone <repo-url>
cd betting-tracker

# Install and build
npm install
npm run build

# Use PM2 for process management
npm install -g pm2
pm2 start npm --name "betting-tracker" -- start
pm2 startup
pm2 save
```

### 5. Database Backups

```bash
# Backup PostgreSQL
pg_dump betting_tracker > backup.sql

# Restore from backup
psql betting_tracker < backup.sql
```

### 6. SSL/HTTPS

Use Let's Encrypt with Nginx:
```bash
sudo certbot certonly --nginx -d betting-tracker.com
```

### 7. Performance Optimization

- Enable Prisma caching
- Use CDN for static assets
- Implement rate limiting
- Set up database connection pooling

### 8. Monitoring & Logging

```bash
# PM2 monitoring
pm2 monit

# View logs
pm2 logs betting-tracker
```

### 9. Mobile App Deployment

#### iOS
```bash
cd mobile
npm run ios
# Use Xcode to archive and submit to App Store
```

#### Android
```bash
cd mobile
npm run android
# Use Android Studio to build and upload to Play Store
```

## Domain & URL Setup

You can connect your custom domain by:

1. **Vercel**: Add domain in project settings
2. **AWS Route53**: Create A record pointing to your IP
3. **Cloudflare**: Update nameservers and create DNS records
4. **GoDaddy**: Manage DNS through their panel

## API Endpoints

All API endpoints will be available at:
- Web: `https://your-domain.com/api/*`
- Mobile: Configure `NEXT_PUBLIC_API_URL` in mobile app

## Support

For deployment issues:
- Check server logs: `pm2 logs`
- Verify environment variables
- Test database connection
- Check API key validity
