const express = require("express");
const elasticsearchService = require("../services/elasticsearch");

const router = express.Router();

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
  const termsOfSearch = decodeURI(values);
  elasticsearchService
    .search(termsOfSearch, offset)
    .then((results) => {
      // console.log(results.hits.hits);
      res.json(results.hits);
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
});


router.get("/oils/recipe/results", function (req, res) {
  const { values } = req.query;
  const termsOfSearch = decodeURI(values);
  elasticsearchService
    .searchRecipe(termsOfSearch)
    .then((results) => {
      // console.log(results.hits.hits);
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
  // console.log(req.query)
  elasticsearchService
    .getSuggestions(req.query.value)
    .then((results) => res.json(results.hits.hits))
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
});

module.exports = router;
