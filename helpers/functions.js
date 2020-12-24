const fs = require("fs");
const cmd = require("node-cmd");
const { promisify } = require("util");
const read = promisify(fs.readFile);

async function gatherMetrics(path) {
  let data = await read(path, "utf8");

  data = JSON.parse(data);

  const { audits, categories } = data;

  const allowed = [
    "first-meaningful-paint",
    "first-contentful-paint",
    "largest-contentful-paint",
    "speed-index",
    "total-blocking-time",
    "cumulative-layout-shift",
    "interactive",
  ];

  const filtered = Object.keys(audits)
    .filter((key) => allowed.includes(key))
    .reduce((obj, key) => {
      return {
        ...obj,

        [key]: audits[key],
      };
    }, {});

  const metrics = {
    ...filtered,
    score: {
      displayValue: categories.performance.score * 100,
    },
  };
  return metrics;
}

function convertURL(url, swapOne, swapTwo) {
  url = url.split("");

  return url
    .map((char) => {
      if (char === swapOne) {
        char = swapTwo;
      }

      return char;
    })
    .join("");
}

function runCMD(command) {
  return new Promise((resolve, reject) => {
    cmd.get(command, (err, data, stderr) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
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

module.exports = { gatherMetrics, convertURL, runCMD, runLighthouse, runCLS };
