document.addEventListener('DOMContentLoaded', function() {
    const printBtn = document.getElementById('printBtn');
    const statusArea = document.getElementById('status');
    
    // Check if ePOS-Print API is available
    if (typeof epson !== 'undefined' && epson.ePOSDevice) {
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
        
        updateStatus('Connecting to printer...');
        
        try {
            // Create a new ePOS device object
            const epos = new epson.ePOSDevice();
            
            // Connect to the printer
            epos.connect(printerIP, printerPort, function(connected) {
                if (!connected) {
                    updateStatus(`Failed to connect to the printer at ${printerIP}:${printerPort}. Please check the printer is turned on and connected to the network.`, true);
                    return;
                }
                
                updateStatus('Connected to printer. Creating printer object...');
                
                // Create printer object
                epos.createDevice('local_printer', epos.DEVICE_TYPE_PRINTER, 
                    { crypto: false, buffer: false }, 
                    function(device, code) {
                        if (code !== 'OK') {
                            updateStatus('Failed to create printer object: ' + code, true);
                            epos.disconnect();
                            return;
                        }
                        
                        const printer = device;
                        
                        // Add text to print
                        printer.addText(printText);
                        printer.addFeedLine(3);  // Add some space at the end
                        printer.addCut(printer.CUT_FEED);  // Cut the paper
                        
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
                    }
                );
            });
        } catch (error) {
            updateStatus('Error: ' + error.message, true);
        }
    }
    
    function updateStatus(message, isError = false) {
        statusArea.textContent = message;
        statusArea.className = 'status-area ' + (isError ? 'status-error' : 'status-success');
        console.log(message);
    }
});
