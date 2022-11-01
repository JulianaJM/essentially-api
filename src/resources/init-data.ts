import { estypes } from '@elastic/elasticsearch'
import client from '../datasource/connection';
import { Oil } from './interfaces';
import mapping from './oils-details-mapping.json';
import oils from './oils-details.json';
const log = require('log');
const INDEX = 'oils';

const createIndexAndMapping = async () => {
    try {
        const response = await client
        .indices
        .create({
            index: INDEX,
            operations: {
                mappings: mapping
            }
        })
    return response;
    } catch(error) {
        log.error('creation index error', error);

    }
};

const makeBulk = (oils:Oil[], callback:(bulkArr:[]) => void) => {
    // @ts-ignore
    const bulkArray = [];
    oils.forEach((oil) => {
        bulkArray.push({ index: { _index: INDEX } }, { ...oil });
    });
    // @ts-ignore
    callback(bulkArray);
};

// @ts-ignore
const indexallBulk = async (bulkArray, callback:(bulkresp:[]) => void) => {
    try {
        const bulkResponse = await client.bulk({ refresh: true, operations:bulkArray })
        callback(bulkResponse.items);
    } catch(err) {
        log.error(err);
    }
};

const deleteIndex = () => {
  return client.indices.delete({ index: INDEX });
};

const initCluster = () => {
  client.indices.exists({ index: INDEX }).then((exists:boolean) => {
    if (exists) {
      log.info('delete index');
      deleteIndex();
    }
    createIndexAndMapping()
      .then(() => {
        makeBulk(oils, (bulkArray) => {
          log.info('Bulk content prepared');
          indexallBulk(bulkArray, function (bulkResponse) {
            log.info(bulkResponse);
          });
        });
      })
      .catch((err: Error) => {
        log.error('bulk crask', err);
      });
  });
};

export default initCluster;
