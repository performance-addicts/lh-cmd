const fs = require("fs");
const { promisify } = require("util");
const read = promisify(fs.readFile);

async function gatherMetrics(path) {
  let data = await read(path, "utf8");

  data = JSON.parse(data);

  const { audits } = data;

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

  return filtered;
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

module.exports = { gatherMetrics, convertURL };
