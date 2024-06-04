# Web Scraper

This Node.js script scrapes job details from a website( https://jobrack.eu /) using Puppeteer, saves them to DynamoDB, and exports them to a JSON file.

```javascript
// Configuration
AWS.config.update({
    accessKeyId: 'YOUR_ACCESS_KEY_ID',
    secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
    region: 'YOUR_REGION'
});

// Usage
// 1. Clone or download the repository.
// 2. Update the AWS credentials in the script.
// 3. Run the script:
//    node index.js

// Overview
// The script visits multiple pages of a job listing website, extracts job details using Puppeteer,
// saves them to DynamoDB, and exports them to a JSON file.
