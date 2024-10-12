const fs = require('fs-extra');
const puppeteer = require('puppeteer');
const path = require('path');
const { convertHtmlToMd } = require('./utils/transform');

async function validateInputDirectory(inputDir) {
  const isDirExists = await fs.exists(inputDir);
  if (!isDirExists) {
    console.error(`Input directory "${inputDir}" does not exist.`);
    process.exit(0);
  }
}

async function parseFiles(
  files,
  inputDir,
  outputDir,
  generateHtmlFiles = false,
  browser
) {
  for (const file of files) {
    const filePath = path.join(inputDir, file);
    try {
      const fileStat = await fs.stat(filePath);
      if (fileStat.isFile() && path.extname(file) === '.html') {
        await convertHtmlToMd(browser, filePath, generateHtmlFiles, outputDir);
      } else {
        console.warn('Skipping invalid file extension:', file);
      }
    } catch (error) {
      console.error(`Error processing file "${file}":`, error.message);
    }
  }
}

async function processDirectory(
  inputDir,
  outputDir,
  generateHtmlFiles = false
) {
  try {
    validateInputDirectory(inputDir);
    console.log('Processing directory:', inputDir);

    const browser = await puppeteer.launch({ headless: 'shell' });
    const files = fs.readdirSync(inputDir);
    await parseFiles(files, inputDir, outputDir, generateHtmlFiles, browser);

    // Close the browser instance after processing all files
    await browser.close();
  } catch (error) {
    console.error('Error processing directory:', error.message);
  }
}

module.exports = {
  processDirectory,
};
