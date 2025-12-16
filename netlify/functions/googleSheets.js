import fetch from "node-fetch"; // si besoin, sinon fetch est global sur Netlify Functions

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const API_KEY = process.env.GOOGLE_API_KEY;

export async function handler(event, context) {
  if (!SHEET_ID || !API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Google Sheets credentials not set" }),
    };
  }

  try {
    const range = "Rooms!A2:E";
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;

    const response = await fetch(url);
    if (!response.ok) {
      const text = await response.text();
      return { statusCode: 500, body: text };
    }

    const data = await response.json();
    const rooms = data.values.map((row) => ({
      id: row[0] || "",
      nom: row[1] || "",
      type: row[2] || "",
      prixBase: parseFloat(row[3]) || 0,
      capaciteMax: parseInt(row[4]) || 1,
    }));

    return { statusCode: 200, body: JSON.stringify(rooms) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
}
