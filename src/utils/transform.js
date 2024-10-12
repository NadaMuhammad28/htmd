const fs = require('fs-extra');
const path = require('path');
const htmlToMd = require('html-to-md');

// Function to remove <style> tags after applying inline styles
async function removeStyleTags(page) {
  await page.evaluate(() => {
    const styleTags = document.querySelectorAll('style');
    styleTags.forEach((styleTag) => styleTag.remove());
  });
}

// Function to remove <script> tags after execution
async function removeScriptTags(page) {
  await page.evaluate(() => {
    const scriptTags = document.querySelectorAll('script');
    scriptTags.forEach((scriptTag) => scriptTag.remove());
  });
}

async function processHtmlWithPuppeteer(page, htmlContent) {
  await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' }); // Optimized waitUntil
  await removeStyleTags(page);
  await removeScriptTags(page);
  return page.content();
}

const convertHtmlToMd = async (
  browser,
  htmlFilePath,
  generateHtmlFile = false,
  outputDir
) => {
  try {
    const fileName = path.basename(htmlFilePath, '.html');
    await fs.ensureDir(outputDir);

    // File paths
    const mdFilePath = path.join(outputDir, `${fileName}.md`);
    const htmlContent = await fs.readFile(htmlFilePath, 'utf-8');

    let processedHtml = htmlContent;
    if (htmlContent.includes('<script') || htmlContent.includes('<style')) {
      // Open a new Puppeteer page if the file contains scripts or styles
      const page = await browser.newPage();
      try {
        processedHtml = await processHtmlWithPuppeteer(page, htmlContent);
      } finally {
        // Ensure the page is closed after processing
        await page.close();
      }
    }

    // Convert HTML to Markdown
    const markdownContent = htmlToMd(processedHtml);
    await fs.writeFile(mdFilePath, markdownContent, 'utf-8'); // Write Markdown file

    // Optionally generate the processed HTML file
    if (generateHtmlFile) {
      const htmlOutputDir = path.join(outputDir, 'html');
      await fs.ensureDir(htmlOutputDir);
      const htmlOutputFilePath = path.join(htmlOutputDir, `${fileName}.html`);
      await fs.writeFile(htmlOutputFilePath, processedHtml, 'utf-8');
    }

    console.log(`Converted ${htmlFilePath} to ${mdFilePath}`);
  } catch (error) {
    console.error(`Error processing the HTML file: ${htmlFilePath}`, error);
  }
};

module.exports = {
  convertHtmlToMd,
};
