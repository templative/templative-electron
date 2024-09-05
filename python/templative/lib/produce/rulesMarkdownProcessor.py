from fpdf import FPDF
import re
from os import path

fontSizes = {
        1: 22,
        2: 20,
        3: 18,
        4: 16,
        5: 14,
        6: 12,
    }

elementSpacing = 2
lineSpacing = 5
preHeaderSpacing = 7
postHeaderSpacing = 4

class PDF(FPDF):
    def header(self):
        pass  

    def footer(self):
        pass  

def markdown_to_pdf(markdown_text, output_pdf):
    pdf = PDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()
    pdf.set_margins(left=10, top=10, right=10)
    pdf.set_font("Arial", size=12)
    
    lines = markdown_text.split('\n')
    
    for line in lines:
        if not line.strip():
            continue

        heading_match = re.match(r'^(#{1,6})\s+(.*)', line)
        if heading_match:
            heading_level = len(heading_match.group(1))
            heading_text = heading_match.group(2)
            font_size = fontSizes.get(heading_level, 12)
            pdf.set_font("Arial", size=font_size, style='B')
            pdf.set_text_color(50,50,50)
            pdf.ln(preHeaderSpacing)
            pdf.multi_cell(0, lineSpacing, heading_text)
            pdf.ln(postHeaderSpacing)
            pdf.set_text_color(25,25,25)
            pdf.set_font("Arial", size=12)  
            continue
    
        process_markdown_text(pdf, line)
        pdf.ln(elementSpacing)
    
    pdf.output(output_pdf)

def process_markdown_text(pdf, text):
    while text:
        bold_match = re.search(r'\*\*(.*?)\*\*', text)
        italic_match = re.search(r'\*(.*?)\*', text)
        
        next_tag = None
        next_pos = len(text)
        
        if bold_match and bold_match.start() < next_pos:
            next_tag = bold_match
            next_pos = bold_match.start()
        
        if italic_match and italic_match.start() < next_pos:
            next_tag = italic_match
            next_pos = italic_match.start()
        
        if next_pos > 0:
            pdf.multi_cell(0, lineSpacing, text[:next_pos])
            text = text[next_pos:]
        else:
            text = text[next_pos:]
    
        if next_tag:
            tag_text = next_tag.group(1)
            if next_tag == bold_match:
                pdf.set_font("Arial", style='B', size=12)
            elif next_tag == italic_match:
                pdf.set_font("Arial", style='I', size=12)
            
            pdf.multi_cell(0, lineSpacing, tag_text)
            pdf.set_font("Arial", style='', size=12)
            text = text[next_tag.end():]
        else:
            break 

async def produceRulebook(rules, gameFolderPath):
    outputFilepath = path.join(gameFolderPath, "rules.pdf")
    markdown_to_pdf(rules, outputFilepath)
