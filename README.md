# lh-cmd

## Run Lighthouse (perf only) and Layout Shift tests on your favorite urls listed in Google Sheets and save them locally via CLI.

<br/>

### Installation

---

<br/>

Install Lighthouse and layout-shift-gif globally

`npm install -g lighthouse`

`npm install -g layout-shift-gif`

`npm install` this project's dependencies

<br/>

### Setup

---

<br/>

`GOOGLE_EMAIL=""` - Email associated with Sheets API

`GOOGLE_PRIVATE_KEY=""` - Private key associated with Sheets API

`SHEET_ID=""` - Sheet ID found in Sheet URL

`SHEET_NAME=""` - Name of worksheet containing list of URLs (Put 10 top urls in Column A starting at the first row)

<br/>

### Usage

---

<br/>

`npm start` and select url from list or enter your own url.

<br/>

Optional: If you enter your own url, enter a filename for your reports.

<br/>

When finished, key Lighthouse metrics will be printed on the command line.
The Lighthouse report will automatically open in your default browser.

2 files will be saved based on the filename you provided or present in the page list.

```
[filename]-MM-DD-YYYY-HH-mm-ss.report.json
[filename]-MM-DD-YYYY-HH-mm-ss.report.html
```

<br/>

### Choose whether to run layout-shift-gif

---

<br/>
If yes, CLS gif generator will run and save 2 files.

```
temp-screenshot.png
[filename]-MM-DD-YYYY-HH-mm-ss.gif
```
