# Externals vs. ASAR Unpacking in Electron Apps

These are two different but related concepts in Electron application packaging:

## Webpack Externals

Externals in webpack configuration tell webpack which modules should not be bundled:

- **Purpose**: Modules listed as externals are expected to be available in the runtime environment and are not included in the webpack bundle.
- **When to use externals**:
  - For Node.js built-in modules (like fs, path, crypto)
  - For Electron's own modules (like electron)
  - For modules that should be loaded from node_modules at runtime
  - When you want to reduce bundle size for modules that are available in the target environment
- **Consequences**: Modules listed as externals will generate a require() call in your bundle instead of including the module code.

## ASAR Unpacking

ASAR unpacking is specific to Electron's packaging system:

- **Purpose**: ASAR is an archive format used by Electron to package your app's source code. Some modules (especially native modules) cannot run directly from inside an ASAR archive and need to be unpacked.
- **When to unpack from ASAR**:
  - Native modules with binary (.node) components
  - Modules that need direct filesystem access to their own files
  - Modules that use dynamic requires or read their own source code
  - Modules that need to be executable (like binary files)
- **Examples**: Common modules needing unpacking include sharp, pdfkit, native image processing libraries, and anything with C/C++ bindings.

## Decision Guidelines

**Make it an external if**:
- It's a Node.js or Electron built-in module
- It's a large module that doesn't need to be bundled
- You want to load it from node_modules at runtime

**Unpack from ASAR if**:
- It's a native module with .node files
- It dynamically loads its own files
- It needs direct filesystem access to its own directory
- It's bundled (not external) but still needs special filesystem access

**Both (external AND unpacked) if**:
- It's a native module that you want to load from node_modules (not bundle) but still needs to be unpacked

In your specific case with pdfkit, it should be bundled (not external) and also unpacked from ASAR because it has dependencies that need direct filesystem access.

The error you encountered happened because pdfkit was marked as external (so webpack didn't include it) but the runtime couldn't find it properly in the ASAR archive.