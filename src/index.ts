#!/usr/bin/env node

import http from "http";
import app from "./app";
import { Request, Response, NextFunction, Errback } from "express";

app.use((err: Errback, req: Request, res: Response, next: NextFunction) => {
  // always log the error
  console.error("ERROR", req.method, req.path, err);

  // only render if the error ocurred before sending the response
  if (!res.headersSent) {
    res.status(500);
    res.send("error");
  }
});

const server = http.createServer(app);

server.on("error", (error:NodeJS.ErrnoException) => {
  if (error.syscall !== "listen") {
    throw error;
  }

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(`Port ${process.env.PORT} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(`Port ${process.env.PORT} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});


/*
export the app variable as a default export and only start the server 
if the file is being executed as opposed to being imported.
*/
if (require.main === module) { // true if file is executed
  server.listen(process.env.PORT, () => {
  console.log(`Listening on http://localhost:${process.env.PORT}`);
});
}



