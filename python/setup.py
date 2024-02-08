from setuptools import setup, find_packages

setup(
    name = "templative",
    version = "0.3.10",
    author = "Oliver Barnum",
    author_email = "obarnum@nextday.games",
    description = "Create board games based on art templates, json, and csvs.",
    url = "",
    install_requires=[
        "aiofile",
        "aiohttp",
        "asyncclick",
        "fpdf2",
        "markdown2",
        "Pillow",
        "svgmanip",
        "svgutils",
        "tabulate",
        "Wand"
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
    python_requires=">=3.7",
)