import express, { Response, Request, Router } from "express";
import elasticsearchService from "../services/elasticsearchService";

const router:Router = express.Router();

router.get("/oils", function (req: Request, res: Response) {
  elasticsearchService
    .searchAll()
    .then((results) => res.json(results.hits))
    .catch((err:Error) => {
      console.log(err);
      res.send(err);
    });
});

router.get("/oils/randomlist", function (req: Request, res: Response) {
  elasticsearchService
    .getRandomOils()
    .then((results) => res.json(results.hits))
    .catch((err:Error) => {
      console.log(err);
      res.send(err);
    });
});

router.get("/oils/results", function (req: Request, res: Response) {
  const { values, offset } = req.query;
  console.log("****************** ",req.query);
  const termsOfSearch = decodeURI(values);
  elasticsearchService
    .search(termsOfSearch, offset)
    .then((results) => {
      // console.log(results.hits.hits);
      res.json(results.hits);
    })
    .catch((err:Error) => {
      console.log(err);
      res.send(err);
    });
});

router.get("/oils/recipe/results", function (req: Request, res: Response) {
  const { values } = req.query;
  const termsOfSearch = decodeURI(values);
  elasticsearchService
    .searchRecipe(termsOfSearch)
    .then((results) => {
      // console.log(results.hits.hits);
      res.json(results.hits);
    })
    .catch((err:Error) => {
      console.log(err);
      res.send(err);
    });
});

router.get("/oils/name", function (req: Request, res: Response) {
  elasticsearchService
    .searchByName(req.query.value)
    .then((results) => res.json(results.hits.hits))
    .catch((err:Error) => {
      console.log(err);
      res.send(err);
    });
});

router.get("/oils/suggestions", function (req: Request, res: Response) {
  // console.log(req.query)
  elasticsearchService
    .getSuggestions(req.query.value)
    .then((results) => res.json(results.hits.hits))
    .catch((err:Error) => {
      console.log(err);
      res.send(err);
    });
});

export default router;
