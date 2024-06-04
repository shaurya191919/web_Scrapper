const puppeteer = require('puppeteer');
const AWS = require('aws-sdk');
const fs = require('fs');


AWS.config.update({
    accessKeyId: '',
    secretAccessKey: '',
    region: ''
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const jobDetails = [];

async function scrapping() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    let currentPage = 1;

    while (currentPage < 270) {
        const url = `https://jobrack.eu/jobs?page=${currentPage}`;
        await page.goto(url);

        const jobDetail = await page.evaluate(() => Array.from(document.querySelectorAll('.list-group-item'), (e) => ({
            jobTitle: e.querySelector('.row .jobs-main .job-title').innerText,
            jobComName: e.querySelector('.row .jobs-main .company-name').innerText,
            jobURL: e.href
        })));

        for (let job of jobDetail) {
            await page.goto(job.jobURL);

            const jobData = await page.evaluate(() => {
                const jobDescription = document.querySelector('.job-description ul:nth-of-type(2)')?.innerText || '';
                const companyURL = document.querySelector('.company-profile-link')?.href || '';
                const companyLogoURL = document.querySelector('.company a img')?.src || '';
                const companyDescription = document.querySelector('.job-description p')?.innerText || '';

                return {
                    jobDescription,
                    companyURL,
                    companyLogoURL,
                    companyDescription
                };
            });

            job.jobDescription = jobData.jobDescription;
            job.companyURL = jobData.companyURL;
            job.companyLogoURL = jobData.companyLogoURL;
            job.companyDescription = jobData.companyDescription;

            await saveToDynamoDB(job);
            jobDetails.push(job);
        }

        currentPage++;
    }

    await browser.close();

  
   // console.log(JSON.stringify(jobDetails, null, 2));

    
    fs.writeFile('jobDetails.json', JSON.stringify(jobDetails, null, 2), (err) => {
        if (err) throw err;
        console.log('File saved');
    });
}

async function saveToDynamoDB(job) {
    const params = {
        TableName: 'JobDetails', 
        Item: {
            jobTitle: job.jobTitle,
            jobComName: job.jobComName,
            jobURL: job.jobURL,
            jobDescription: job.jobDescription,
            companyURL: job.companyURL,
            companyLogoURL: job.companyLogoURL,
            companyDescription: job.companyDescription
        }
    };

    try {
        await dynamodb.put(params).promise();
        console.log(`Saved job: ${job.jobTitle}`);
    } catch (err) {
        console.error(`Error saving job: ${job.jobTitle}`, err);
    }
}

scrapping();
