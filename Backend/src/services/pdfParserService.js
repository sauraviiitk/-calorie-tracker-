// pdfParserService.js
const pdf = require('pdf-parse');
const fs = require('fs');

exports.parsePdf = async (filePath) => {
  let dataBuffer = fs.readFileSync(filePath);
  return pdf(dataBuffer);
};
