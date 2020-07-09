const client = require("../datasource/connection.js");
const mapping = require("./oils-details-mapping.json");
const oils = require("./oils-details.json");
const log = require("log");
const INDEX = "oils";

const createIndexAndMapping = () => {
  return client.indices
    .create({
      index: INDEX
    })
    .then(() => {
      return client.indices.putMapping({
        index: INDEX,
        body: mapping
      });
    })
    .catch(err => {
      log.error("creation index error", err);
    });
};

const bulk = [];
const makeBulk = (oils, callback) => {
  oils.forEach(oil => {
    bulk.push({ index: { _index: INDEX } }, { ...oil });
  });
  callback(bulk);
};

const indexall = (madebulk, callback) => {
  client.bulk(
    {
      body: madebulk
    },
    (err, resp /* , status */) => {
      if (err) {
        log.error(err);
      } else {
        callback(resp.items);
      }
    }
  );
};

const deleteIndex = () => {
  return client.indices.delete({ index: INDEX });
};

const initCluster = () => {
  client.indices.exists({ index: INDEX }).then(exists => {
    if (exists) {
      log.info("delete index");
      deleteIndex();
    }
    createIndexAndMapping()
      .then(() => {
        makeBulk(oils, response => {
          log.info("Bulk content prepared");
          indexall(response, function(response) {
            log.info(response);
          });
        });
      })
      .catch(err => {
        log.error("bulk crask", err);
      });
  });
};

module.exports = initCluster;
