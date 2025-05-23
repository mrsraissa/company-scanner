require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/submit', (req, res) => {
  const secret = process.env.SECRET_KEY;

  if (req.body.key !== secret) {
    return res.status(401).json({ status: 'unauthorized' });
  }

  // Handle your Google Sheets logic here (e.g. using `googleapis` or webhook to Apps Script)

  res.json({ status: 'success' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

