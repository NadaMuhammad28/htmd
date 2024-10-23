// Function to apply inline styles
async function inlineStyles(page) {
  await page.evaluate(() => {
    const elements = document.querySelectorAll('*');
    elements.forEach((element) => {
      const computedStyle = getComputedStyle(element);
      const inlineStyle = element.getAttribute('style') || '';

      if (inlineStyle)
        element.setAttribute(
          'style',
          `${inlineStyle};` + computedStyle.cssText
        );
    });
  });
}

// Function to remove <style> tags after applying inline styles
async function removeStyleTags(page) {
  await page.evaluate(() => {
    const styleTags = document.querySelectorAll('style');
    styleTags.forEach((styleTag) => styleTag.remove());
  });
}

module.exports = {
  inlineStyles,
  removeStyleTags,
};
