const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'template')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/template/index.html'));
});

app.post('/Merged', upload.array('pdfs', 2), async (req, res, next) => {
  try {
    const PDFMerger = (await import('pdf-merger-js')).default;
    const merger = new PDFMerger();

    const files = req.files;

    if (files.length < 2) {
      return res.status(400).send('Please upload exactly 2 PDF files.');
    }

    console.log('Files uploaded:', files);

    // Add the uploaded files to the merger
    await merger.add(files[0].path);
    await merger.add(files[1].path);

    const mergedPdfPath = path.join(__dirname, 'merged.pdf');
    await merger.save(mergedPdfPath);
    app.use(express.static(path.join(__dirname, 'public')));

    // Send the merged PDF file back to the client
    res.download(mergedPdfPath, (err) => {
      if (err) {
        console.error('Error sending the file:', err);
        next(err);
      } else {
        console.log('File sent successfully');

        // Clean up the uploaded files
        files.forEach(file => fs.unlinkSync(file.path));

        // Clean up the merged PDF file
        fs.unlinkSync(mergedPdfPath);
      }
    });
  } catch (error) {
    console.error('Error merging PDFs:', error);
    res.status(500).send('An error occurred while merging PDFs: ' + error.message);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
