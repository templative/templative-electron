from setuptools import setup, find_packages

setup(
    name = "templative",
    version = "1.0.0",
    author = "Go Next Games",
    author_email = "oliver@gonextgames.com",
    description = "Create board games based on art templates, json, and csvs.",
    url = "",
    install_requires=[
        "asyncclick",
        "anyio",
        "aiofile",
        "aiohttp",
        "tabulate",
        "aiohttp-cors",
        "pillow",
        "fpdf",
        "svgmanip",
        "python-socketio",
        "numpy",
        "pyinstaller",
        "requests",
        "aiofiles",
    ],
    entry_points = {
        "console_scripts": [
            "templative=templative:cli"
        ]
    },
    packages=find_packages(),
    package_data={"": [
        "create/componentTemplates/*.svg", 
        "create/template/**/*.svg", 
        "create/template/**/*.json", 
        "create/template/**/*.png", 
        "create/template/**/*.md", 
        "create/template/.gitignore", 
        "create/template/output/.last", 
        "produce/*.css"
    ]},
    include_package_data=True,
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: GNU General Public License v3 (GPLv3)",
        "Operating System :: OS Independent",
    ],
    python_requires="==3.11.9",
)