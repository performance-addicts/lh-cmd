# lh-cmd

## Clone repo and npm install

### Steps

1. npm start

2. Select url from list or enter your own url

![URL Select](./images/url-select.png "URL Select")

- If you enter your own url, enter a filename for your reports.

When finished, key Lighthouse metrics will be printed on the command line.
The Lighthouse report will automatically open in your default browser.

![Finished](./images/finished.png "Finished")

2 files will be saved based on the filename you provided or present in the page list.

```
[filename].report.json
[filename].report.html
```

![Files](./images/files.png "Files")

These will be overwritten on subsequent runs, so if you need to back up past reports rename them before running again.
