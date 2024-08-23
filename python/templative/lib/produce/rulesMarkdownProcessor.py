from os import path
import re
from reportlab.lib.pagesizes import letter
from reportlab.lib import styles
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer

async def produceRulebook(rules, gameFolderPath):
    outputFilepath = path.join(gameFolderPath, "rules.pdf")
    convertMarkdownToPdf(rules, outputFilepath)

# def convertMarkdownPathToHtml(markdownPath, md_content=None, md_file_path=None, css_file_path=None, base_url=None):
#     raw_html = ''
#     extras = ['cuddled-lists', 'tables']
#     if md_file_path:
#         raw_html = markdown_path(md_file_path, extras=extras)
#     elif md_content:
#         raw_html = markdown(md_content, extras=extras)
#     else:
#         raise Exception("Missing markdown data.")

#     if not len(raw_html):
#         raise Exception('Input markdown seems empty.')
    
#     return raw_html

# def convertHtmlToPdf(html):
#     cssFilepath = path.join(path.dirname(path.realpath(__file__)), "pdfStyles.css")
#     from weasyprint import HTML, CSS
#     html = HTML(string=raw_html, base_url=base_url)

#     css = []
#     if css_file_path:
#         css.append(CSS(filename=css_file_path))

#     html.write_pdf(pdf_file_path, stylesheets=css)

def convertMarkdownToPdf(markdownString, outputPath):
    doc = SimpleDocTemplate(outputPath, pagesize=letter, 
        leftMargin=0.5*inch,
        rightMargin=0.5*inch,
        topMargin=0.5*inch,
        bottomMargin=0.5*inch)
    
    # Sample style sheet
    styles = getSampleStyleSheet()
    story = []

    # Split the markdown text into lines
    lines = markdownString.split('\n')

    for line in lines:
        # Skip blank lines
        if not line.strip():
            continue

        # Handle headings (H1 to H6)
        heading_match = re.match(r'^(#{1,6})\s+(.*)', line)
        if heading_match:
            heading_level = len(heading_match.group(1))
            heading_text = heading_match.group(2)
            style = styles[f'Heading{heading_level}']
            story.append(Paragraph(heading_text, style))
        
        # Handle bold and italics (supports **bold**, *italic*, and ***bold italic***)
        elif re.search(r'\*\*\*(.*?)\*\*\*', line):
            formatted_text = re.sub(r'\*\*\*(.*?)\*\*\*', r'<b><i>\1</i></b>', line)
            story.append(Paragraph(formatted_text, styles['Normal']))

        elif re.search(r'\*\*(.*?)\*\*', line):
            formatted_text = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', line)
            story.append(Paragraph(formatted_text, styles['Normal']))
        
        elif re.search(r'\*(.*?)\*', line):
            formatted_text = re.sub(r'\*(.*?)\*', r'<i>\1</i>', line)
            story.append(Paragraph(formatted_text, styles['Normal']))

        # Handle URLs (markdown format [text](url))
        elif re.search(r'\[(.*?)\]\((.*?)\)', line):
            formatted_text = re.sub(r'\[(.*?)\]\((.*?)\)', r'<a href="\2">\1</a>', line)
            story.append(Paragraph(formatted_text, styles['Normal']))

        # Regular paragraph text
        else:
            story.append(Paragraph(line, styles['Normal']))

        # Add a space after each line
        story.append(Spacer(1, 0.1 * inch))

    # Build the PDF document
    doc.build(story)