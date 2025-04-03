# Epson Printer Web App Deployment Guide

This web application allows users to print to an Epson TM-M30II thermal printer from a web browser. Here's how to deploy and use it effectively.

## Deployment Options

### 1. GitHub Pages (Easiest)

This repository is already set up with GitHub Actions to deploy to GitHub Pages automatically when changes are pushed to the main branch.

The app is available at: https://bviale.github.io/test-epson-printer/

If you're forking this repository:
1. Go to your repository settings
2. Navigate to "Pages" section
3. Under "Build and deployment", select "GitHub Actions" as the source
4. The workflow file is already included in the repository

### 2. Any Static Web Hosting

Upload these files to any static web hosting service like:
- Netlify
- Vercel
- Amazon S3
- Google Cloud Storage
- Azure Static Web Apps

### 3. Self-Hosted with HTTPS

For proper security, use a valid SSL certificate when self-hosting:
1. Obtain a certificate from Let's Encrypt or your preferred provider
2. Configure your web server (Apache/Nginx) to use HTTPS

## Important Security Considerations

### Mixed Content Issues

Since this app needs to communicate with local printers over HTTP from an HTTPS website, users may encounter security errors:

**Chrome**: 
- Users need to click the lock icon in the address bar
- Select "Site settings"
- Change "Insecure content" to "Allow"

**Firefox**:
- Users need to click the shield icon in the address bar
- Click "Disable protection for now"

**Safari**:
- Safari has very strict security policies and may not allow mixed content at all
- Users may need to use Chrome or Firefox instead

### Alternative Approaches

If mixed content issues are problematic, consider:

1. **Browser Extension**: Create a browser extension that handles the printer communication
   
2. **Printer Configuration**: Some Epson printers can be configured to accept secure WebSocket connections

3. **Local Application**: Create a small desktop application that handles printing and communicates with the web app

## Troubleshooting

If users encounter issues:

1. Verify the printer is on the same network
2. Check that the IP address and port are correct
3. Ensure browser security settings allow insecure content
4. Verify the printer supports ePOS-Print
