const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const app = express();

// SSL certificate options - self-signed for local development
const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

// Serve static files
app.use(express.static('./'));

// Parse JSON request bodies
app.use(express.json());

// Proxy endpoint for printer communication
app.post('/printer-proxy', (req, res) => {
  const { printerIP, printerPort, data } = req.body;
  
  if (!printerIP || !printerPort) {
    return res.status(400).json({ success: false, message: 'Missing printer IP or port' });
  }
  
  // Create options for the HTTP request to the printer
  const printerReqOptions = {
    hostname: printerIP,
    port: printerPort,
    path: '/cgi-bin/epos/service.cgi?devid=local_printer&timeout=10000',
    method: 'POST',
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
      'SOAPAction': '""'
    }
  };
  
  // Create the request to the printer
  const printerReq = http.request(printerReqOptions, (printerRes) => {
    let responseData = '';
    
    printerRes.on('data', (chunk) => {
      responseData += chunk;
    });
    
    printerRes.on('end', () => {
      res.json({
        success: true,
        statusCode: printerRes.statusCode,
        response: responseData
      });
    });
  });
  
  printerReq.on('error', (error) => {
    console.error('Error communicating with printer:', error);
    res.status(500).json({
      success: false,
      message: `Error communicating with printer: ${error.message}`
    });
  });
  
  // Send the data to the printer
  if (data) {
    printerReq.write(data);
  }
  
  printerReq.end();
});

// Create HTTPS server
const server = https.createServer(options, app);

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at https://localhost:${PORT}/`);
});
