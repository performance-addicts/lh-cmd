const fs = require("fs");
const cmd = require("node-cmd");
const { promisify } = require("util");
const read = promisify(fs.readFile);

async function gatherMetrics(path) {
  let data = await read(path, "utf8");

  data = JSON.parse(data);

  const { audits, categories } = data;
  console.log(categories);

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

module.exports = { gatherMetrics, convertURL, runCMD };
