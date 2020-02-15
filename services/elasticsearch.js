const client = require("../datasource/connection");

const MAX_SIZE = 200;
const INDEX = "oils";

const buildFullTextSearchQuery = (terms, offset) => {
  let queryString = "";
  console.log(terms);
  terms.forEach((t, i) => {
    if (t) {
      if (i === terms.length - 1) {
        queryString += `(${t}~)`; // ~ enables fuzzy search
      } else {
        queryString += `(${t}~) OR `;
      }
    }
  });

  const body = {
    from: offset,
    query: {
      query_string: {
        query: queryString,
        // minimum_should_match: 2,
        fields: [
          "name",
          "ideal",
          "health.synergies",
          "mood.synergies",
          "beauty.synergies",
          "health.properties",
          "mood.properties",
          "beauty.properties",
          "health.indicationsDesc",
          "mood.indicationsDesc",
          "beauty.indicationsDesc",
          "health.indications",
          "mood.indications",
          "beauty.indications"
        ]
      }
    },
    highlight: {
      fields: {
        "*": {}
      }
    }
  };
  return body;
};

module.exports = {
  search: function(terms, offset) {
    const body = buildFullTextSearchQuery(terms, offset);
    return client.search({
      index: INDEX,
      body
    });
  },

  searchAll: function() {
    return client.search({
      index: INDEX,
      body: {
        size: MAX_SIZE,
        query: {
          match_all: { boost: 1.2 }
        }
      }
    });
  },

  searchByName: function(name) {
    return client.search({
      index: INDEX,
      body: {
        query: {
          match_phrase: {
            name
          }
        }
      }
    });
  },

  getSuggestions: function(term) {
    return client.search({
      index: INDEX,
      size: MAX_SIZE,
      body: {
        query: {
          multi_match: {
            query: term,
            fields: ["name", "ideal"]
          }
        }
      }
    });
  },

  getRandomOils: function() {
    return client.search({
      index: INDEX,
      body: {
        size: 8,
        query: {
          function_score: {
            functions: [
              {
                random_score: {
                  seed: "1518707649" // FIXME Pass the user’s session ID as the seed, to make randomization consistent for that user. The same seed will result in the same randomization.
                }
              }
            ]
          }
        }
      }
    });
  }
};
