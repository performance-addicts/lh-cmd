const { GoogleSpreadsheet } = require("google-spreadsheet");
require("dotenv").config();

// "1SWsUGz-BjWUFC_K8HLcC1woCklyeuXQ5c9MBIoOOPss";
async function fetchSheet() {
  const doc = new GoogleSpreadsheet(process.env.SHEET_ID);

  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
  });

  await doc.loadInfo(); // loads document properties and worksheets
  console.log(doc.title);

  const sheet = doc.sheetsByTitle["url-list"]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]

  await sheet.loadCells("A1:A10");

  let cells = [];

  for (let i = 1; i < 11; i++) {
    const currentCell = sheet.getCellByA1(`A${i}`).value;

    if (currentCell) {
      cells.push(currentCell);
    }
  }

  return cells;
}

module.exports = { fetchSheet };
