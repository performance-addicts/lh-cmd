const { GoogleSpreadsheet } = require("google-spreadsheet");
require("dotenv").config();

async function fetchSheet() {
  const doc = new GoogleSpreadsheet(
    "1SWsUGz-BjWUFC_K8HLcC1woCklyeuXQ5c9MBIoOOPss"
  );

  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
  });

  await doc.loadInfo(); // loads document properties and worksheets
  console.log(doc.title);

  const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]

  await sheet.loadCells("A1:A10");
  console.log(sheet.cellStats);

  let cells = [];

  for (let i = 1; i < 11; i++) {
    const currentCell = sheet.getCellByA1(`A${i}`).value;

    if (!currentCell) break;
    cells.push(currentCell);
  }

  return cells;
}

module.exports = { fetchSheet };
