document.addEventListener('DOMContentLoaded', function() {
    const printBtn = document.getElementById('printBtn');
    const statusArea = document.getElementById('status');
    
    // Check if ePOS-Print API is available
    if (typeof epson !== 'undefined' && epson.ePOSBuilder) {
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
        
        updateStatus('Preparing print job...');
        
        try {
            // Create a new ePOS builder object
            const builder = new epson.ePOSBuilder();
            
            // Add text to the builder
            builder.addText(printText);
            builder.addFeedLine(3);
            builder.addCut(builder.CUT_FEED);
            
            // Get the ESC/POS command from the builder
            const printerData = builder.toString();
            
            // Use our server proxy to send the data to the printer
            fetch('/printer-proxy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    printerIP: printerIP,
                    printerPort: printerPort,
                    data: printerData
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    updateStatus('Print job sent successfully!');
                } else {
                    updateStatus('Failed to print: ' + data.message, true);
                }
            })
            .catch(error => {
                updateStatus('Error sending print job: ' + error.message, true);
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
