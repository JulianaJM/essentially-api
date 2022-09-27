# essentially-api

api for essential oils

### Elasticsearch local server:

download elasticsearch-7.1.1
cd elasticsearch-7.1.1/bin
./elasticsearch

#### insert local data

cd src/datasouce
node init-data.js

curl insert examples :

cd src/resources (or archives)

- Création index + import mapping :
  curl -XPUT -H "Content-Type: application/json" localhost:9200/oilsdetails -d @oils-details-mapping.json

- Import json file (remove \ of \_bulk)
  curl -XPOST "localhost:9200/\_bulk?pretty" -H 'Content-Type: application/x-ndjson' --data-binary @oils-details_elastic.json

  - Handle cors
    go to dir elasticsearch-7.1.1/config/elasticsearch.yml
    http.cors.allow-origin: "\*" (remove \ of \*)
    http.cors.enabled: true
#### delete data

curl -X DELETE "localhost:9200/index_name"

http://localhost:9200/oils/_search?size=200

http://localhost:9200/oils/_search?q=Copahu&pretty

http://localhost:9200/oils/_search?q=oil=copahu&pretty

http://localhost:9200/oils/_search?q=properties:peau sèche&pretty

http://localhost:9200/oils/_search?q=health.properties:Antiseptique%20AND%20health.synergies:lavande&pretty

http://localhost:9200/oils/_search?q=health.properties:Antiseptique%20AND%20-health.synergies:lavande&pretty

### utils

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
