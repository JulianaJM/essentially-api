'use strict';

import client from '../datasource/connection';
const MAX_SIZE = 200;
const INDEX = 'oils';

export default class ElasticsearchService {
  static search(term: string, offset: number) {
    return client.search({
      index: INDEX,
      body: {
        from: offset,
        query: {
          query_string: {
            fields: [
              'name^10',
              'ideal^4',
              '*indicationsDesc',
              '*indications',
              '*properties',
              '*synergies',
            ],
            query: '*'.concat(term, '*'),
            analyzer: 'simple',
            default_operator: 'AND',
          },
        },
      },
    }); 
  }

  static searchRecipe(term: string) {
    const newTerms = term.split(',');
    return client.search({
      index: INDEX,
      body: {
        query: {
          terms: {
            'recipes.recipesTitle': newTerms,
            boost: 1.0,
          },
        },
      },
    });
  }

  static searchAll() {
    return client.search({
      index: INDEX,
      body: {
        size: MAX_SIZE,
        query: {
          match_all: { boost: 1.2 },
        },
      },
    });
  }

  static searchByName(name: string) {
    return client.search({
      index: INDEX,
      body: {
        query: {
          match_phrase: {
            name: name,
          },
        },
      },
    });
  }

  static getSuggestions(term: string) {
    return client.search({
      index: INDEX,
      size: MAX_SIZE,
      body: {
        query: {
          query_string: {
            query: '"'.concat(term, '~"'),
            minimum_should_match: 2,
            fields: ['name', 'ideal'],
          },
        },
      },
    });
  }

  static getRandomOils() {
    return client.search({
      index: INDEX,
      body: {
        size: 10,
        query: {
          function_score: {
            functions: [
              {
                random_score: {
                  seed: '1518707649', // FIXME Pass the user’s session ID as the seed, to make randomization consistent for that user. The same seed will result in the same randomization.
                  field: "_seq_no"
                },
              },
            ],
          },
        },
      },
    });
  }
}
