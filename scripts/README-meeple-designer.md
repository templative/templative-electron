# Meeple Designer

A Node.js script that takes an SVG outline of a meeple (a small figure/token used in board games), fills it with a graphic representing a given prompt, and color swaps the clothing while preserving skin tones.

## Features

- Generate custom meeple designs based on text prompts (e.g., "Medic", "Wizard", "Farmer")
- Apply custom colors to the meeple's clothing
- Preserve skin tones during color swapping
- Uses Anthropic's Claude API for generating designs (optional)

## Requirements

- Node.js 14+
- Anthropic API key (optional, for AI-generated designs)

## Installation

The script is already included in the Templative project. Make sure you have all dependencies installed:

```bash
npm install
```

## Usage

### Basic Usage

```bash
npm run design-meeple -- --prompt "Medic" --color "#FF0000"
```

Or directly:

```bash
node ./scripts/meepleDesigner.js --prompt "Medic" --color "#FF0000"
```

### All Options

```bash
node ./scripts/meepleDesigner.js [options]
```

Options:
- `-p, --prompt <prompt>`: Prompt describing the meeple design (e.g., "Medic") (required)
- `-o, --output <output>`: Output SVG file path (default: "./output-meeple.svg")
- `-c, --color <color>`: Main color for the meeple clothing (hex code) (default: "#3366CC")
- `-i, --input <input>`: Input meeple SVG file path (default: "./meeple.svg")
- `-s, --skin-tone <skinTone>`: Skin tone to preserve (hex code) (default: "#874a22")
- `-t, --temp-dir <tempDir>`: Temporary directory for intermediate files (default: "./temp")

### Using Anthropic API for AI-Generated Designs

To use Anthropic's Claude API for generating designs, set the `ANTHROPIC_API_KEY` environment variable:

```bash
export ANTHROPIC_API_KEY=your_api_key_here
npm run design-meeple -- --prompt "Medic"
```

If the API key is not set, the script will fall back to generating a simple placeholder image with text.

## Examples

### Create a Medic Meeple with Red Clothing

```bash
npm run design-meeple -- --prompt "Medic" --color "#FF0000" --output "./medic-meeple.svg"
```

### Create a Wizard Meeple with Purple Clothing

```bash
npm run design-meeple -- --prompt "Wizard" --color "#8A2BE2" --output "./wizard-meeple.svg"
```

### Use a Custom Meeple SVG

```bash
npm run design-meeple -- --prompt "Knight" --input "./custom-meeple.svg" --output "./knight-meeple.svg"
```

## How It Works

1. The script takes an SVG outline of a meeple
2. It generates a design based on the provided prompt using Anthropic's Claude API (if available)
3. It applies the design to the meeple SVG
4. It performs color swapping on the clothing while preserving skin tones
5. It outputs the final SVG file

## Troubleshooting

- If you encounter an error about missing dependencies, run `npm install`
- If the script fails to generate a design with Anthropic's API, check your API key and internet connection
- If the output SVG looks incorrect, try adjusting the color or using a different prompt

## License

This script is part of the Templative project and is subject to the same license. 