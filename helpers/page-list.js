const Page = require("./Page");

const outletHome = new Page(
  "Coach Outlet - HP",
  "out-hp",
  "https://www.coachoutlet.com"
);
const outletPLPNew = new Page(
  "Coach Outlet - PLP - New",
  "out-plp-new",
  "https://www.coachoutlet.com/whats-new/whats-new/"
);

const pageList = [outletHome, outletPLPNew];

module.exports = pageList;
