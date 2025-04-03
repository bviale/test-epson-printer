const https = require('https');
const fs = require('fs');
const path = require('path');

// SSL certificate options - self-signed for local development
const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

// Simple HTTPS server
const server = https.createServer(options, (req, res) => {
  // Get the URL path
  let filePath = '.' + req.url;
  if (filePath === './') {
    filePath = './index.html';
  }

  // Get the file extension
  const extname = path.extname(filePath);
  let contentType = 'text/html';
  
  // Set the correct content type
  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
  }

  // Read the file
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if(error.code === 'ENOENT') {
        res.writeHead(404);
        res.end('File not found');
      } else {
        res.writeHead(500);
        res.end('Server error: ' + error.code);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at https://localhost:${PORT}/`);
});
const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const https = require('https');

// Serve static files
app.use(express.static('./'));

// Start the server
const PORT = process.env.PORT || 443;

// For production, you'll use Let's Encrypt certificates
// This is just a placeholder for the structure
const options = {
  key: fs.readFileSync('/path/to/privkey.pem'),
  cert: fs.readFileSync('/path/to/fullchain.pem')
};

https.createServer(options, app).listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
