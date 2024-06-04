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
// saves them to DynamoDB, and exports them to a JSON file.# Overview

The script follows these steps to scrape job details:

1. It launches a Puppeteer browser and navigates to the job listing website.
2. It iterates through the pages of job listings and extracts job details such as company name, job title, and URL.
3. For each job, it navigates to the job URL and extracts additional details such as job description, company URL, and company logo URL.
4. It saves the extracted job details to both DynamoDB and a JSON file.
