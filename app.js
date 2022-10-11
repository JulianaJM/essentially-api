require("dotenv").config();

const bodyParser = require("body-parser");
const express = require("express");
const elasticsearch = require("./src/datasource/connection");
const logger = require("morgan");
const initCluster = require("./src/resources/init-data");
const routes = require("./src/routes/index");

const app = express();

// ping the client to be sure Elasticsearch is up
elasticsearch.ping(
  {
    requestTimeout: 30000,
  },
  function (error) {
    // at this point, eastic search is down, please check your Elasticsearch service
    if (error) {
      console.error("elasticsearch cluster is down!");
    } else {
      console.log("elasticsearch cluster is ok");
      initCluster();
    }
  }
);

// Middleware Setup
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.get("/random", function(req, res) {
// });

// handle cache
app.set("etag", false);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  // handle cache
  res.set("Cache-Control", "no-store");

  next();
});

app.use("/api", routes);

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  console.log(err, res, req);
  // send the error
  res.status(err.status || 500);
  res.json({ message: err.message });
});

module.exports = app;
