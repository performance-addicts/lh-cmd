const date = require("date-and-time");

class Page {
  constructor(name, filename, url) {
    this.name = name;
    this.filename = filename;
    this.url = url;
    this.date = "";
    this.stats = {};
  }

  convertURL(url, swapOne, swapTwo) {
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

  createFilename() {
    let file = this.url.slice(8);
    file = file.endsWith("/") ? file.slice(0, -1) : file;
    this.filename = this.convertURL(file, "/", "_");
  }

  createTimestamp() {
    const now = date.format(new Date(), "MM-DD-YYYY-HH-mm-ss");
    this.filename = `${this.filename}-${now}`;
    this.date = now;
  }

  saveStats(obj) {
    this.stats = obj;
  }
}

module.exports = Page;
