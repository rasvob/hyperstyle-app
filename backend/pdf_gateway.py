from reportlab.lib.boxstuff import aspectRatioFix
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch, cm, mm
from reportlab.lib.pagesizes import A4

if __name__ == '__main__':
    c = canvas.Canvas('canvas.pdf', pagesize=A4)
    c.translate(cm, cm)
    width, height = A4
    print(height)
    c.drawImage('pdf_header.jpg', 0.5*cm, height-50)
    
    c.save()