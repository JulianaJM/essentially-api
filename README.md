# essentially-api

api for essential oils

## Version

- Node 16+
- Yarn 1.22+

## Installation

- download and start elasticsearch server locally (elasticsearch-7.1.1):

  - go to dir elasticsearch-7.1.1/config/elasticsearch.yml and add those lines :
    - Handle cors:
      - `http.cors.allow-origin: "*"`
      - `http.cors.enabled: true`
    - JVM issue:
      - `xpack.ml.enabled: false`

  ```bash
  cd elasticsearch-7.1.1/bin
  ./elasticsearch
  ```

- copy on the root directory the file in `_config_sample` directory and rename it to .env
- install dependencies : `yarn install`
- build (watch mode) : `yarn build:dev`
- start server : `yarn dev`
- you can now go to http://localhost:3000/api/oils

<!--
#### insert local data
cd src/resources
node init-data.js
!-->

## Troubleshooting

- if you have elasticsearch issue install java version less than 15

## Examples of usage with curl

### insert data :

cd src/resources (or archives)

- Création index + import mapping :
  `curl -XPUT -H "Content-Type: application/json" localhost:9200/oilsdetails -d @oils-details-mapping.json`

- Import json file
  `curl -XPOST "localhost:9200/_bulk?pretty" -H 'Content-Type: application/x-ndjson' --data-binary @oils-details_elastic.json`

### delete data :

`curl -X DELETE "localhost:9200/index_name"`

### examples of local requests

- elasticsearch server :

```
http://localhost:9200/oils/_search?size=200

http://localhost:9200/oils/_search?q=Copahu&pretty

http://localhost:9200/oils/_search?q=oil=copahu&pretty

http://localhost:9200/oils/_search?q=properties:peau sèche&pretty

http://localhost:9200/oils/_search?q=health.properties:Antiseptique%20AND%20health.synergies:lavande&pretty

http://localhost:9200/oils/_search?q=health.properties:Antiseptique%20AND%20-health.synergies:lavande&pretty
```

- express server

  http://localhost:3000/api/oils/results?values=copahu&offset=0

## Documentation

https://www.elastic.co/guide/en/elasticsearch/reference/current/elasticsearch-intro.html

https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/16.x/quick-start.html

https://medium.com/terragoneng/elastic-search-index-and-mapping-in-node-js-97d8f480e3c7

https://www.compose.com/articles/getting-started-with-elasticsearch-and-node/

https://github.com/zaiste/elasticsearch-nodejs-github-tutorial/blob/master/index.js

https://zaiste.net/nodejs_elasticsearch_github_setup/

https://www.elastic.co/guide/en/elasticsearch/guide/current/fuzzy-match-query.html

https://stackoverflow.com/questions/33225204/fuzzy-searching-with-query-string-elasticsearch

https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html#_fuzziness

https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-multi-match-query.html

https://opendistro.github.io/for-elasticsearch-docs/docs/elasticsearch/full-text/#options

#### typescript setup

https://gist.github.com/rupeshtiwari/e7235addd5f52dc3e449672c4d8b88d5

https://blog.logrocket.com/how-to-set-up-node-typescript-express/

https://stackoverflow.com/questions/65481943/typeerror-compiler-plugin-is-not-a-function-at-reactloadableplugin-apply
