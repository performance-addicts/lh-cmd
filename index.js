const cmd = require("node-cmd");
const inquirer = require("inquirer");
const fs = require("fs");
const { promisify } = require("util");

const open = promisify(fs.open);
const read = promisify(fs.readFile);

async function askForURL() {
  try {
    const { url } = await inquirer.prompt([
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
    ]);

    return url;
  } catch (err) {
    console.log(err);
  }
}

async function printData(path) {
  let data = await read(path, "utf8");

  data = JSON.parse(data);

  const { audits } = data;

  const allowed = [
    "first-contentful-paint",
    "largest-contentful-paint",
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
  const FCP = audits["first-contentful-paint"];
  const LCP = audits["largest-contentful-paint"];

  return filtered;
}

function runLighthouse(url) {
  const path = "--output-path run.json";
  const command = `lighthouse ${url} --output json --output html ${path} --only-categories=performance --chrome-flags="--headless" `;
  console.log("working...");
  cmd.get(command, async (err, data, stderr) => {
    if (err) throw err;
    console.log("done");
    await open("run.report.html", "r");
  });
}
// askForURL().then((url) => runLighthouse(url));
printData("run.report.json").then((data) => console.log(data));
