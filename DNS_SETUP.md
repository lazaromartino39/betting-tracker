# PickItTracker.com DNS Setup Guide

## Quick Start - 3 Steps

### Step 1: Get Your Domain

You already own **pickittracker.com**. ✅

### Step 2: Point Your Domain to Your Server

You have **2 options**:

#### Option A: Using Vercel (RECOMMENDED - Easiest)
1. Go to https://vercel.com and sign up
2. Import this repository
3. Vercel gives you a URL (e.g., `betting-tracker.vercel.app`)
4. In Vercel dashboard, go to Settings → Domains
5. Add `pickittracker.com`
6. Follow Vercel's instructions to update your DNS

#### Option B: Using Your Own Server (AWS, DigitalOcean, etc.)
Your server IP address: **_[You provide this]_**

### Step 3: Update DNS Records

**Login to your domain registrar** (GoDaddy, Namecheap, etc.) and update these records:

#### For Vercel:
```
Type: CNAME
Name: www
Value: cname.vercel.sh
TTL: 3600

Type: A
Name: @
Value: 76.76.19.132
TTL: 3600
```

#### For Your Own Server:
```
Type: A
Name: @
Value: YOUR_SERVER_IP
TTL: 3600

Type: A
Name: www
Value: YOUR_SERVER_IP
TTL: 3600
```

---

## Detailed Steps by Registrar

### GoDaddy
1. Login to godaddy.com
2. Go to "My Domains"
3. Click on `pickittracker.com`
4. Click "Manage DNS"
5. Edit the **A Record** and **CNAME Record**
6. Save changes

### Namecheap
1. Login to namecheap.com
2. Go to "Domain List"
3. Click "Manage" on `pickittracker.com`
4. Go to "Advanced DNS"
5. Edit records as shown above
6. Save

### Cloudflare
1. Login to cloudflare.com
2. Add site `pickittracker.com`
3. Cloudflare gives you nameservers
4. Go back to your registrar
5. Update nameservers to Cloudflare's
6. In Cloudflare, add A and CNAME records

---

## SSL Certificate (HTTPS)

### Vercel
Automatic! Vercel gives you FREE HTTPS.

### Your Own Server
Use Let's Encrypt (FREE):

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --standalone -d pickittracker.com -d www.pickittracker.com

# Auto-renew
sudo systemctl enable certbot.timer
```

---

## Environment Variables

After deployment, add these to your production environment:

```
DATABASE_URL=postgresql://user:password@db.example.com/betting_tracker
JWT_SECRET=your-super-secret-key-change-this
ODDS_API_KEY=your-odds-api-key-from-the-odds-api.com
NEXT_PUBLIC_API_URL=https://pickittracker.com
NEXT_PUBLIC_WS_URL=https://pickittracker.com
ADMIN_USER_ID=your-user-id-for-admin-picks
```

---

## Testing

After DNS updates (may take 15-30 minutes):

```bash
# Test DNS propagation
nslookup pickittracker.com

# Should return your server IP
```

Visit:
- https://pickittracker.com — Should load the site ✅
- https://pickittracker.com/signin — Should load login ✅
- https://pickittracker.com/pickitbros — Should show your picks ✅

---

## Common Issues

**"Domain not connecting"**
- Wait 15-30 minutes for DNS to propagate
- Clear browser cache
- Try a different browser

**"SSL Certificate Error"**
- Verify domain is pointing to correct server
- Wait for certificate to generate (5-10 minutes)
- Restart server if needed

**"404 Not Found"**
- Verify all environment variables are set
- Check server is running
- Check database connection

---

## Support Commands

```bash
# Check if domain resolves
dig pickittracker.com

# Check SSL certificate
curl -I https://pickittracker.com

# View server logs (if using Vercel)
# Dashboard → logs

# View server logs (if using own server)
pm2 logs betting-tracker
```

---

## Next Steps

1. ✅ Finalize domain & hosting choice
2. ✅ Set up DNS records
3. ✅ Deploy application
4. ✅ Set environment variables
5. ✅ Test site is live
6. 🚀 Share with users!

**You've got this!** 🎯
