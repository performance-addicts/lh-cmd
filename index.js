const fs = require("fs");
const { promisify } = require("util");
const inquirer = require("inquirer");
const open = require("open");
require("dotenv").config();
const Page = require("./helpers/Page");
const { gatherMetrics, runCMD } = require("./helpers/functions");
const { inputPrompt, clsPrompt } = require("./helpers/prompts");
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

async function askForCLS(page) {
  const { cls } = await inquirer.prompt(clsPrompt);
  if (cls) {
    page.cls = true;
  }

  return;
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
  const command = `lighthouse ${url} --output json --output html ${path} --only-categories=performance --chrome-flags="--headless --disable-dev-shm-usage" --view`;
  console.log(`
  
  ==============================
  LIGHTHOUSE STARTED
  ==============================

  `);

  // TODO: add why perf matters here

  // run lh cmd
  await runCMD(command);

  console.log(`
  
  ==============================
  LIGHTHOUSE FINISHED
  ==============================
  
  `);

  const metrics = await gatherMetrics(`${currentFile}.json`);

  const table = Object.entries(metrics).map(([key, value]) => {
    return [key, value.displayValue];
  });
  // print table
  console.table(table);
  // attach stats to page object
  page.saveStats(Object.fromEntries(table));
  console.log(page);
  // TODO: print to sheets.
}

async function runCLS(page) {
  const { url, filename } = page;
  const command = `layout-shift-gif --url ${url} --device mobile --output ${filename}.gif`;
  console.log(`
  
  ==============================
  CLS STARTED
  ==============================

  `);

  // TODO: add layout shift info here

  await runCMD(command);

  console.log(`
  
  ==============================
  CLS FINISHED
  ==============================

  `);
}

(async () => {
  const urls = await fetchSheet();

  let pages = urls.map((url) => {
    const page = new Page("temp", "temp", url);
    page.createFilename();
    return page;
  });

  const input = await askForURL(pages);
  await askForCLS(input);
  await runLighthouse(input);
  if (input.cls) {
    await runCLS(input);
    await open(`${input.filename}.gif`);
  }
})();
