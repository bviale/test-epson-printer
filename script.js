document.addEventListener('DOMContentLoaded', function() {
    const printBtn = document.getElementById('printBtn');
    const statusArea = document.getElementById('status');
    const securityInfo = document.getElementById('securityInfo');
    
    // Check if we're running in a secure context (HTTPS)
    if (window.isSecureContext) {
        // We're in a secure context, but we still need to access a local printer
        securityInfo.style.display = 'block';
    }
    
    // Check if ePOS-Print API is available
    if (typeof epson !== 'undefined') {
        updateStatus('ePOS-Print API loaded successfully.');
    } else {
        updateStatus('Error: ePOS-Print API not available. Please check your connection.', true);
    }
    
    printBtn.addEventListener('click', function() {
        printText();
    });
    
    function printText() {
        const printerIP = document.getElementById('printerIP').value;
        const printerPort = document.getElementById('printerPort').value;
        const printText = document.getElementById('printText').value;
        
        if (!printerIP) {
            updateStatus('Please enter a printer IP address.', true);
            return;
        }
        
        if (!printText) {
            updateStatus('Please enter some text to print.', true);
            return;
        }
        
        // Create a new ePOS device object
        const epos = new epson.ePOSDevice();
        
        updateStatus('Connecting to printer...');
        
        // Connect to the printer using websocket if possible
        epos.connect(printerIP, printerPort, (isConnected) => {
            if (!isConnected) {
                updateStatus(`Failed to connect to the printer at ${printerIP}:${printerPort}. 
                If you're using HTTPS, check that your browser allows insecure connections to local devices.`, true);
                return;
            }
            
            updateStatus('Connected to printer. Creating printer object...');
            
            // Create printer object
            epos.createDevice('local_printer', epos.DEVICE_TYPE_PRINTER, 
                { crypto: false, buffer: false }, 
                function(printer, code) {
                    if (code !== 'OK') {
                        updateStatus('Failed to create printer object: ' + code, true);
                        epos.disconnect();
                        return;
                    }
                    
                    try {
                        // Add text to print
                        printer.addText(printText);
                        printer.addFeedLine(3);
                        printer.addCut(printer.CUT_FEED);
                        
                        updateStatus('Sending print job...');
                        
                        // Send data to printer
                        printer.send(function(result) {
                            const success = (result === 'SUCCESS');
                            const message = success ? 
                                'Print job sent successfully!' : 
                                'Failed to print: ' + result;
                            
                            updateStatus(message, !success);
                            
                            // Clean up
                            epos.deleteDevice(printer, function() {
                                epos.disconnect();
                            });
                        });
                    } catch (error) {
                        updateStatus('Error: ' + error.message, true);
                        epos.disconnect();
                    }
                }
            );
        });
    }
    
    function updateStatus(message, isError = false) {
        statusArea.textContent = message;
        statusArea.className = 'status-area ' + (isError ? 'status-error' : 'status-success');
        console.log(message);
    }
});
