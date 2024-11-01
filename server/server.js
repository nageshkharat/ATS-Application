const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const bodyParser = require('body-parser');
const path = require('path');
const atsScoring = require('./utils/atsScoring');

const app = express();
const port = 3000;

const upload = multer({ dest: 'uploads/' });

app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/api/resume', upload.single('resume'), async (req, res) => {
  try {
    const resumePath = path.join(__dirname, '../', req.file.path);
    const resumeData = await pdfParse(resumePath);

    const jobDescription = req.body.jobDescription || "";
    const role = req.body.role || "";

    const atsScore = atsScoring.calculateATSScore(resumeData.text, jobDescription);

    res.json({ score: atsScore, role });
  } catch (error) {
    console.error('Error processing the resume:', error);
    res.status(500).json({ message: 'Error processing the resume. Try again later.' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
