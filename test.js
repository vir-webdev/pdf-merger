const PDFMerger = require('pdf-merger-js')
var merger = new PDFMerger();

(async (p1,p2) => {
  await merger.add('virat_gamit_cv.pdf');  //merge all pages. parameter is the path to file and filename.
  await merger.add('fees.pdf',2); // merge only page 2

  await merger.save('merged.pdf'); //save under given name and reset the internal document
  
  // Export the merged PDF as a nodejs Buffer
  // const mergedPdfBuffer = await merger.saveAsBuffer();
  // fs.writeSync('merged.pdf', mergedPdfBuffer);
})();



