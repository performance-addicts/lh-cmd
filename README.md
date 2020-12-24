# lh-cmd

## Clone repo and npm install

## Have Lighthouse & layout-shift-gif installed

They are not listed dependencies in this project

install globally first

`npm install -g lighthouse`
`npm install -g layout-shift-gif`

## Steps

### npm start

### Select url from list or enter your own url

![URL Select](./images/url-select.png "URL Select")

- If you enter your own url, enter a filename for your reports.

When finished, key Lighthouse metrics will be printed on the command line.
The Lighthouse report will automatically open in your default browser.

![Finished](./images/finished.png "Finished")

2 files will be saved based on the filename you provided or present in the page list.

```
[filename]-MM-DD-YYYY-HH-mm-ss.report.json
[filename]-MM-DD-YYYY-HH-mm-ss.report.html
```

---

### Choose whether to run layout-shift-gif

If yes, CLS gif generator will run and save 2 files.

```
temp-screenshot.png
[filename].gif
```
