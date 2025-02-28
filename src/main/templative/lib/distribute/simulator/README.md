# Simulator Module Structure

This directory contains the code for converting game components to Tabletop Simulator format.

## Directory Structure

- `simulator.js` - Main entry point and orchestration
- `config/` - Configuration and constants
- `imageProcessing/` - Image manipulation and upload functionality
- `objectCreation/` - Functions for creating different types of game objects
- `utils/` - Helper functions and utilities
- `simulatorTemplates/` - Templates for TTS JSON structures
- `structs.js` - Data structures used across the simulator

## Module Responsibilities

- **Main (simulator.js)**: Entry point, handles high-level flow and file operations
- **Image Processing**: Handles image manipulation, composition, and uploading
- **Object Creation**: Creates different types of game objects (cards, decks, dice, etc.)
- **Utils**: Common utilities like file operations, shape calculations, etc.
- **Templates**: JSON templates for TTS save files and objects 