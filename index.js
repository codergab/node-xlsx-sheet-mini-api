const express = require('express')
const { GoogleSpreadsheet } = require('google-spreadsheet')
const helment = require('helmet')
require('dotenv-safe').config()

const app = express()
app.use(express.json())

app.use(helment())

const creds = require('./app-creds.json');

const authenticateSheet = async () => {
  const doc = new GoogleSpreadsheet(process.env.SHEET_ID);

  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo();

  const sheet = doc.sheetsByIndex[0];
  return sheet;
};

app.post('/log-to-sheet', async (req, res) => {
  const { fullName, email } = req.body

  const sheet = await authenticateSheet();
  await sheet.addRow({
    FullName: fullName,
    EmailAddress: email,
  });
  res.status(200).json({ message: "Message Logged Successfully" });
})

app.listen(process.env.PORT, () => {
  console.info('APP RUNNING')
})
