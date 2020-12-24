# lh-cmd

#### Run Lighthouse (perf only) and Layout Shift tests on your favorite urls listed in Google Sheets and save them locally via CLI.

<br/>
<br/>

## Clone repo and npm install

---

<br/>

### Have Lighthouse & layout-shift-gif installed

---

<br/>

They are not listed dependencies in this project

install globally first

`npm install -g lighthouse`

`npm install -g layout-shift-gif`

<br/>

### Create .env file

---

<br/>

`GOOGLE_EMAIL=""` - Email associated with Sheets API

`GOOGLE_PRIVATE_KEY=""` - Private key associated with Sheets API

`SHEET_ID=""` - Sheet ID found in Sheet URL

<br/>

### Create worksheet named `url-list`

---

<br/>
Put 10 top urls in Column A starting at the first row
<br/>
<br/>

## Steps

---

<br/>

### npm start, Select url from list or enter your own url

<br/>
- If you enter your own url, enter a filename for your reports.

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
[filename].gif
```
