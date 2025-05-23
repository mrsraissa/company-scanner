require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fetch = require('node-fetch'); // make sure to install node-fetch
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/submit', async (req, res) => {
  const secret = process.env.SECRET_KEY;
  if (req.body.key !== secret) {
    return res.status(401).json({ status: 'unauthorized' });
  }

  // Prepare data to forward
  const formData = new URLSearchParams();
  formData.append('employee', req.body.employee);
  formData.append('chemical', req.body.chemical);
  formData.append('barcode', req.body.barcode);
  formData.append('quantity', req.body.quantity);

  try {
    // Forward data to Google Apps Script URL
    const response = await fetch('https://script.google.com/macros/s/AKfycbw4Qk4repTdtByqX356QGIX5cRDhDznjRrFOBRFByp3S8dGk1JJd8ZWs96Yt6uW_uO3/exec', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString()
    });

    if (response.ok) {
      res.json({ status: 'success' });
    } else {
      res.status(500).json({ status: 'Google Apps Script error' });
    }
  } catch (error) {
    res.status(500).json({ status: 'server error', error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
