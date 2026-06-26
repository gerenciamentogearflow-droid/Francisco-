import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';

export async function generatePDF(element: HTMLElement, filename: string): Promise<Blob> {
  // 1120px is roughly A4 height at standard 800px width scaling
  // We can just capture the whole element, but it might be taller.
  
  const dataUrl = await toPng(element, {
    pixelRatio: 2, // Higher scale for better resolution
    backgroundColor: '#ffffff',
    style: {
      transform: 'scale(1)',
      transformOrigin: 'top left'
    }
  });

  // A4 dimensions in mm: 210 x 297
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  
  const imgWidth = element.offsetWidth;
  const imgHeight = element.offsetHeight;
  
  // Calculate how many pages we need based on the image height and A4 ratio
  const ratio = imgWidth / pdfWidth;
  const totalImgHeightInMm = imgHeight / ratio;
  
  let heightLeft = totalImgHeightInMm;
  let position = 0;
  
  // Add first page
  pdf.addImage(dataUrl, 'PNG', 0, position, pdfWidth, totalImgHeightInMm);
  heightLeft -= pdfHeight;
  
  // Add subsequent pages if needed
  while (heightLeft > 0) {
    position = heightLeft - totalImgHeightInMm; // Shift image up
    pdf.addPage();
    pdf.addImage(dataUrl, 'PNG', 0, position, pdfWidth, totalImgHeightInMm);
    heightLeft -= pdfHeight;
  }
  
  return pdf.output('blob') as Blob;
}
