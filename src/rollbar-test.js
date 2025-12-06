var Rollbar = require("rollbar");

var rollbar = new Rollbar({
  accessToken: "ee5a9898180c4336b619234f9f891f89", // ten z kreatora
  captureUncaught: true,
  captureUnhandledRejections: true,
});

rollbar.log("Hello world!");
