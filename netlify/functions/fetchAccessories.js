// netlify/functions/fetchAccessories.js
exports.handler = async (event, context) => {
  try {
    const SHEET_ID = process.env.GOOGLE_SHEET_ID;
    const API_KEY = process.env.GOOGLE_API_KEY;
    
    if (!SHEET_ID || !API_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Missing environment variables' })
      };
    }
    
    const range = 'Accessoires!A2:D';
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;

    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Sheets API error:', errorText);
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: 'Failed to fetch accessories from Sheets' }) 
      };
    }

    const data = await response.json();
    const accessories = (data.values || []).map((row) => ({
      id: row[0] || '',
      nom: row[1] || '',
      prix: parseFloat(row[2]) || 0,
      description: row[3] || '',
    }));

    return { 
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(accessories) 
    };
  } catch (error) {
    console.error('Error fetching accessories:', error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: error.message }) 
    };
  }
};