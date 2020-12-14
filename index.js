const fs = require("fs");
const { promisify } = require("util");
const inquirer = require("inquirer");
const date = require("date-and-time");
const open = require("open");
require("dotenv").config();
const { gatherMetrics, runCMD, convertURL } = require("./helpers/functions");
const { inputPrompt } = require("./helpers/prompts");
const Page = require("./helpers/Page");
const { fetchSheet } = require("./sheets");
const pageList = require("./helpers/page-list");

const read = promisify(fs.readFile);
// const urlList = [...pageList.map(({ url }) => url), "Or enter URL"];

let currentFile = "";

/**
 * @param {array} url list
 */

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
      const { url, filename } = await inquirer.prompt(inputPrompt);

      const page = new Page("Entered URL", filename, url);

      if (!page.filename) {
        page.createFilename();
      }

      return page;
    }

    return arr.find((page) => page.url === url);
  } catch (err) {
    console.log(err);
  }
}

/**
 * @param {object} page object
 * @param {string} page.url - url for the page
 * @param {string} page.filename - filename for lh report
 */

async function runLighthouse(page) {
  page.createTimestamp();
  const { url, filename } = page;
  currentFile = `${filename}.report`;
  const path = `--output-path ${filename}.json`;
  const command = `lighthouse ${url} --output json --output html ${path} --only-categories=performance --chrome-flags="--headless --disable-dev-shm-usage" `;
  console.log("working...");
  // run lh cmd
  await runCMD(command);
  console.log("done");

  const metrics = await gatherMetrics(`${currentFile}.json`);

  const table = Object.entries(metrics).map(([key, value]) => {
    return [key, value.displayValue];
  });
  // print table
  console.table(table);
  // attach stats to page object
  page.saveStats(Object.fromEntries(table));
  console.log(obj);
  // TODO: print to sheets.
  await open(`${currentFile}.html`);
}

(async () => {
  const urls = await fetchSheet();

  let pages = urls.map((url) => {
    const page = new Page("temp", "temp", url);
    page.createFilename();
    return page;
  });

  const input = await askForURL(pages);
  await runLighthouse(input);
})();
