const express = require("express");
const elasticsearchService = require("../services/elasticsearch");

const router = express.Router();

const getSearchValues = (values) => {
  return values.map((param) => {
    const decode = decodeURI(param);
    return decode.trim();
  });
};

router.get("/oils", function (req, res) {
  elasticsearchService
    .searchAll()
    .then((results) => res.json(results.hits))
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
});

router.get("/oils/randomlist", function (req, res) {
  elasticsearchService
    .getRandomOils()
    .then((results) => res.json(results.hits))
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
});

router.get("/oils/results", function (req, res) {
  const { values, offset } = req.query;
  const termsOfSearch = getSearchValues(values);
  elasticsearchService
    .search(termsOfSearch, offset)
    .then((results) => {
      console.log(results);
      res.json(results.hits);
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
});

router.get("/oils/name", function (req, res) {
  elasticsearchService
    .searchByName(req.query.value)
    .then((results) => res.json(results.hits.hits))
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
});

router.get("/oils/suggestions", function (req, res) {
  elasticsearchService
    .getSuggestions(req.query.value)
    .then((results) => res.json(results.hits.hits))
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
});

module.exports = router;
