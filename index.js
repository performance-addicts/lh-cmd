const cmd = require("node-cmd");
const inquirer = require("inquirer");
const open = require("open");
const fs = require("fs");
const { promisify } = require("util");
const { gatherMetrics } = require("./helpers/functions");
const pageList = require("./helpers/page-list");

const read = promisify(fs.readFile);
const urlList = pageList.map(({ url }) => url);
let currentFile = "";

async function askForURL() {
  try {
    const { url } = await inquirer.prompt([
      {
        name: "url",
        type: "list",
        message: "Select a url",
        choices: urlList,
      },
    ]);

    return pageList.find((page) => page.url === url);
  } catch (err) {
    console.log(err);
  }
}

function runLighthouse(obj) {
  const { url, filename } = obj;
  currentFile = `${filename}.report`;
  const path = `--output-path ${filename}.json`;
  const command = `lighthouse ${url} --output json --output html ${path} --only-categories=performance --chrome-flags="--headless" `;
  console.log("working...");
  cmd.get(command, async (err, data, stderr) => {
    if (err) throw err;
    console.log(data);
    console.log("done");
    gatherMetrics(`${currentFile}.json`).then(async (data) => {
      const table = Object.entries(data).map(([key, value]) => {
        const newMetric = {
          [key]: value.displayValue,
        };

        return newMetric;
      });

      console.log(table);
      await open(`${currentFile}.html`);
    });
  });
}

askForURL().then((data) => {
  runLighthouse(data);
});
