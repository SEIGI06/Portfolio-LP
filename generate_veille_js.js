const fs = require('fs');
const path = require('path');

const templatePath = path.join(__dirname, 'js', 'veille.template.js');
const outputPath = path.join(__dirname, 'js', 'veille.js');

let templateContent = fs.readFileSync(templatePath, 'utf8');

// Replace placeholders with environment variables
templateContent = templateContent.replace(/process.env.NEWS_API_KEY/g, JSON.stringify(process.env.NEWS_API_KEY || ''));
templateContent = templateContent.replace(/process.env.GITHUB_TOKEN/g, JSON.stringify(process.env.GITHUB_TOKEN || ''));

fs.writeFileSync(outputPath, templateContent, 'utf8');

console.log('js/veille.js generated successfully with API keys.'); 