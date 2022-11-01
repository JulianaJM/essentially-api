'use strict';
import bodyParser from 'body-parser';
import express, { Application, NextFunction, Request, Response } from 'express';
import elasticsearch from './datasource/connection';
import initCluster from './resources/init-data';
import routes from './routes/router';

const logger = require('morgan');

interface ErrorWithStatus extends Error {
  status: number;
}

const app: Application = express();

// ping the client to be sure Elasticsearch is up
elasticsearch.ping({}, { requestTimeout: 30000 }).then(() => {
    console.log('elasticsearch cluster is ok');
    initCluster();
}).catch(() => {
    console.error('elasticsearch cluster is down!');
})

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.get("/random", function(req, res) {
// });
// handle cache
app.set('etag', false);
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.header('Content-Type', 'application/json');

  // handle cache
  res.set('Cache-Control', 'no-store');
  next();
});
app.use('/api', routes);
// error handler
app.use(function (
  err: ErrorWithStatus,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err, res, req);
  // send the error
  res.status(err.status || 500);
  res.json({ message: err.message });
});

export default app;
