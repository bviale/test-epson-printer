# Epson TM-M30II Printer Web App

A simple web application that allows printing text to an Epson TM-M30II thermal printer from a web browser.

## Features

- Connect to any Epson TM-M30II printer on your local network
- Print custom text content
- Works with modern browsers (Chrome, Firefox, Edge)

## Usage

1. Visit the [web app](https://bviale.github.io/test-epson-printer/)
2. Enter your printer's IP address and port (usually 8008)
3. Type the text you want to print
4. Click "Print"

## Browser Security

Since this app needs to communicate with local printers over HTTP from an HTTPS website, you may need to:

- **Chrome**: Click the lock icon > Site Settings > Allow insecure content
- **Firefox**: Click the shield icon > Disable protection for now
- **Safari**: May not work due to stricter security policies

## Local Development

To run this app locally:

```bash
# Clone the repository
git clone https://github.com/bviale/test-epson-printer.git
cd test-epson-printer

# Open the app in your browser
open index.html
```

See [deployment-guide.md](deployment-guide.md) for more detailed deployment options.
