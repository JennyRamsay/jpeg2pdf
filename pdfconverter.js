const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs');

async function createPdf(imagePath) {
  const pdfDoc = await PDFDocument.create();
  const imageBytes = fs.readFileSync(imagePath);
  const image = await pdfDoc.embedJpg(imageBytes);
  const page = pdfDoc.addPage([image.width, image.height]);
  page.drawImage(image, {
    x: 0,
    y: 0,
    width: image.width,
    height: image.height,
  });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(imagePath.replace('.jpg', '.pdf'), pdfBytes);
}

module.exports = {
  createPdf,
};
