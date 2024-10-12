#!/usr/bin/env node
const { program } = require('commander');
const { processDirectory } = require('../src');

(async function main() {
  program
    .version('1.0.0')
    .description('A CLI tool for transforming HTML files into Markdown')
    .requiredOption(
      '-i, --input <inputDir>',
      'Input directory containing HTML files'
    )
    .requiredOption(
      '-o, --output <outputDir>',
      'Output directory for the converted Markdown files'
    )
    .option(
      '-h, --html',
      'optionl flag to generate html files after js execution'
    )

    // Parse command-line arguments
    .parse(process.argv);

  const options = program.opts();

  try {
    await processDirectory(options.input, options.output, options.html);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
})();
