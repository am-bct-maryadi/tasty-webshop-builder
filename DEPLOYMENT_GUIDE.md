# 🚀 FoodieApp Deployment Guide

## Overview
This guide will help you deploy your FoodieApp to any hosting provider. The app is built with React, Vite, and uses Supabase as the backend.

## Prerequisites
- Node.js 18+ installed
- Access to your hosting provider (Vercel, Netlify, cPanel, etc.)
- Supabase project already set up

## 📦 Build Process

### 1. Install Dependencies
```bash
npm install
```

### 2. Build for Production
```bash
npm run build
```
This creates a `dist` folder with all production files.

### 3. Preview Build (Optional)
```bash
npm run preview
```
Test your build locally before deployment.

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)
1. **Connect GitHub Repository**
   - Push your code to GitHub
   - Go to [vercel.com](https://vercel.com)
   - Import your repository

2. **Configure Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Deploy**
   - Vercel will automatically deploy on every push to main branch

### Option 2: Netlify
1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - New site from Git → Connect GitHub

2. **Build Settings**
   - Build Command: `npm run build`
   - Publish Directory: `dist`

3. **Configure Redirects**
   Create `public/_redirects` file:
   ```
   /*    /index.html   200
   ```

### Option 3: cPanel/Shared Hosting
1. **Build Locally**
   ```bash
   npm run build
   ```

2. **Upload Files**
   - Compress `dist` folder contents
   - Upload to `public_html` directory
   - Extract files

3. **Configure .htaccess**
   Create `.htaccess` in public_html:
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

### Option 4: VPS/Cloud Server
1. **Install Nginx**
   ```bash
   sudo apt update
   sudo apt install nginx
   ```

2. **Upload Build Files**
   ```bash
   scp -r dist/* user@your-server:/var/www/html/
   ```

3. **Nginx Configuration**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /var/www/html;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

## 🔧 Configuration

### 1. Supabase Configuration
Your app is already configured with:
- **Project URL**: `https://pelytyjonytekqdiwjri.supabase.co`
- **Anon Key**: Already embedded in the code

### 2. Domain Configuration
After deployment:
1. Update your domain in Supabase dashboard
2. Go to Authentication → URL Configuration
3. Add your production URL to Site URL and Redirect URLs

## 📋 Pre-Deployment Checklist

- [ ] All admin passwords are set (`admin123`)
- [ ] Orders data is cleared for production
- [ ] Test all functionality in preview mode
- [ ] Verify Supabase connection works
- [ ] Check all admin features work correctly
- [ ] Test customer ordering flow
- [ ] Verify responsive design on mobile/tablet

## 🚀 Go Live Steps

1. **Deploy the Application**
   - Choose your preferred hosting option above
   - Wait for deployment to complete

2. **Update Supabase Settings**
   - Add production URL to allowed origins
   - Update authentication redirect URLs

3. **Test Production**
   - Test admin login: Use any admin username with password `admin123`
   - Test customer flow: Browse products, add to cart, place order
   - Test all branches are working correctly

4. **Final Setup**
   - Update brand settings in admin panel
   - Add your actual company information
   - Configure WhatsApp numbers for each branch
   - Upload your logo and images

## 🔐 Security Notes

- Change default admin passwords after deployment
- Regularly backup your Supabase database
- Monitor admin access logs
- Keep dependencies updated

## 📞 Support

If you encounter issues:
1. Check browser console for JavaScript errors
2. Verify Supabase connectivity
3. Check hosting provider logs
4. Ensure all files were uploaded correctly

## 🎯 Performance Tips

- Enable gzip compression on your server
- Use CDN if available
- Monitor Core Web Vitals
- Optimize images before uploading

---

Your FoodieApp is now ready for production! 🎉