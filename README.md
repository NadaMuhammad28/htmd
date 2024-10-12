# HTML Markup Transformer CLI

`html-markup-transformer` is a CLI tool for transforming HTML files, including those with embedded JavaScript, into Markdown files. Optionally, you can generate processed HTML files with executed JavaScript.

## Features

- Convert HTML files to Markdown .
- Option to generate processed HTML files after JavaScript execution using Puppeteer.
- Processes entire directories of HTML files.

<!-- ## Installation

1. Clone this repository or install it globally via npm:

   ```bash
   npm install -g html-markup-transformer
   ```

2. Make sure to have the dependencies installed:

   ```bash
   npm install
   ``` -->

## Usage

### Basic Command

Run the CLI with the required options:

```bash
htmd -i <inputDir> -o <outputDir>
```

### Options

- `-i, --input <inputDir>`: **Required.** Specify the input directory containing HTML files.
- `-o, --output <outputDir>`: **Required.** Specify the output directory for the converted Markdown files.
- `-h, --html`: Optional flag. If provided, the tool will generate processed HTML files after executing JavaScript.

### Example

Convert HTML files in the `./html-files` directory to Markdown, and save the output to the `./markdown-output` directory:

```bash
htmd -i ./html-files -o ./markdown-output
```

If you also want to generate processed HTML files:

```bash
htmd -i ./html-files -o ./markdown-output -h
```

### Output

- The converted Markdown files will be saved in the specified output directory.
- If the `-h` flag is used, the processed HTML files will be saved in an `html` subdirectory within the output directory.
