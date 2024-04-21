# Modify the Spec File to Include Libraries

In the spec file, you will see sections like a = Analysis(...). Ensure that all hidden imports are included here. If PyInstaller is missing some libraries, you can add them manually as hidden imports:

python
```
    a = Analysis(['your_script.py'],
        pathex=['path_to_additional_folders'],
        binaries=[],
        datas=[],
        hiddenimports=['library_module_1', 'library_module_2'],
        hookspath=[],
        runtime_hooks=[],
        excludes=[],
        win_no_prefer_redirects=False,
        win_private_assemblies=False,
        cipher=block_cipher,
        noarchive=False)
```
In the hiddenimports list, add the names of any modules that PyInstaller does not detect automatically.

# Include Data Files
If your application uses external data files (like images or configuration files), include these in the datas parameter. The format is a list of tuples (source, destination):

```
    datas=[('path/to/local/configfile.cfg', 'relative/path/in/executable')]
```

# Build the Application
Run PyInstaller with the spec file:

bash
Copy code
pyinstaller your_script.spec
This command creates a standalone executable in the dist directory.

# Datas

Using the command line to configure the `datas` field with PyInstaller involves specifying each data file or directory you want to include in your bundled application. The `datas` field is used to include non-code files, such as images, configuration files, or any other necessary resources.

Here's how you can set up the `datas` field directly through the command line without manually editing the spec file:

### Step-by-Step Command Line Usage

#### 1. Basic Syntax

The basic syntax for the `datas` parameter involves key-value pairs each representing the source file or directory and the destination directory inside the executable:

```bash
pyinstaller --add-data "<source_path>:<dest_path>" your_script.py
```

- `<source_path>`: The path to the file or directory on your machine.
- `<dest_path>`: The path inside your final executable where the file will be placed.

#### 2. Example Usage

**Single File:**

If you want to include a configuration file, you would run:

```bash
pyinstaller --add-data "C:/path/to/config.cfg:." your_script.py
```

This command tells PyInstaller to take `config.cfg` from the specified path and place it in the root directory (`.`) of the bundled application.

**Multiple Files:**

To include multiple files, repeat the `--add-data` option:

```bash
pyinstaller --add-data "C:/path/to/config.cfg:." --add-data "C:/path/to/images/*.jpg:images/" your_script.py
```

This command includes all JPEG images from the specified folder into an `images/` directory inside the bundled application.

**Directory:**

To include an entire directory, specify it in the `--add-data` option:

```bash
pyinstaller --add-data "C:/path/to/data_folder:data_folder" your_script.py
```

This includes everything inside `data_folder` on your machine into `data_folder` in the executable's root.

#### 3. Platform-Specific Path Separator

- **Windows** uses a semicolon `;` as the path separator in `--add-data`.
- **Linux/Mac** uses a colon `:` as shown in the examples.

Make sure to use the correct separator for your operating system:

```bash
# For Windows
pyinstaller --add-data "C:\path\to\config.cfg;." your_script.py

# For Linux/Mac
pyinstaller --add-data "/path/to/config.cfg:." your_script.py
```

#### 4. Wildcards for Multiple Files

You can use wildcards to specify multiple files under a certain pattern:

```bash
pyinstaller --add-data "C:/path/to/documents/*.pdf:docs/" your_script.py
```

This will include all PDF files from the specified directory into a `docs/` directory inside your bundled application.

#### 5. Combining with Other Options

Combine `--add-data` with other useful PyInstaller options, such as `--onefile` for a single executable or `--noconsole` for GUI applications:

```bash
pyinstaller --onefile --noconsole --add-data "C:/path/to/config.cfg:." your_script.py
```

### Conclusion

Using `--add-data` effectively allows you to ensure that all necessary resources are included with your PyInstaller-bundled application. Always verify the paths and check the bundled application to make sure all resources are correctly placed and accessible at runtime. Adjust the paths and rebuild as necessary.