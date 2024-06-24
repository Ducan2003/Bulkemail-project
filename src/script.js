const express = require('express');
const fileUpload = require('express-fileupload');
const xlsx = require('xlsx');
const axios = require('axios');
const app = express();
const port = 3000;

app.use(fileUpload());

app.post('/upload', async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const file = req.files.file;
  const workbook = xlsx.read(file.data, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(worksheet);

  // Process each row in the Excel file
  for (const row of data) {
    const { FirstName, LastName } = row;
    const alias = `${FirstName}.${LastName}@platihub.com`.toLowerCase();

    try {
      await createZohoAlias(FirstName, LastName, alias);
    } catch (error) {
      console.error('Error creating alias for', alias, ':', error);
    }
  }

  res.send({ message: 'File uploaded and aliases created successfully' });
});

const createZohoAlias = async (firstName, lastName, alias) => {
const zohoApiUrl = 'https://www.zohoapis.com/your_api_endpoint'; // Endpoint ???
const apiKey = 'your_zoho_api_key'; // zoho api key >> cần generate key để đe

  const response = await axios.post(
    zohoApiUrl,
    {
      firstName,
      lastName,
      alias,
    },
    {
      headers: {
        Authorization: `Zoho-oauthtoken ${apiKey}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (response.status !== 200) {
    throw new Error(`Error creating alias: ${response.statusText}`);
  }

  return response.data;
};

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true, 
  }));