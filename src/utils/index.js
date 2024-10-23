const fs = require('fs-extra');
const path = require('path');
const { turndownService } = require('./turndown');
const { inlineStyles, removeStyleTags } = require('./transformStyles');
const { removeScriptTags } = require('./removeScript');

// Process HTML with Puppeteer to ensure styles and scripts are handled
async function processHtmlWithPuppeteer(page, htmlContent) {
  await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });
  await inlineStyles(page); // Apply inline styles
  await removeStyleTags(page);
  await removeScriptTags(page);
  return page.content();
}

// Main conversion function
const convertHtmlToMd = async (
  browser,
  htmlFilePath,
  generateHtmlFile = false,
  outputDir
) => {
  try {
    const fileName = path.basename(htmlFilePath, '.html');
    await fs.ensureDir(outputDir);
    // File path
    const mdFilePath = path.join(outputDir, `${fileName}.md`);
    const htmlContent = await fs.readFile(htmlFilePath, 'utf-8');

    let processedHtml = htmlContent;
    if (processedHtml.includes('<script') || processedHtml.includes('<style')) {
      const page = await browser.newPage();
      try {
        processedHtml = await processHtmlWithPuppeteer(page, processedHtml);
      } finally {
        await page.close();
      }
    }

    // Convert HTML to Markdown using Turndown
    const markdownContent = turndownService.turndown(processedHtml);
    // Write the converted Markdown file
    await fs.writeFile(mdFilePath, markdownContent, 'utf-8');
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
