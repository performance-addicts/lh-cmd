const inquirer = require("inquirer");
const date = require("date-and-time");
const open = require("open");
require("dotenv").config();
const fs = require("fs");
const { promisify } = require("util");
const { gatherMetrics, runCMD, convertURL } = require("./helpers/functions");
const Page = require("./helpers/Page");
const { fetchSheet } = require("./sheets");
const pageList = require("./helpers/page-list");

const read = promisify(fs.readFile);
const urlList = [...pageList.map(({ url }) => url), "Or enter URL"];

let currentFile = "";

async function askForURL(arr) {
  try {
    const { url } = await inquirer.prompt([
      {
        name: "url",
        type: "list",
        message: "Select a url",
        choices: [...arr.map(({ url }) => url), "Or enter URL"],
      },
    ]);

    if (url === "Or enter URL") {
      const { url, filename } = await inquirer.prompt([
        {
          name: "url",
          type: "input",
          message: "Enter a url",
          validate: (value) => {
            return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
              value
            );
          },
        },
        {
          name: "filename",
          type: "input",
          message:
            "Enter a filename (all lowercase with dashes) ex: outlet-pdp",
        },
      ]);

      return new Page("Entered URL", filename, url);
    }

    return arr.find((page) => page.url === url);
  } catch (err) {
    console.log(err);
  }
}

async function runLighthouse(obj) {
  const now = date.format(new Date(), "MM-DD-YYYY-HH-mm-ss");
  const { url, filename } = obj;
  currentFile = `${filename}-${now}.report`;
  const path = `--output-path ${filename}-${now}.json`;
  const command = `lighthouse ${url} --output json --output html ${path} --only-categories=performance --chrome-flags="--headless" `;
  console.log("working...");
  // run lh cmd
  await runCMD(command);
  console.log("done");

  const metrics = await gatherMetrics(`${currentFile}.json`);

  const table = Object.entries(metrics).map(([key, value]) => {
    return [key, value.displayValue];
  });
  console.table(table);
  await open(`${currentFile}.html`);
}

(async () => {
  const urls = await fetchSheet();

  let pages = urls.map((url) => {
    const page = new Page("temp", "temp", url);
    page.createFilename();
    console.log(page);
    return page;
  });

  const input = await askForURL(pages);
  await runLighthouse(input);
})();
