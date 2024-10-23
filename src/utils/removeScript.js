// Function to remove <script> tags after execution
async function removeScriptTags(page) {
  await page.evaluate(() => {
    const scriptTags = document.querySelectorAll('script');
    scriptTags.forEach((scriptTag) => scriptTag.remove());
  });
}

module.exports = {
  removeScriptTags,
};
